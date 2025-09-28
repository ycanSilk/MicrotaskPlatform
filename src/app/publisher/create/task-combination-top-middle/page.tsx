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
  const taskTitle = searchParams.get('title') || '上中评任务发布页';
  const taskIcon = searchParams.get('icon') || '📝';
  const taskPrice = parseFloat(searchParams.get('price') || '0');
  const taskDescription = searchParams.get('description') || '任务描述';
  
  // @用户相关状态 - 分别为上评和中评设置
  const [topMentionInput, setTopMentionInput] = useState('');
  const [topMentions, setTopMentions] = useState<string[]>([]);
  const [middleMentionInput, setMiddleMentionInput] = useState('');
  const [middleMentions, setMiddleMentions] = useState<string[]>([]);
  
  // 新的表单数据结构，分离上评和中评的数据
  const [formData, setFormData] = useState({
    videoUrl: '',
    
    // 上评评论模块 - 固定为1条
    topComment: {
      content: '🔺上评评论，XXXXXXXXX',
      image: null as File | null
    },
    
    // 中评评论模块 - 默认3条
    middleQuantity: 3,
    middleComments: [
      {
        content: '🔺中评评论1，XXXXXXXXX',
        image: null as File | null
      },
      {
        content: '🔺中评评论2，xxxxxxxxx',
        image: null as File | null
      },
      {
        content: '🔺中评评论3，xxxxxxxx',
        image: null as File | null
      }
    ],
    
    deadline: '24'
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

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

  // 处理中评任务数量变化，实现与评论输入框的联动
  const handleMiddleQuantityChange = (newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // 允许数量为0，实现完全移除
    setFormData(prevData => {
      let newComments = [...prevData.middleComments];
      
      // 如果新数量大于现有评论数量，添加新评论
      while (newComments.length < quantity) {
        newComments.push({
          content: `🔺中评评论${newComments.length + 1}，请输入评论内容`,
          image: null
        });
      }
      
      // 如果新数量小于现有评论数量，移除多余评论
      if (newComments.length > quantity) {
        newComments.splice(quantity);
      }
      
      // 检查是否有@用户标记，如果有，确保它在最新的最后一条评论中
      if (middleMentions.length > 0 && quantity > 0) {
        // 先从所有评论中移除@用户标记
        newComments = newComments.map(comment => ({
          ...comment,
          content: comment.content.replace(/ @\S+/g, '')
        }));
        
        // 然后将@用户标记添加到最新的最后一条评论
        const lastIndex = newComments.length - 1;
        newComments[lastIndex] = {
          ...newComments[lastIndex],
          content: newComments[lastIndex].content 
            ? `${newComments[lastIndex].content} @${middleMentions[0]}` 
            : `@${middleMentions[0]}`
        };
      }
      
      return {
        ...prevData,
        middleQuantity: quantity,
        middleComments: newComments
      };
    });
  };
  
  // 处理添加上评@用户标记
  const handleAddTopMention = () => {
    const trimmedMention = topMentionInput.trim();
    
    // 1. 检查是否已经有一个@用户（限制数量为1）
    if (topMentions.length >= 1) {
      showAlert('提示', '上评仅支持添加一个@用户', '💡');
      return;
    }
    
    // 2. 非法字符校验（只允许字母、数字、下划线、中文和@符号）
    const validPattern = /^[a-zA-Z0-9_\u4e00-\u9fa5@]+$/;
    if (!validPattern.test(trimmedMention)) {
      showAlert('提示', '用户ID或昵称包含非法字符，仅支持字母、数字、下划线和中文', '⚠️');
      return;
    }
    
    // 3. 确保用户昵称ID唯一
    if (trimmedMention && !topMentions.includes(trimmedMention)) {
      setTopMentions([trimmedMention]); // 只保留一个用户
      setTopMentionInput('');
      
      // 将@标记插入到上评评论中
      setFormData(prevData => ({
        ...prevData,
        topComment: {
          ...prevData.topComment,
          content: prevData.topComment.content 
            ? `${prevData.topComment.content} @${trimmedMention}` 
            : `@${trimmedMention}`
        }
      }));
    } else if (topMentions.includes(trimmedMention)) {
      showAlert('提示', '该用户昵称ID已添加', '💡');
    }
  };
  
  // 处理添加中评@用户标记
  const handleAddMiddleMention = () => {
    const trimmedMention = middleMentionInput.trim();
    
    // 1. 检查是否已经有一个@用户（限制数量为1）
    if (middleMentions.length >= 1) {
      showAlert('提示', '中评仅支持添加一个@用户', '💡');
      return;
    }
    
    // 2. 非法字符校验（只允许字母、数字、下划线、中文和@符号）
    const validPattern = /^[a-zA-Z0-9_\u4e00-\u9fa5@]+$/;
    if (!validPattern.test(trimmedMention)) {
      showAlert('提示', '用户ID或昵称包含非法字符，仅支持字母、数字、下划线和中文', '⚠️');
      return;
    }
    
    // 3. 确保用户昵称ID唯一
    if (trimmedMention && !middleMentions.includes(trimmedMention)) {
      setMiddleMentions([trimmedMention]); // 只保留一个用户
      setMiddleMentionInput('');
      
      // 将@标记插入到中评评论列表的最后一条
      if (formData.middleComments.length > 0) {
        const lastIndex = formData.middleComments.length - 1;
        setFormData(prevData => ({
          ...prevData,
          middleComments: prevData.middleComments.map((comment, index) => 
            index === lastIndex 
              ? { 
                  ...comment, 
                  content: comment.content 
                    ? `${comment.content} @${trimmedMention}` 
                    : `@${trimmedMention}` 
                } 
              : comment
          )
        }));
      }
    } else if (middleMentions.includes(trimmedMention)) {
      showAlert('提示', '该用户昵称ID已添加', '💡');
    }
  };
  
  // 移除上评@用户标记
  const removeTopMention = (mention: string) => {
    setTopMentions(topMentions.filter(m => m !== mention));
    
    // 从上评评论中移除该@标记
    setFormData(prevData => ({
      ...prevData,
      topComment: {
        ...prevData.topComment,
        content: prevData.topComment.content?.replace(` @${mention}`, '').replace(`@${mention}`, '') || prevData.topComment.content
      }
    }));
  };
  
  // 移除中评@用户标记
  const removeMiddleMention = (mention: string) => {
    setMiddleMentions(middleMentions.filter(m => m !== mention));
    
    // 从中评所有评论中移除该@标记
    setFormData(prevData => ({
      ...prevData,
      middleComments: prevData.middleComments.map(comment => ({
        ...comment,
        content: comment.content?.replace(` @${mention}`, '').replace(`@${mention}`, '') || comment.content
      }))
    }));
  };

  // AI优化上评评论功能
  const handleAITopCommentOptimize = async () => {
    setIsOptimizing(true);
    try {
      // 模拟AI优化评论的逻辑
      // 实际项目中可能需要调用AI API
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
      setFormData(prevData => ({
        ...prevData,
        topComment: {
          ...prevData.topComment,
          content: prevData.topComment.content + ' [AI优化]'
        }
      }));
      showAlert('优化成功', '上评评论内容已通过AI优化！', '✨');
    } catch (error) {
      showAlert('优化失败', 'AI优化过程中发生错误，请重试！', '❌');
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // AI优化中评评论功能
  const handleAIMiddleCommentsOptimize = async () => {
    setIsOptimizing(true);
    try {
      // 模拟AI优化评论的逻辑
      // 实际项目中可能需要调用AI API
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
      setFormData(prevData => ({
        ...prevData,
        middleComments: prevData.middleComments.map(comment => ({
          ...comment,
          content: comment.content + ' [AI优化]'
        }))
      }));
      showAlert('优化成功', '中评评论内容已通过AI优化！', '✨');
    } catch (error) {
      showAlert('优化失败', 'AI优化过程中发生错误，请重试！', '❌');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 图片压缩函数
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 保持原图宽高比例
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // 质量参数，从0到1，1表示最佳质量
          let quality = 0.9;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // 如果压缩后大小仍大于200KB，继续降低质量
          while (compressedDataUrl.length * 0.75 > 200 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          // 将DataURL转换回File对象
          const byteString = atob(compressedDataUrl.split(',')[1]);
          const mimeString = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          
          const blob = new Blob([ab], { type: mimeString });
          const compressedFile = new File([blob], file.name, { type: mimeString });
          resolve(compressedFile);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理上评图片上传
  const handleTopImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 压缩图片
      const compressedFile = await compressImage(file);
      
      // 更新表单数据中的图片
      setFormData(prevData => ({
        ...prevData,
        topComment: {
          ...prevData.topComment,
          image: compressedFile
        }
      }));
      
      showAlert('上传成功', '上评图片已成功上传并压缩！', '✅');
    } catch (error) {
      showAlert('上传失败', '上评图片上传失败，请重试', '❌');
    }
  };
  
  // 处理中评图片上传
  const handleMiddleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 压缩图片
      const compressedFile = await compressImage(file);
      
      // 更新表单数据中的图片
      setFormData(prevData => ({
        ...prevData,
        middleComments: prevData.middleComments.map((comment, i) => 
          i === index ? { ...comment, image: compressedFile } : comment
        )
      }));
      
      showAlert('上传成功', '中评图片已成功上传并压缩！', '✅');
    } catch (error) {
      showAlert('上传失败', '中评图片上传失败，请重试', '❌');
    }
  };

  // 移除上评已上传的图片
  const removeTopImage = () => {
    setFormData(prevData => ({
      ...prevData,
      topComment: {
        ...prevData.topComment,
        image: null
      }
    }));
  };
  
  // 移除中评已上传的图片
  const removeMiddleImage = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      middleComments: prevData.middleComments.map((comment, i) => 
        i === index ? { ...comment, image: null } : comment
      )
    }));
  };

  // 发布任务
  const handlePublish = async () => {
    // 表单验证 - 完整验证逻辑
    if (!formData.videoUrl) {
      showAlert('输入错误', '请输入视频链接', '⚠️');
      return;
    }
    
    // 验证中评任务数量
    if (formData.middleQuantity === undefined || formData.middleQuantity === 0) {
      showAlert('输入错误', '请至少设置1条中评评论', '⚠️');
      return;
    }
    
    // 评论已调整为可选填项，不再强制验证

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

      // 计算总费用（上评1条 + 中评数量）
      const totalCost = taskPrice * (1 + formData.middleQuantity);
      
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

      // 构建API请求体 - 分别处理上评和中评
      const topRequirement = formData.topComment.content;
      const middleRequirements = formData.middleComments.map(comment => comment.content).join('\n\n');
      
      // 合并所有评论要求
      const requirements = `=== 上评评论 ===\n${topRequirement}\n\n=== 中评评论 ===\n${middleRequirements}`;
      
      const requestBody = {
        taskId: taskId || '',
        taskTitle,
        taskPrice: taskPrice,
        requirements: requirements,
        videoUrl: formData.videoUrl,
        quantity: 1 + formData.middleQuantity, // 上评1条 + 中评数量
        deadline: formData.deadline,
        // 合并@用户标记
        mentions: [...topMentions, ...middleMentions],
        needImageComment: true // 由于我们总是允许图片上传，设为true
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

  // 计算总费用（上评1条 + 中评数量）
  const totalCost = (taskPrice * (1 + formData.middleQuantity)).toFixed(2);

  // 如果没有找到任务类型，返回错误页面
  if (!taskId) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center text-red-500 mt-10">
          任务类型不存在
        </h1>
        <Button 
          variant="primary" 
          onClick={() => router.back()}
          className="mx-auto block mt-4"
        >
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="task-publisher-container">
      <div className="header">
        <h1>上中评任务发布页</h1>
        <Button 
          variant="secondary" 
          onClick={() => router.back()}
          className="back-button"
        >
          返回
        </Button>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label className="form-label">视频链接</label>
          <Input
            placeholder="请输入视频链接（支持抖音、快手等）"
            value={formData.videoUrl}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            className="wide-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">截止时间</label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            className="datetime-input"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* 上评评论区域 */}
        <div className="task-section">
          <h2 className="section-title">上评评论（1条）</h2>
          <div className="form-group">
            <div className="comment-section-header">
              <label className="form-label">评论内容</label>
              <div className="comment-actions">
                <Button 
                  variant="secondary"
                  onClick={handleAITopCommentOptimize}
                  disabled={isOptimizing}
                  className="secondary-button"
                >
                  {isOptimizing ? 'AI优化中...' : 'AI优化评论'}
                </Button>
              </div>
            </div>

            <div className="comment-item">
              <textarea
                className="comment-textarea"
                placeholder="请输入上评评论内容"
                value={formData.topComment.content}
                onChange={(e) => {
                  setFormData({...formData, topComment: { ...formData.topComment, content: e.target.value } });
                }}
                rows={4}
              />
              
              {/* 图片上传区域 */}
              <div className="image-upload-section">
                <label htmlFor="top-image-upload" className="cursor-pointer">
                  <Button
                    variant="secondary"
                    size="small"
                    className="upload-button"
                  >
                    上传图片
                  </Button>
                </label>
                <input
                  id="top-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleTopImageUpload}
                  className="hidden"
                />
                <span className="upload-tip">最多上传9张图片</span>
              </div>
              
              {/* 已上传图片预览 */}
              {formData.topComment.images.length > 0 && (
                <div className="image-preview-container">
                  {formData.topComment.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="image-preview-wrapper">
                      <img
                        src={image}
                        alt={`上评预览 ${imgIndex + 1}`}
                        className="image-preview"
                      />
                      <Button
                        variant="danger"
                        size="extra-small"
                        onClick={() => removeTopImage(imgIndex)}
                        className="remove-image-button"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 上评@用户区域 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上评@用户标记
              </label>
              <div className="space-y-3">
                <Input
                  placeholder="输入用户ID或昵称（仅支持字母、数字、下划线、中文和@符号）"
                  value={topMentionInput}
                  onChange={(e) => setTopMentionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (!topMentions.length && handleAddTopMention())}
                  className="w-full"
                  disabled={topMentions.length >= 1}
                />
                <Button 
                  onClick={handleAddTopMention}
                  className={`w-full py-2 rounded-lg transition-colors ${topMentions.length >= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  disabled={topMentions.length >= 1}
                >
                  {topMentions.length >= 1 ? '已添加用户标记' : '添加用户标记'}
                </Button>
              </div>
              {topMentions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topMentions.map((mention, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>@{mention}</span>
                      <button 
                        onClick={() => removeTopMention(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 中评评论区域 */}
        <div className="task-section">
          <h2 className="section-title">中评评论</h2>
          <div className="form-group">
            <div className="comment-section-header">
              <label className="form-label">评论内容</label>
              <div className="comment-actions">
                <Button 
                  variant="secondary"
                  onClick={handleAIMiddleCommentsOptimize}
                  disabled={isOptimizing}
                  className="secondary-button"
                >
                  {isOptimizing ? 'AI优化中...' : 'AI优化所有中评'}
                </Button>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="comment-list">
              {formData.middleComments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-number">中评评论 {index + 1}</span>
                    {index > 2 && (
                      <Button 
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveMiddleComment(index)}
                        className="remove-button"
                      >
                        删除
                      </Button>
                    )}
                  </div>
                  <textarea
                    className="comment-textarea"
                    placeholder="请输入中评评论内容"
                    value={comment.content}
                    onChange={(e) => {
                      const updatedComments = [...formData.middleComments];
                      updatedComments[index].content = e.target.value;
                      setFormData({...formData, middleComments: updatedComments});
                    }}
                    rows={4}
                  />
                  
                  {/* 图片上传区域 */}
                  <div className="image-upload-section">
                    <label htmlFor={`middle-image-upload-${index}`} className="cursor-pointer">
                      <Button
                        variant="secondary"
                        size="small"
                        className="upload-button"
                      >
                        上传图片
                      </Button>
                    </label>
                    <input
                      id={`middle-image-upload-${index}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMiddleImageUpload(index, e)}
                      className="hidden"
                    />
                    <span className="upload-tip">最多上传9张图片</span>
                  </div>
                  
                  {/* 已上传图片预览 */}
                  {comment.images.length > 0 && (
                    <div className="image-preview-container">
                      {comment.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="image-preview-wrapper">
                          <img
                            src={image}
                            alt={`中评预览 ${imgIndex + 1}`}
                            className="image-preview"
                          />
                          <Button
                            variant="danger"
                            size="extra-small"
                            onClick={() => removeMiddleImage(index, imgIndex)}
                            className="remove-image-button"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 中评@用户区域 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中评@用户标记
              </label>
              <div className="space-y-3">
                <Input
                  placeholder="输入用户ID或昵称（仅支持字母、数字、下划线和中文）"
                  value={middleMentionInput}
                  onChange={(e) => setMiddleMentionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (!middleMentions.length && handleAddMiddleMention())}
                  className="w-full"
                  disabled={middleMentions.length >= 1}
                />
                <Button 
                  onClick={handleAddMiddleMention}
                  className={`w-full py-2 rounded-lg transition-colors ${middleMentions.length >= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  disabled={middleMentions.length >= 1}
                >
                  {middleMentions.length >= 1 ? '已添加用户标记' : '添加用户标记'}
                </Button>
              </div>
              {middleMentions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {middleMentions.map((mention, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>@{mention}</span>
                      <button 
                        onClick={() => removeMiddleMention(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 中评任务数量 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中评数量 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleMiddleQuantityChange(Math.max(3, formData.middleQuantity - 1))}
                  className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
                >
                  -
                </button>
                <div className="flex-1">
                  <Input
                    type="number"
                    min="3"
                    value={formData.middleQuantity.toString()}
                    onChange={(e) => handleMiddleQuantityChange(parseInt(e.target.value) || 3)}
                    className="w-full text-2xl font-bold text-gray-900 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={() => handleMiddleQuantityChange(formData.middleQuantity + 1)}
                  className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                中评任务单价为¥{taskPrice.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* 费用预览 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">费用预览</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">任务费用</span>
              <span className="font-bold text-lg">¥{(taskPrice * formData.quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">中评费用 ({formData.middleQuantity}条)</span>
              <span className="font-bold text-lg">¥{(taskPrice * formData.middleQuantity).toFixed(2)}</span>
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
          disabled={!formData.videoUrl || formData.middleQuantity === undefined || isPublishing}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
        >
          {isPublishing ? '发布中...' : `立即发布任务 - ¥${totalCost}`}
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