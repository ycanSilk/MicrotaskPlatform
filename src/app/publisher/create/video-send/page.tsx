'use client';

import { Button, Input } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

export default function VideoSendPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '定制视频发送';
  const taskIcon = searchParams.get('icon') || '📹';
  const taskPrice = parseFloat(searchParams.get('price') || '50');
  const taskDescription = searchParams.get('description') || '按要求制作并发送视频内容';
  
  // 判断是纯推送还是定制推送
  const isCustomMode = taskId === 'video_push_custom';
  
  const [formData, setFormData] = useState({
    videoRequirements: '',
    receiverInfo: '',
    contactInfo: '',
    deadline: '24',
    attachments: [] as File[]
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 计算总费用
  const totalCost = taskPrice.toFixed(2);

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  // 移除文件
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    setFormData(prev => {
      const newAttachments = [...prev.attachments];
      newAttachments.splice(index, 1);
      return { ...prev, attachments: newAttachments };
    });
  };

  // 提交视频发送请求
  const handleSubmitVideoSend = async () => {
    // 表单验证
    if (!formData.videoRequirements || formData.videoRequirements.trim().length < 20) {
      alert('请详细描述视频需求，至少20个字符');
      return;
    }
    
    if (!formData.receiverInfo || formData.receiverInfo.trim().length < 5) {
      alert('请输入接收方信息，至少5个字符');
      return;
    }

    // 显示加载状态
    setIsPublishing(true);
    console.log('开始提交视频发送请求...');
    console.log('表单数据:', formData);
    console.log('任务ID:', taskId);

    try {
      // 使用PublisherAuthStorage获取认证token和用户信息
      const auth = PublisherAuthStorage.getAuth();
      const token = auth?.token;
      const userInfo = PublisherAuthStorage.getCurrentUser();
      
      console.log('[视频发送] 认证信息:', { token: token ? '存在' : '不存在', userInfo });
      
      if (!token || !userInfo) {
        console.log('[视频发送] 认证失败: 用户未登录或会话已过期');
        alert('用户未登录，请重新登录');
        router.push('/publisher/login' as any);
        return;
      }

      // 构建表单数据
      const formDataToSend = new FormData();
      formDataToSend.append('taskId', taskId || '');
      formDataToSend.append('taskTitle', taskTitle);
      formDataToSend.append('taskPrice', taskPrice.toString());
      formDataToSend.append('videoRequirements', formData.videoRequirements);
      formDataToSend.append('receiverInfo', formData.receiverInfo);
      formDataToSend.append('contactInfo', formData.contactInfo);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('isCustomMode', isCustomMode.toString());
      
      // 添加附件
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachment${index}`, file);
      });

      console.log('表单数据:', formDataToSend);
      
      // 调用API提交视频发送请求
      const response = await fetch('/api/publisher/video-send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      console.log('API响应状态:', response.status);

      const result = await response.json();
      console.log('API响应结果:', result);
      
      if (result.success) {
        alert(`视频发送请求提交成功！订单号：${result.order?.orderNumber || ''}`);
        router.push('/publisher/dashboard');
      } else {
        alert(`视频发送请求提交失败: ${result.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('提交视频发送请求时发生错误:', error);
      alert('提交视频发送请求时发生错误，请稍后重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // 如果没有找到任务类型，返回错误页面
  if (!taskId || (!taskId.includes('video_push'))) {
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
        {/* 视频需求描述 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            视频需求描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={5}
            placeholder={isCustomMode 
              ? "请详细描述定制视频的需求，包括内容、风格、时长、特定元素等，以便我们为您制作高质量的定制视频..." 
              : "请详细描述视频内容要求和发送规范..."
            }
            value={formData.videoRequirements}
            onChange={(e) => setFormData({...formData, videoRequirements: e.target.value})}
          />
          {isCustomMode && (
            <div className="mt-2 text-sm text-blue-600">
              定制模式支持专业视频制作、多版本修改和精准推送服务
            </div>
          )}
        </div>

        {/* 接收方信息 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            接收方信息 <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="请输入接收方的ID、昵称或其他必要信息"
            value={formData.receiverInfo}
            onChange={(e) => setFormData({...formData, receiverInfo: e.target.value})}
            className="w-full"
          />
        </div>

        {/* 附件上传 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            附件上传（选填）
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <label className="cursor-pointer">
              <div className="text-xl mb-2">📎</div>
              <div className="text-gray-600 mb-1">点击上传或拖拽文件到此处</div>
              <div className="text-gray-400 text-sm">支持图片、文档等格式，单个文件不超过10MB</div>
              <input 
                type="file" 
                multiple 
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          
          {/* 已上传文件列表 */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-gray-700">已上传文件：</div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-500">📄</div>
                    <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)}KB</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            联系方式
          </label>
          <Input
            placeholder="请输入有效的联系方式，以便我们与您沟通视频制作细节"
            value={formData.contactInfo}
            onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
            className="w-full"
          />
        </div>

        {/* 截止时间 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            完成截止时间
          </label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          >
            <option value="12">12小时</option>
            <option value="24">24小时</option>
            <option value="48">48小时</option>
          </select>
        </div>

        {/* 费用预览 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">费用预览</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{taskTitle}费用</span>
              <span className="font-medium">¥{taskPrice.toFixed(2)}</span>
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

      {/* 底部固定提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
        <Button 
          onClick={handleSubmitVideoSend}
          disabled={!formData.videoRequirements || !formData.receiverInfo}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
        >
          提交视频发送请求 - ¥{totalCost}
        </Button>
        <Button 
          onClick={() => router.back()}
          variant="secondary"
          className="w-full py-3 border border-gray-200 text-gray-700 rounded-2xl"
        >
          取消
        </Button>
      </div>
    </div>
  );
}