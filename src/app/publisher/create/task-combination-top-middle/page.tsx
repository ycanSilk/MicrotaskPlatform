"use client";
import { Button, Input, AlertModal } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

// 上中评任务详情页 - 参考publish/page.tsx实现
// 1条上评 + 中评（数量可自定义选择，且支持@功能）

// 模式类型定义
type ModeType = 'custom' | 'three_plus';

export default function TaskCombinationTopMiddlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '上中评任务发布页';
  const taskIcon = searchParams.get('icon') || '🌟';
  const taskPrice = parseFloat(searchParams.get('price') || '0');
  const taskDescription = searchParams.get('description') || '任务描述';
  
  // 任务模式选择
  const [selectedMode, setSelectedMode] = useState<ModeType>('custom');
  
  // 新的表单数据结构，包含上评和多条中评
  const [formData, setFormData] = useState({
    videoUrl: '', // 上评视频链接
    topCommentUrl: '', // 上评完成链接
    middleCommentQuantity: 1, // 中评数量
    comments: {
      topComment: '🔺上评：这款产品真的很棒，质量很好，强烈推荐！',
      middleComment1: '🔺中评：产品还不错，使用体验良好，有需要的可以尝试。',
      middleComment2: selectedMode === 'three_plus' ? '🔺中评：整体表现中规中矩，符合预期。' : '',
      middleComment3: selectedMode === 'three_plus' ? '🔺中评：已经使用一段时间了，效果还行。' : '',
      middleComment4: selectedMode === 'three_plus' ? '🔺中评：性价比不错，值得购买。' : ''
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

  // 模式切换处理
  const handleModeChange = (mode: ModeType) => {
    setSelectedMode(mode);
    // 根据模式更新表单数据
    if (mode === 'three_plus') {
      setFormData(prevData => ({
        ...prevData,
        middleCommentQuantity: 3,
        comments: {
          ...prevData.comments,
          middleComment2: '🔺中评：整体表现中规中矩，符合预期。',
          middleComment3: '🔺中评：已经使用一段时间了，效果还行。',
          middleComment4: '🔺中评：性价比不错，值得购买。'
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        middleCommentQuantity: 1,
        comments: {
          ...prevData.comments,
          middleComment2: '',
          middleComment3: '',
          middleComment4: ''
        }
      }));
    }
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
      topComment: formData.comments.topComment + ' [AI优化]',
      middleComment1: formData.comments.middleComment1 + ' [AI优化]',
      middleComment2: formData.comments.middleComment2 ? formData.comments.middleComment2 + ' [AI优化]' : '',
      middleComment3: formData.comments.middleComment3 ? formData.comments.middleComment3 + ' [AI优化]' : '',
      middleComment4: formData.comments.middleComment4 ? formData.comments.middleComment4 + ' [AI优化]' : ''
    };
    
    setFormData(prevData => ({
      ...prevData,
      comments: optimizedComments
    }));
    showAlert('优化成功', '评论内容已通过AI优化！', '✨');
  };

  // 推荐评论功能
  const handleRecommendComments = () => {
    // 生成随机推荐评论
    const randomComments = {
      topComment: `🔺上评：这款产品真的很棒，质量很好，强烈推荐大家购买！`,
      middleComment1: mentions.length > 0 ? 
        `🔺中评：@${mentions[0]} 产品还不错，使用体验良好，有需要的可以尝试一下。` : 
        `🔺中评：产品还不错，使用体验良好，有需要的可以尝试一下。`,
      middleComment2: selectedMode === 'three_plus' ? `🔺中评：整体表现中规中矩，符合预期，值得考虑。` : '',
      middleComment3: selectedMode === 'three_plus' ? `🔺中评：已经使用一段时间了，效果还行，没有明显缺点。` : '',
      middleComment4: selectedMode === 'three_plus' ? `🔺中评：性价比不错，推荐给有需要的朋友。` : ''
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
    
    // 验证评论框的内容
    const allComments = Object.values(formData.comments).filter(Boolean);
    const hasEmptyComment = allComments.some(comment => !comment || comment.trim().length < 5);
    
    if (hasEmptyComment) {
      showAlert('输入错误', '请确保所有评论内容都已填写完整', '⚠️');
      return;
    }
    
    if (formData.middleCommentQuantity <= 0) {
      showAlert('输入错误', '中评任务数量必须大于0', '⚠️');
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

      // 计算总费用 - 上中评任务总价为上评价格+中评价格*数量
      const totalCost = taskPrice * (selectedMode === 'three_plus' ? 3 : formData.middleCommentQuantity);
      
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
        videoUrl: formData.videoUrl,
        topCommentUrl: formData.topCommentUrl,
        quantity: formData.middleCommentQuantity,
        deadline: formData.deadline,
        mentions: mentions,
        needImageComment: formData.needImageComment,
        taskMode: selectedMode
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
  const totalCost = (taskPrice * (selectedMode === 'three_plus' ? 3 : formData.middleCommentQuantity)).toFixed(2);

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
        {/* 任务模式选择 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            任务模式
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              onClick={() => handleModeChange('custom')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMode === 'custom' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
            >
              <h4 className="font-medium text-gray-900 mb-2">1条上评 + 中评（数量可自定义选择）</h4>
              <p className="text-gray-600 text-sm">自定义中评数量，支持@功能，适合灵活配置</p>
            </div>
            <div 
              onClick={() => handleModeChange('three_plus')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMode === 'three_plus' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
            >
              <h4 className="font-medium text-gray-900 mb-2">1条上评 + 3条中评</h4>
              <p className="text-gray-600 text-sm">固定3条中评，提供更全面的评论覆盖</p>
            </div>
          </div>
        </div>

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

        {/* 上评完成链接（结算条件） */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上评完成链接 <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="请输入上评完成后的链接（作为结算条件）"
            value={formData.topCommentUrl}
            onChange={(e) => setFormData({...formData, topCommentUrl: e.target.value})}
            className="w-full"
          />
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-lg">📝</span>
              <div>
                <h4 className="font-medium text-yellow-800 text-sm">操作教程</h4>
                <p className="text-yellow-700 text-xs mt-1">终端用户完成上评任务后，需将上评完成的链接复制至平台作为结算条件。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 中评任务数量 */}
        {selectedMode === 'custom' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中评任务数量
            </label>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setFormData({...formData, middleCommentQuantity: Math.max(1, formData.middleCommentQuantity - 1)})}
                className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
              >
                -
              </button>
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  value={formData.middleCommentQuantity.toString()}
                  onChange={(e) => setFormData({...formData, middleCommentQuantity: Math.max(1, parseInt(e.target.value) || 1)})}
                  className="w-full text-2xl font-bold text-gray-900 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setFormData({...formData, middleCommentQuantity: formData.middleCommentQuantity + 1})}
                className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              上评任务单价为¥3.0，中评任务单价为¥2.0
            </div>
          </div>
        )}

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
          
          {/* 上评评论 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上评内容
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入上评内容"
              value={formData.comments.topComment}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, topComment: e.target.value}})}
            />
          </div>
          
          {/* 中评评论1 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中评内容1
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入中评内容1"
              value={formData.comments.middleComment1}
              onChange={(e) => setFormData({...formData, comments: {...formData.comments, middleComment1: e.target.value}})}
            />
          </div>
          
          {/* 中评评论2 - 仅在three_plus模式下显示 */}
          {selectedMode === 'three_plus' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中评内容2
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="请输入中评内容2"
                value={formData.comments.middleComment2}
                onChange={(e) => setFormData({...formData, comments: {...formData.comments, middleComment2: e.target.value}})}
              />
            </div>
          )}
          
          {/* 中评评论3 - 仅在three_plus模式下显示 */}
          {selectedMode === 'three_plus' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中评内容3
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="请输入中评内容3"
                value={formData.comments.middleComment3}
                onChange={(e) => setFormData({...formData, comments: {...formData.comments, middleComment3: e.target.value}})}
              />
            </div>
          )}
          
          {/* 中评评论4 - 仅在three_plus模式下显示 */}
          {selectedMode === 'three_plus' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中评内容4
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="请输入中评内容4"
                value={formData.comments.middleComment4}
                onChange={(e) => setFormData({...formData, comments: {...formData.comments, middleComment4: e.target.value}})}
              />
            </div>
          )}
          
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
              <span className="font-medium">¥{(taskPrice * (selectedMode === 'three_plus' ? 3 : formData.middleCommentQuantity)).toFixed(2)}</span>
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
          disabled={!formData.videoUrl || !formData.topCommentUrl}
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