'use client';

import { Button, Input, AlertModal } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

export default function PublishTopCommentTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '上评任务';
  const taskIcon = searchParams.get('icon') || '⭐';
  const taskPrice = parseFloat(searchParams.get('price') || '3.0');
  const taskDescription = searchParams.get('description') || '真人账号发布高质量评论';
  
  const [formData, setFormData] = useState({
    videoUrl: '',
    quantity: 100,
    requirements: '',
    deadline: '24',
    needImageComment: false,
    comments: {
      comment1: '',
      comment2: '',
      comment3: ''
    }
  });

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
  const handleAIOptimizeComment = (commentIndex: number) => {
    const currentComment = commentIndex === 1 ? formData.comments.comment1 : 
                           commentIndex === 2 ? formData.comments.comment2 : formData.comments.comment3;
    
    if (!currentComment.trim()) {
      showAlert('提示', '请先输入评论内容再进行AI优化', '💡');
      return;
    }
    
    // 这里是模拟AI优化评论的逻辑
    const optimizedComment = `${currentComment}，整体感觉非常满意！做工精细，性价比高，值得推荐给身边的朋友。👍`;
    
    if (commentIndex === 1) {
      setFormData({...formData, comments: {...formData.comments, comment1: optimizedComment}});
    } else if (commentIndex === 2) {
      setFormData({...formData, comments: {...formData.comments, comment2: optimizedComment}});
    } else {
      setFormData({...formData, comments: {...formData.comments, comment3: optimizedComment}});
    }
    
    showAlert('优化成功', '评论内容已优化', '✅');
  };
  
  // 推荐评论功能
  const handleRecommendComment = (commentIndex: number) => {
    // 模拟随机评论推荐
    const recommendations = [
      "产品质量很好，使用体验不错，值得购买！",
      "这个产品真的很赞，做工精细，功能实用，强烈推荐！",
      "收到货后很满意，物流也很快，客服态度很好。",
      "使用了一段时间，效果很好，性价比高，值得推荐。",
      "产品超出预期，包装精美，使用简单，很满意这次购物！"
    ];
    
    const randomComment = recommendations[Math.floor(Math.random() * recommendations.length)];
    
    if (commentIndex === 1) {
      setFormData({...formData, comments: {...formData.comments, comment1: randomComment}});
    } else if (commentIndex === 2) {
      setFormData({...formData, comments: {...formData.comments, comment2: randomComment}});
    } else {
      setFormData({...formData, comments: {...formData.comments, comment3: randomComment}});
    }
    
    showAlert('推荐成功', '已为您推荐评论内容', '✅');
  };
  
  // 发布任务
  const handlePublish = async () => {
    // 表单验证 - 完整验证逻辑
    if (!formData.videoUrl) {
      showAlert('输入错误', '请输入视频链接', '⚠️');
      return;
    }
    
    // 合并三个评论输入框的内容作为requirements
    let allComments = '';
    if (formData.comments.comment1) allComments += formData.comments.comment1 + '\n';
    if (formData.comments.comment2) allComments += formData.comments.comment2 + '\n';
    if (formData.comments.comment3) allComments += formData.comments.comment3;
    
    if (!allComments || allComments.trim().length < 10) {
      showAlert('输入错误', '请至少输入一段评论内容，至少10个字符', '⚠️');
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

      // 合并三个评论输入框的内容作为requirements
      let allComments = '';
      if (formData.comments.comment1) allComments += formData.comments.comment1 + '\n';
      if (formData.comments.comment2) allComments += formData.comments.comment2 + '\n';
      if (formData.comments.comment3) allComments += formData.comments.comment3;
      
      // 构建API请求体
      const requestBody = {
        taskId: taskId || '',
        taskTitle,
        taskPrice: taskPrice,
        requirements: allComments,
        videoUrl: formData.videoUrl,
        quantity: formData.quantity,
        deadline: formData.deadline,
        mentions: [], // 上评任务不需要@标记
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
            上评任务单价为¥3.0
          </div>
        </div>

        {/* 派单示例模块 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            派单示例
          </label>
          <div className="text-sm text-gray-500 mb-3">
            请输入3种不同类型的评论内容，系统会随机分配给评论员
          </div>
          
          {/* 第一种评论类型 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">评论类型一 (强调产品质量)</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAIOptimizeComment(1)}
                  className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                >
                  AI优化评论
                </Button>
                <Button
                  onClick={() => handleRecommendComment(1)}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  推荐评论
                </Button>
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入强调产品质量的评论内容，例如：产品质量非常好，做工精细，材质优良..."
              value={formData.comments.comment1}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, comment1: e.target.value}})}
            />
          </div>
          
          {/* 第二种评论类型 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">评论类型二 (强调使用体验)</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAIOptimizeComment(2)}
                  className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                >
                  AI优化评论
                </Button>
                <Button
                  onClick={() => handleRecommendComment(2)}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  推荐评论
                </Button>
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入强调使用体验的评论内容，例如：使用起来非常流畅，操作简单，功能实用..."
              value={formData.comments.comment2}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, comment2: e.target.value}})}
            />
          </div>
          
          {/* 第三种评论类型 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">评论类型三 (强调性价比)</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAIOptimizeComment(3)}
                  className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                >
                  AI优化评论
                </Button>
                <Button
                  onClick={() => handleRecommendComment(3)}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  推荐评论
                </Button>
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入强调性价比的评论内容，例如：价格实惠，物超所值，比同类产品更具优势..."
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
              是否需要图片评论，图片评论请在评论内容中明确图片内容要求，然后评论时按照要求发送图片评论。
            </label>
          </div>
          {formData.needImageComment && (
            <div className="mt-2 text-sm text-gray-500">
              请在评论内容中明确图片内容要求
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