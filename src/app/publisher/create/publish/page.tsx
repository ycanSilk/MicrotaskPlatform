'use client';

import { Button, Input, AlertModal } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

export default function PublishTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '中评任务发布页';
  const taskIcon = searchParams.get('icon') || '📝';
  const taskPrice = parseFloat(searchParams.get('price') || '0');
  const taskDescription = searchParams.get('description') || '任务描述';
  
  // 新的表单数据结构，包含三个独立的评论输入框
  const [formData, setFormData] = useState({
    videoUrl: '',
    quantity: 100,
    comments: {
      comment1: '🔺终端评论1，XXXXXXXXX',
      comment2: '🔺终端评论2，xxxxxxxxx',
      comment3: '🔺终端评论3，@xxx xxx'
    },
    deadline: '24',
    needImageComment: false
  });

  const [mentionInput, setMentionInput] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);

  const handleAddMention = () => {
    const trimmedMention = mentionInput.trim();
    // 确保用户昵称ID唯一
    if (trimmedMention && !mentions.includes(trimmedMention)) {
      setMentions([...mentions, trimmedMention]);
      setMentionInput('');
    } else if (mentions.includes(trimmedMention)) {
      showAlert('提示', '该用户昵称ID已添加', '💡');
    }
  };

  const removeMention = (mention: string) => {
    setMentions(mentions.filter(m => m !== mention));
  };

  const [isPublishing, setIsPublishing] = useState(false);

  // 通用提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttonText: '确认',
    onButtonClick: () => {}
  });

  // 显示通用提示框
  const showAlert = (
    title: string, 
    message: string, 
    icon: string, 
    buttonText?: string, 
    onButtonClick?: () => void
  ) => {
    setAlertConfig({
      title, 
      message, 
      icon,
      buttonText: buttonText || '确认',
      onButtonClick: onButtonClick || (() => {})
    });
    setShowAlertModal(true);
  };

  // AI优化评论功能
  const handleAIOptimizeComments = () => {
    // 模拟AI优化评论的逻辑
    // 实际项目中可能需要调用AI API
    setFormData(prevData => ({
      ...prevData,
      comments: {
        comment1: prevData.comments.comment1 + ' [AI优化]',
        comment2: prevData.comments.comment2 + ' [AI优化]',
        comment3: prevData.comments.comment3 + ' [AI优化]'
      }
    }));
    showAlert('优化成功', '评论内容已通过AI优化！', '✨');
  };

  // 推荐评论功能
  const handleRecommendComments = () => {
    // 生成随机推荐评论
    const randomComments = {
      comment1: `🔺终端评论1，这款产品真的不错，质量很好，使用体验非常满意！`,
      comment2: `🔺终端评论2，已经使用一段时间了，效果很好，值得推荐给大家！`,
      comment3: mentions.length > 0 
        ? `🔺终端评论3，@${mentions[0]} 这个产品真的很棒，你也可以试试看！` 
        : `🔺终端评论3，@xxx 这款产品值得购买，性价比很高！`
    };
    
    setFormData(prevData => ({
      ...prevData,
      comments: randomComments
    }));
    showAlert('推荐成功', '已为您生成随机推荐评论！', '🎉');
  };

  // 发布任务
  const handlePublish = async () => {
    // 表单验证 - 完整验证逻辑
    if (!formData.videoUrl) {
      showAlert('输入错误', '请输入视频链接', '⚠️');
      return;
    }
    
    // 验证三个评论框的内容
    const allComments = Object.values(formData.comments);
    const hasEmptyComment = allComments.some(comment => !comment || comment.trim().length < 5);
    
    if (hasEmptyComment) {
      showAlert('输入错误', '请确保所有评论内容都已填写完整', '⚠️');
      return;
    }
    
    if (formData.quantity <= 0) {
      showAlert('输入错误', '任务数量必须大于0', '⚠️');
      return;
    }

    // 显示加载状态
    setIsPublishing(true);
    console.log('开始发布任务...');
    console.log('表单数据:', formData);
    console.log('任务ID:', taskId);

    try {
      // 使用PublisherAuthStorage获取认证token和用户信息
      const auth = PublisherAuthStorage.getAuth();
      const token = auth?.token;
      const userInfo = PublisherAuthStorage.getCurrentUser();
      
      console.log('[任务发布] 认证信息:', { token: token ? '存在' : '不存在', userInfo });
      
      if (!token || !userInfo) {
        console.log('[任务发布] 认证失败: 用户未登录或会话已过期');
        showAlert('认证失败', '用户未登录，请重新登录', '❌');
        // 使用setTimeout延迟跳转，确保用户看到提示
        setTimeout(() => {
          router.push('/publisher/login' as any);
        }, 1500);
        return;
      }

      // 计算总费用
      const totalCost = taskPrice * formData.quantity;
      
      // 余额校验 - 获取当前用户的可用余额
      console.log('[任务发布] 开始余额校验，总费用:', totalCost);
      const balanceResponse = await fetch('/api/publisher/finance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      const balanceData = await balanceResponse.json();
      console.log('[任务发布] 余额校验结果:', balanceData);
      
      if (!balanceData.success || !balanceData.data) {
        console.log('[任务发布] 获取余额失败');
        showAlert('系统错误', '获取账户余额失败，请稍后重试', '❌');
        return;
      }
      
      // 获取可用余额
      const availableBalance = balanceData.data.balance?.available || 0;
      console.log('[任务发布] 当前可用余额:', availableBalance);
      
      // 比较余额和总费用
      if (availableBalance < totalCost) {
        console.log('[任务发布] 余额不足，可用余额:', availableBalance, '总费用:', totalCost);
        showAlert(
          '余额不足', 
          `您的账户可用余额为 ¥${availableBalance.toFixed(2)}，完成此任务需要 ¥${totalCost.toFixed(2)}，请先充值再发布任务。`, 
          '⚠️'
        );
        return;
      }
      
      console.log('[任务发布] 余额充足，继续发布流程');

      // 构建API请求体 - 将三个评论合并为一个requirements字段
      const requirements = allComments.join('\n\n');
      
      const requestBody = {
        taskId: taskId || '',
        taskTitle,
        taskPrice: taskPrice,
        requirements: requirements,
        videoUrl: formData.videoUrl,
        quantity: formData.quantity,
        deadline: formData.deadline,
        mentions: mentions,
        needImageComment: formData.needImageComment
      };

      console.log('API请求体:', requestBody);
      
      // 调用API发布任务
      const response = await fetch('/api/publisher/comment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('API响应状态:', response.status);

      const result = await response.json();
      console.log('API响应结果:', result);
      
      if (result.success) {
        // 修改为用户点击确认后才跳转
        showAlert(
          '发布成功', 
          `任务发布成功！订单号：${result.order?.orderNumber || ''}`, 
          '✅',
          '确定',
          () => {
            // 在用户点击确认按钮后跳转
            router.push('/publisher/dashboard');
          }
        );
      } else {
        // 发布失败，显示错误提示
        if (result.errorType === 'InsufficientBalance') {
          // 特定处理余额不足的情况
          showAlert('账户余额不足', '您的账户余额不足以支付任务费用，请先充值后再尝试发布任务。', '⚠️', '前往充值', () => {
            router.push('/publisher/finance');
          });
        } else {
          showAlert('发布失败', `任务发布失败: ${result.message || '未知错误'}`, '❌');
        }
      }
    } catch (error) {
      console.error('发布任务时发生错误:', error);
      showAlert('网络错误', '发布任务时发生错误，请稍后重试', '⚠️');
    } finally {
      setIsPublishing(false);
    }
  };

  const totalCost = (taskPrice * formData.quantity).toFixed(2);

  // 如果没有找到任务类型，返回错误页面
  if (!taskId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-lg font-medium text-gray-800 mb-2">任务信息不完整</div>
          <Button 
            onClick={() => router.push('/publisher/create')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回选择任务
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex mb-4 items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 w-20 hover:shadow-md transition-all">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-full h-full text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
          >
            ← 返回
          </button>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <h1 className="text-xl font-bold">发布{taskTitle}</h1>
        </div>
        
        {/* 任务信息展示 */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-xl">
              {taskIcon}
            </div>
            <div>
              <h3 className="font-bold text-white">{taskTitle}</h3>
              <p className="text-blue-100 text-sm">单价: ¥{taskPrice}</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm">{taskDescription}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 视频链接 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            视频链接 <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="请输入抖音视频链接"
            value={formData.videoUrl}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            className="w-full"
          />
        </div>

        {/* 任务数量 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务数量
          </label>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setFormData({...formData, quantity: Math.max(0, formData.quantity - 10)})}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
            >
              -
            </button>
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                value={formData.quantity.toString()}
                onChange={(e) => setFormData({...formData, quantity: Math.max(0, parseInt(e.target.value) || 0)})}
                className="w-full text-2xl font-bold text-gray-900 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setFormData({...formData, quantity: formData.quantity + 10})}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
            >
              +
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {taskId === 'comment_top' && '上评任务单价为¥3.0'}
            {taskId === 'comment_middle' && '中评任务单价为¥2.0'}
          </div>
        </div>

        {/* @用户标记 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            @用户标记
          </label>
          <div className="space-y-3">
            <Input
              placeholder="输入用户ID或昵称"
              value={mentionInput}
              onChange={(e) => setMentionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMention()}
              className="w-full"
            />
            <Button 
              onClick={handleAddMention}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              添加用户标记
            </Button>
          </div>
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {mentions.map((mention, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>@{mention}</span>
                  <button 
                    onClick={() => removeMention(mention)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 派单示例模块 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            派单示例模块
          </label>
          
          {/* AI优化和推荐评论功能按钮 */}
          <div className="flex space-x-3 mb-4">
            <Button 
              onClick={handleAIOptimizeComments}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              AI优化评论
            </Button>
            <Button 
              onClick={handleRecommendComments}
              className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              推荐评论
            </Button>
          </div>
          
          {/* 评论1 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评论1
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入终端评论1的内容"
              value={formData.comments.comment1}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, comment1: e.target.value}})}
            />
          </div>
          
          {/* 评论2 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评论2
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入终端评论2的内容，支持选择增加条数，可通过AI生成评论词，允许手动修改，支持多条评论，不限数量"
              value={formData.comments.comment2}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, comment2: e.target.value}})}
            />
          </div>
          
          {/* 评论3 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评论3
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入终端评论3的内容，集成@昵称添加框，支持固定@对象"
              value={formData.comments.comment3}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, comment3: e.target.value}})}
            />
            
       
          </div>
          
          {/* 图片评论勾选功能 */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="needImageComment"
              checked={formData.needImageComment}
              onChange={(e) => setFormData({...formData, needImageComment: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="needImageComment" className="block text-sm font-medium text-gray-700">
              是否需要图片评论，图片评论请在任务要求中明确图片内容要求，然后评论时按照要求发送图片评论。
            </label>
          </div>
          {formData.needImageComment && (
            <div className="mt-2 text-sm text-gray-500">
              请在任务要求中明确图片内容要求
            </div>
          )}
        </div>

        {/* 截止时间 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务截止时间
          </label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          >
            <option value="0.5">30分钟内</option>
            <option value="12">12小时</option>
            <option value="24">24小时</option>
          </select>
        </div>

        {/* 费用预览 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">费用预览</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">任务费用</span>
              <span className="font-medium">¥{(taskPrice * formData.quantity).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">总计费用</span>
                <span className="font-bold text-lg text-orange-500">¥{totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定发布按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
        <Button 
          onClick={handlePublish}
          disabled={!formData.videoUrl}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
        >
          立即发布任务 - ¥{totalCost}
        </Button>
        <Button 
          onClick={() => router.back()}
          variant="secondary"
          className="w-full py-3 border border-gray-200 text-gray-700 rounded-2xl"
        >
          取消
        </Button>
      </div>

      {/* 通用提示框组件 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        buttonText={alertConfig.buttonText}
        onButtonClick={() => {
          alertConfig.onButtonClick();
          setShowAlertModal(false);
        }}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}