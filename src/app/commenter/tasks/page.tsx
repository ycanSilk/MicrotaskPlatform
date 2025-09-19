'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CommenterAuthStorage } from '@/auth/commenter/auth';

// 定义任务状态类型
type TaskStatus = 'sub_progress' | 'sub_completed' | 'sub_pending_review' | 'waiting_collect';

// 定义任务接口
interface Task {
  id: string;
  parentId?: string;
  title: string;
  price: number;
  category: string;
  status: TaskStatus;
  statusText: string;
  statusColor: string;
  description: string;
  deadline?: string;
  progress?: number;
  submitTime?: string;
  completedTime?: string;
  reviewNote?: string;
  requirements: string;
  publishTime: string;
  videoUrl?: string;
  mention?: string;
  screenshotUrl?: string; // 添加截图URL字段
  recommendedComment?: string; // 推荐评论字段
  commentContent?: string; // 评论内容字段
  subOrderNumber?: string; // 子订单的订单号
}

export default function CommenterTasksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TaskStatus>('sub_progress');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 用于放大查看的图片URL
  const [commentContent, setCommentContent] = useState<Record<string, string>>({}); // 存储每个任务的评论内容
  const [tempScreenshotFiles, setTempScreenshotFiles] = useState<Record<string, File>>({}); // 临时存储截图文件
  
  // 获取用户订单数据
  const fetchUserTasks = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // 获取当前用户
      const currentUser = CommenterAuthStorage.getCurrentUser();
      
      // 获取token并验证
      const token = localStorage.getItem('commenter_auth_token');
      
      // 如果没有token，重定向到登录页面
      if (!token) {
        setErrorMessage('请先登录');
        setTimeout(() => {
          router.push('/auth/login/commenterlogin');
        }, 1000);
        return;
      }
      
      // 添加时间戳参数防止浏览器缓存，确保每次获取最新数据
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/commenter/user-tasks?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      const result = await response.json();
        
        if (result.success && result.data) {
          setTasks(result.data);
        } else if (response.status === 401) {
          setErrorMessage('登录已过期，请重新登录');
          localStorage.removeItem('commenter_auth_token');
          localStorage.removeItem('commenter_user_info');
          localStorage.removeItem('commenter_auth_expires');
          setTimeout(() => {
            router.push('/auth/login/commenterlogin');
          }, 1500);
        } else {
          console.error('获取订单失败:', result.message);
          setErrorMessage(result.message || '获取订单失败');
          setTasks([]);
        }
    } catch (error) {
      console.error('获取订单时发生错误:', error);
      setErrorMessage('网络错误，请稍后重试');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取数据
  useEffect(() => {
    fetchUserTasks();
  }, []);
  
  // 过滤不同状态的任务
  const getFilteredTasks = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };
  
  const subProgressTasks = getFilteredTasks('sub_progress');
  const subPendingReviewTasks = getFilteredTasks('sub_pending_review');
  const subCompletedTasks = getFilteredTasks('sub_completed');
  const waitingCollectTasks = getFilteredTasks('waiting_collect');
  
  const currentTasks = getFilteredTasks(activeTab);
  
  // 获取按钮样式
  const getTabButtonStyle = (status: TaskStatus) => {
    const isActive = activeTab === status;
    return `flex-1 py-4 px-3 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-500 text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-blue-50'}`;
  };

  // 复制推荐评论功能
  const handleCopyComment = (taskId: string, comment?: string) => {
    if (!comment) {
      alert('暂无推荐评论');
      return;
    }
    
    navigator.clipboard.writeText(comment).then(() => {
      // 保存到commentContent状态
      setCommentContent(prev => ({ ...prev, [taskId]: comment }));
      alert('评论已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    });
  };

  // 上传截图按钮功能 - 优化版：只在本地保存压缩后的图片，不立即上传到服务器
  const handleUploadScreenshot = (taskId: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        // 显示正在压缩的提示
        setUploadStatus(prev => ({ ...prev, [taskId]: 'compressing' }));
        // 前端压缩图片至200KB以下
        const compressedFile = await compressImage(file);
        
        // 保存压缩后的图片到临时状态中，不立即上传到服务器
        setTempScreenshotFiles(prev => ({ ...prev, [taskId]: compressedFile }));
        
        // 立即更新对应任务的截图URL为本地URL，实现回填显示
        const objectUrl = URL.createObjectURL(compressedFile);
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, screenshotUrl: objectUrl }
              : task
          )
        );
        
        setUploadStatus(prev => ({ ...prev, [taskId]: 'success' }));
        alert('截图已选择成功，提交订单时将自动上传');
      } catch (error) {
        console.error('处理截图错误:', error);
        setUploadStatus(prev => ({ ...prev, [taskId]: 'error' }));
        alert('处理截图失败，请稍后重试');
      } finally {
        // 3秒后清除上传状态
        setTimeout(() => {
          setUploadStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[taskId];
            return newStatus;
          });
        }, 3000);
      }
    };
    
    fileInput.click();
  };
  
  // 提交订单按钮功能 - 优化版：在提交订单时一并上传截图
  const handleSubmitOrder = async (taskId: string) => {
    try {
      // 添加验证逻辑：检查是否已上传截图
      const task = tasks.find(t => t.id === taskId);
      
      if (task && !task.screenshotUrl) {
        alert('请先上传截图');
        return;
      }
      
      setIsSubmitting(true);
      
      const token = localStorage.getItem('commenter_auth_token');
      
      // 检查是否有临时截图文件需要上传
      const tempScreenshotFile = tempScreenshotFiles[taskId];
      
      if (tempScreenshotFile) {
        // 如果有临时截图文件，先上传截图
        const formData = new FormData();
        formData.append('taskId', taskId);
        formData.append('image', tempScreenshotFile);
        
        // 显示上传截图的提示
        setUploadStatus(prev => ({ ...prev, [taskId]: 'uploading' }));
        
        const uploadResponse = await fetch('/api/commenter/upload-screenshot', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
          setUploadStatus(prev => ({ ...prev, [taskId]: 'error' }));
          alert(uploadResult.message || '截图上传失败，请重试');
          setIsSubmitting(false);
          return;
        }
        
        // 清除临时截图文件
        setTempScreenshotFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[taskId];
          return newFiles;
        });
      }
      
      // 提交订单
      const response = await fetch('/api/commenter/task-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: taskId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(result.message || '订单提交成功');
        // 重新加载任务列表
        fetchUserTasks();
        // 清除评论内容
        setCommentContent(prev => {
          const newContent = { ...prev };
          delete newContent[taskId];
          return newContent;
        });
      } else {
        alert(result.message || '订单提交失败');
      }
    } catch (error) {
      console.error('提交订单错误:', error instanceof Error ? error.message : String(error));
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
      // 清除上传状态
      setTimeout(() => {
        setUploadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[taskId];
          return newStatus;
        });
      }, 1000);
    }
  };
  
  // 查看详情按钮功能
  const handleViewDetails = (taskId: string) => {
    router.push(`/commenter/task-detail?id=${taskId}`);
  };
  
  // 查看大图功能
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  // 关闭大图查看
  const handleCloseImageViewer = () => {
    setSelectedImage(null);
  };
  
  // 辅助函数：将图片压缩至200KB以下
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // 如果文件已经小于200KB，直接返回
      const MAX_SIZE = 200 * 1024; // 200KB
      if (file.size <= MAX_SIZE) {
        resolve(file);
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        // 设置最大尺寸
        const maxWidth = 1200; 
        const maxHeight = 1200;

        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        
        if (width > maxWidth || height > maxHeight) {
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // 在canvas上绘制图片
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        // 使用二分法查找合适的quality值进行压缩
        let quality = 0.9;

        const compressAndCheck = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              if (blob.size > MAX_SIZE && quality > 0.1) {
                quality -= 0.1;
                compressAndCheck();
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: file.type
                });
                resolve(compressedFile);
              }
            },
            file.type || 'image/jpeg',
            quality
          );
        };

        compressAndCheck();
      };

      reader.readAsDataURL(file);
    });
  };
  
  // 获取任务操作按钮组
  const getTaskButtons = (task: Task) => {
    switch (task.status) {
      case 'sub_progress':
        return (
          <div className="flex space-x-2">
            <button 
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${ 
                uploadStatus[task.id] === 'compressing' || uploadStatus[task.id] === 'uploading' 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : uploadStatus[task.id] === 'success' 
                    ? 'bg-green-500 text-white' 
                    : uploadStatus[task.id] === 'error' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={() => handleUploadScreenshot(task.id)}
              disabled={uploadStatus[task.id] === 'compressing' || uploadStatus[task.id] === 'uploading'}
            >
              {uploadStatus[task.id] === 'compressing' ? '压缩中...' : uploadStatus[task.id] === 'uploading' ? '上传中...' : '上传截图'}
            </button>
            <button 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => handleSubmitOrder(task.id)}
              disabled={isSubmitting || !task.screenshotUrl}
            >
              提交订单
            </button>
            <button 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => handleViewDetails(task.id)}
            >
              查看详情
            </button>
          </div>
        );
      case 'sub_pending_review':
        // 为pending和sub_pending_review状态显示相同的按钮
        return (
          <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed" disabled>
            等待审核
          </button>
        );
      case 'sub_completed':
        return (
          <button 
            className="w-full bg-green-100 text-green-600 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors"
            onClick={() => handleViewDetails(task.id)}
          >
            查看详情
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 图片查看器模态框 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" 
          onClick={handleCloseImageViewer}
        >
          <div className="absolute top-4 right-4 text-white">
            <button 
              className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseImageViewer();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="预览图片" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
      
      <div className="pb-20">
      {/* 任务状态筛选（合并统计和筛选功能） */}
      <div className="mx-4 mt-4 flex space-x-2">
        <button 
          onClick={() => setActiveTab('sub_progress')}
          className={getTabButtonStyle('sub_progress')}
        >
          <div className="flex flex-col items-center">
            <div className={activeTab === 'sub_progress' ? 'text-lg font-bold text-white' : 'text-lg font-bold text-blue-500'}>
              {subProgressTasks.length}
            </div>
            <span className="text-xs">进行中</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('sub_pending_review')}
          className={getTabButtonStyle('sub_pending_review')}
        >
          <div className="flex flex-col items-center">
            <div className={activeTab === 'sub_pending_review' ? 'text-lg font-bold text-white' : 'text-lg font-bold text-orange-500'}>
              {subPendingReviewTasks.length}
            </div>
            <span className="text-xs">待审核</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('sub_completed')}
          className={getTabButtonStyle('sub_completed')}
        >
          <div className="flex flex-col items-center">
            <div className={activeTab === 'sub_completed' ? 'text-lg font-bold text-white' : 'text-lg font-bold text-green-500'}>
              {subCompletedTasks.length}
            </div>
            <span className="text-xs">已完成</span>
          </div>
        </button>
      </div>

      {/* 错误提示 */}
      {errorMessage && (
        <div className="mx-4 mt-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* 任务列表 */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-800">
            {activeTab === 'sub_progress' && '进行中的任务'}
            {activeTab === 'sub_pending_review' && '待审核的任务'}
            {activeTab === 'sub_completed' && '已完成的任务'}
            {activeTab === 'waiting_collect' && '待领取的任务'}
            ({currentTasks.length})
          </span>
          {/* 刷新按钮 */}
          <button 
            className={`text-blue-500 text-sm flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={fetchUserTasks}
            disabled={isLoading}
          >
            <span className="mr-1">刷新</span>
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-500 rounded-full mb-4"></div>
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : currentTasks.length === 0 && !errorMessage ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-gray-500">暂无相关任务</div>
          </div>
        ) : (
          currentTasks.map((task) => (
            <div key={task.id || 'unknown'} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">订单号：{task.subOrderNumber || task.title || '未命名任务'}</h3>
                <span className={`px-2 py-1 rounded text-xs ${task.statusColor || 
                  (task.status === 'sub_pending_review' ? 'bg-orange-100 text-orange-600' : 
                   task.status === 'sub_progress' ? 'bg-blue-100 text-blue-600' : 
                   task.status === 'sub_completed' ? 'bg-green-100 text-green-600' : 
                   task.status === 'waiting_collect' ? 'bg-purple-100 text-purple-600' : 
                   'bg-gray-100 text-gray-600')}`}>
                  {task.statusText || 
                   (task.status === 'sub_pending_review' ? '待审核' : 
                    task.status === 'sub_progress' ? '进行中' : 
                    task.status === 'sub_completed' ? '已完成' : 
                    task.status === 'waiting_collect' ? '待领取' : '未知状态')}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <div className="text-lg font-bold text-orange-500">¥{(task.price || 0).toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {task.category || '评论'} | {task.publishTime || '未知时间'}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                要求：{task.requirements || '无特殊要求'}
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                {task.description || '无描述'}
              </div>
              
              {/* 打开视频按钮 */}
              {task.videoUrl && (
                <div className="mb-4">
                  <button 
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                    onClick={() => window.open(task.videoUrl, '_blank')}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    打开视频
                  </button>
                </div>
              )}
              
              {/* 时间信息 */}
              {task.deadline && task.status === 'sub_progress' && (
                <div className="text-xs text-gray-500 mb-3">
                  截止时间：{task.deadline}
                </div>
              )}
              
              {(task.submitTime && task.status === 'sub_pending_review') && (
                <div className="text-xs text-gray-500 mb-3">
                  提交时间：{task.submitTime}
                </div>
              )}
              
              {task.completedTime && task.status === 'sub_completed' && (
                <div className="text-xs text-gray-500 mb-3">
                  完成时间：{task.completedTime}
                </div>
              )}
              
              {/* 推荐评论区域 */}
              {task.recommendedComment && (
                <div className="mb-4 bg-yellow-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-medium text-yellow-700">推荐评论</h4>
                    <button 
                      className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                      onClick={() => handleCopyComment(task.id, task.recommendedComment)}
                    >
                      复制评论
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded">
                    {task.recommendedComment}
                  </p>
                </div>
              )}

              {/* 截图显示区域 - 自适应高度，居中显示 */}
              <div className="mb-4">
                <div 
                  className={`w-1/3 relative cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 ${
                    task.screenshotUrl ? 'hover:shadow-md' : ''
                  } flex items-center justify-center min-h-[7.5rem]`}
                  onClick={() => task.screenshotUrl && handleViewImage(task.screenshotUrl)}
                >
                  {task.screenshotUrl ? (
                    <>
                      <img 
                        src={task.screenshotUrl} 
                        alt="任务截图" 
                        className="w-full h-auto max-h-[20rem] object-contain mx-auto"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all">
                        <span className="text-blue-500 text-lg opacity-0 hover:opacity-100 transition-opacity">点击放大</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-24 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">未上传截图</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {task.screenshotUrl ? '已上传截图，点击可放大查看' : '点击上传按钮添加截图'}
                </p>
              </div>
              
              {/* 添加防御性编程，确保即使task有问题也不会导致运行时错误 */}
              {task && typeof getTaskButtons === 'function' && getTaskButtons(task)}
            </div>
          ))
        )}
      </div>

      {/* 任务提示 */}
      <div className="mx-4 mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">任务小贴士</h4>
            <p className="text-sm text-blue-600">
              按时完成任务可以提高信誉度，获得更多高价值任务推荐。记得在截止时间前提交哦！
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}