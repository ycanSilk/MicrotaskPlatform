"use client";
import { Button, Input, AlertModal } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

// 中下评任务详情页 - 参考publish/page.tsx实现
// 1条中评 + 2条下评（其中1条带@功能）

export default function TaskCombinationMiddleBottomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '中下评任务发布页';
  const taskIcon = searchParams.get('icon') || '🌟';
  const taskPrice = parseFloat(searchParams.get('price') || '0');
  const taskDescription = searchParams.get('description') || '任务描述';
  
  // 新的表单数据结构，包含中评和两条下评
  const [formData, setFormData] = useState({
    reviewLink: '', // 上评链接
    comments: {
      middleComment: '🔺中评：产品还不错，使用体验良好，有需要的可以尝试。',
      bottomComment1: '🔻下评：这款产品质量一般，不太符合我的预期。',
      bottomComment2: '🔻下评：使用后感觉一般，不太推荐。'
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
    const optimizedComments = {
      ...formData.comments,
      middleComment: formData.comments.middleComment + ' [AI优化]',
      bottomComment1: formData.comments.bottomComment1 + ' [AI优化]',
      bottomComment2: formData.comments.bottomComment2 + ' [AI优化]'
    };
    
    setFormData(prevData => ({
      ...prevData,
      comments: optimizedComments
    }));
    showAlert('优化成功', '评论内容已通过AI优化！', '✨');
  };

  // 推荐评论功能
  const handleRecommendComments = () => {
    // 生成随机推荐评论，确保下评评论2带@功能
    const randomComments = {
      middleComment: `🔺中评：这款产品整体表现一般，部分功能还可以再改进。`,
      bottomComment1: `🔻下评：使用效果不太理想，性价比不高。`,
      bottomComment2: mentions.length > 0 ? 
        `🔻下评：@${mentions[0]} 产品质量一般，不太符合预期，不太推荐购买。` : 
        `🔻下评：产品质量一般，不太符合预期，不太推荐购买。`
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
    if (!formData.reviewLink) {
      showAlert('输入错误', '请输入上评链接', '⚠️');
      return;
    }
    
    // 验证评论框的内容
    const allComments = Object.values(formData.comments).filter(Boolean);
    const hasEmptyComment = allComments.some(comment => !comment || comment.trim().length < 5);
    
    if (hasEmptyComment) {
      showAlert('输入错误', '请确保所有评论内容都已填写完整', '⚠️');
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

      // 计算总费用 - 中下评任务总价为中评价格+下评价格*2
      const totalCost = taskPrice * 2;
      
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

      // 构建API请求体 - 将评论合并为requirements字段
      const requirements = allComments.join('\n\n');
      
      const requestBody = {
        taskId: taskId || '',
        taskTitle,
        taskPrice: taskPrice,
        requirements: requirements,
        reviewLink: formData.reviewLink,
        quantity: 2, // 固定2条下评
        deadline: formData.deadline,
        mentions: mentions,
        needImageComment: formData.needImageComment,
        taskMode: 'middle_bottom'
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

  // 计算总费用
  const totalCost = (taskPrice * 2).toFixed(2);

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
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-6">
        <div className="flex mb-4 items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 w-20 hover:shadow-md transition-all">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-full h-full text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
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
              <p className="text-orange-100 text-sm">单价: ¥{taskPrice}</p>
            </div>
          </div>
          <p className="text-orange-100 text-sm">{taskDescription}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 任务流程说明 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">任务流程</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">1</div>
              <div className="text-gray-700">复制上评链接发送派单</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">2</div>
              <div className="text-gray-700">完成1条中评任务</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">3</div>
              <div className="text-gray-700">完成2条下评任务（其中需包含1条带@功能的下评）</div>
            </div>
          </div>
        </div>

        {/* 上评链接 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上评链接 <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="请输入上评链接"
            value={formData.reviewLink}
            onChange={(e) => setFormData({...formData, reviewLink: e.target.value})}
            className="w-full"
          />
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-lg">📝</span>
              <div>
                <h4 className="font-medium text-yellow-800 text-sm">操作教程</h4>
                <p className="text-yellow-700 text-xs mt-1">请复制需要进行中下评的上评链接，作为任务派单的基础。</p>
              </div>
            </div>
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
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              添加用户标记
            </Button>
          </div>
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {mentions.map((mention, index) => (
                <div key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>@{mention}</span>
                  <button 
                    onClick={() => removeMention(mention)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="font-medium text-blue-800 text-sm">提示</h4>
                <p className="text-blue-700 text-xs mt-1">请至少添加一个用户标记，系统会自动将标记添加到下评评论中。</p>
              </div>
            </div>
          </div>
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
          
          {/* 中评评论 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中评内容
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入中评内容"
              value={formData.comments.middleComment}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, middleComment: e.target.value}})}
            />
          </div>
          
          {/* 下评评论1 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              下评内容1
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入下评内容1"
              value={formData.comments.bottomComment1}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, bottomComment1: e.target.value}})}
            />
          </div>
          
          {/* 下评评论2 (带@功能) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              下评内容2（需要带@功能）
            </label>
            <textarea
              className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入下评内容2（需要带@功能）"
              value={formData.comments.bottomComment2}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, bottomComment2: e.target.value}})}
            />
            <div className="mt-2 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <h4 className="font-medium text-orange-800 text-sm">重要提示</h4>
                  <p className="text-orange-700 text-xs mt-1">请确保此条下评评论中包含@用户标记。点击"推荐评论"按钮可自动生成带@标记的评论。</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 图片评论勾选功能 */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="needImageComment"
              checked={formData.needImageComment}
              onChange={(e) => setFormData({...formData, needImageComment: e.target.checked})}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <span className="font-medium">¥{(taskPrice * 2).toFixed(2)}</span>
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
          disabled={!formData.reviewLink}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
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