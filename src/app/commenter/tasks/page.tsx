'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressTasksTab from './components/ProgressTasksTab';
import PendingReviewTasksTab from './components/PendingReviewTasksTab';
import CompletedTasksTab from './components/CompletedTasksTab';

// 定义任务状态类型
type TaskStatus = 'sub_progress' | 'sub_completed' | 'sub_pending_review' | 'waiting_collect';

// 定义任务接口
interface Task {
  id: string;
  parentId?: string;
  title?: string;
  price?: number;
  unitPrice?: number;
  status: TaskStatus;
  statusText?: string;
  statusColor?: string;
  description?: string;
  deadline?: string;
  progress?: number;
  submitTime?: string;
  completedTime?: string;
  reviewNote?: string;
  requirements: string;
  publishTime: string;
  videoUrl?: string;
  mention?: string;
  screenshotUrl?: string;
  recommendedComment?: string;
  commentContent?: string;
  subOrderNumber?: string;
  orderNumber?: string;
  taskType?: string;
}

export default function CommenterTasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数中获取初始tab值，如果没有则默认为sub_progress
  const tabFromUrl = searchParams.get('tab') as TaskStatus | null;
  const [activeTab, setActiveTab] = useState<TaskStatus>(tabFromUrl || 'sub_progress');
  const [tasks, setTasks] = useState<Task[]>([
    // 添加静态渲染数据，这些数据会在API请求完成前显示
    {
      id: 'static-task-1',
      subOrderNumber: 'COM20240612001',
      orderNumber: 'PUB20240612001',
      title: '产品评价任务',
      unitPrice: 12.50,
      status: 'sub_progress',
      statusText: '进行中',
      statusColor: 'bg-blue-100 text-blue-600',
      description: '请对该产品进行评价，内容需真实客观',
      requirements: '评价内容不少于20字，需包含产品使用体验和优缺点分析',
      publishTime: '2024-06-12 10:30:00',
      deadline: '2024-06-15 23:59:59',
      taskType: 'comment_middle',
      recommendedComment: '这款产品使用体验非常好，功能强大且操作简单，性价比很高。产品材质也很不错，做工精细，值得购买。唯一的小缺点是包装可以再改进一下。总体来说是一款很满意的产品，推荐给有需要的朋友。'
    },
    {
      id: 'static-task-2',
      subOrderNumber: 'COM20240610002',
      orderNumber: 'PUB20240610002',
      title: '账号出租任务',
      unitPrice: 8.00,
      status: 'sub_pending_review',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '请使用您的账号登录并完成指定操作',
      requirements: '按照任务要求完成所有操作步骤，并上传操作截图',
      publishTime: '2024-06-10 14:20:00',
      submitTime: '2024-06-11 09:45:00',
      taskType: 'account_rental',
      recommendedComment: '',
      screenshotUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Crect x="50" y="50" width="200" height="100" fill="%23e0e0e0"/%3E%3Ctext x="150" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="%23666"%3E示例截图 - 账号出租任务%3C/text%3E%3C/svg%3E'
    },
    {
      id: 'static-task-3',
      subOrderNumber: 'COM20240605003',
      orderNumber: 'PUB20240605003',
      title: '视频分享任务',
      unitPrice: 15.00,
      status: 'sub_completed',
      statusText: '已完成',
      statusColor: 'bg-green-100 text-green-600',
      description: '请分享指定视频到您的社交平台账号',
      requirements: '分享后请保留截图作为凭证，分享内容需保留至少24小时',
      publishTime: '2024-06-05 08:15:00',
      submitTime: '2024-06-06 11:30:00',
      completedTime: '2024-06-07 16:45:00',
      taskType: 'video_send',
      recommendedComment: '这个视频很有意思，分享给大家看看！内容非常实用，对我很有帮助，希望也能帮到你们。',
      videoUrl: 'https://example.com/videos/sample.mp4'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 用于放大查看的图片URL
  const [commentContent, setCommentContent] = useState<Record<string, string>>({}); // 存储每个任务的评论内容
  const [tempScreenshotFiles, setTempScreenshotFiles] = useState<Record<string, File>>({}); // 临时存储截图文件
  const [linkUploadStatus, setLinkUploadStatus] = useState<Record<string, string>>({}); // 链接上传状态
  
  // 获取用户订单数据
  const fetchUserTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // 不进行登录验证，直接显示静态数据
      console.debug('直接显示静态任务数据');
      
      // 设置短暂延迟以模拟加载过程
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('处理任务数据时发生错误:', error);
      setErrorMessage('加载任务失败');
    } finally {
      setIsLoading(false);
    }
  }
  
  // 初始化数据
  useEffect(() => {
    fetchUserTasks();
  }, []);

  // 处理标签切换，同时更新URL参数
  const handleTabChange = (tab: TaskStatus) => {
    setActiveTab(tab);
    
    // 更新URL参数而不刷新页面
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    
    // 使用replaceState避免创建新的历史记录
    window.history.replaceState(null, '', `?${newParams.toString()}`);
  };

  // 任务类型映射函数 - 将英文taskType转换为中文名称
  const getTaskTypeName = (taskType?: string): string => {
    const taskTypeMap: Record<string, string> = {
      'comment_middle': '中评任务',
      'account_rental': '账号出租',
      'video_send': '视频分享'
    };
    return taskTypeMap[taskType || ''] || taskType || '';
  };
  
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
  
  // 上传链接功能
  const handleUploadLink = async (taskId: string, reviewLink?: string) => {
    try {
      setLinkUploadStatus(prev => ({ ...prev, [taskId]: 'uploading' }));
      
      // 获取认证token
      const token = localStorage.getItem('commenter_auth_token');
      if (!token) {
        alert('请先登录');
        router.push('/auth/login/commenterlogin');
        return;
      }
      
      // 如果没有提供链接，则弹出输入框让用户输入
      let link = reviewLink;
      if (!link) {
        // 使用空值合并运算符将prompt返回的null转换为undefined
        link = prompt('请输入上评链接：') ?? undefined;
        if (!link) {
          setLinkUploadStatus(prev => ({ ...prev, [taskId]: '' }));
          return;
        }
      }
      
      // 提交链接到服务器
      const response = await fetch('/api/commenter/upload-review-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId,
          reviewLink: link
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLinkUploadStatus(prev => ({ ...prev, [taskId]: 'success' }));
        alert('链接上传成功');
        // 重新加载任务列表
        fetchUserTasks();
        
        // 3秒后清除成功状态
        setTimeout(() => {
          setLinkUploadStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[taskId];
            return newStatus;
          });
        }, 3000);
      } else {
        setLinkUploadStatus(prev => ({ ...prev, [taskId]: 'error' }));
        alert(result.message || '链接上传失败');
      }
    } catch (error) {
      setLinkUploadStatus(prev => ({ ...prev, [taskId]: 'error' }));
      console.error('上传链接错误:', error);
      alert('上传失败，请稍后重试');
    }
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
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${ 
                linkUploadStatus[task.id] === 'uploading' 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : linkUploadStatus[task.id] === 'success' 
                    ? 'bg-green-500 text-white' 
                    : linkUploadStatus[task.id] === 'error' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              onClick={() => handleUploadLink(task.id)}
              disabled={linkUploadStatus[task.id] === 'uploading'}
            >
              {linkUploadStatus[task.id] === 'uploading' ? '上传中...' : '上传链接'}
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
          onClick={() => handleTabChange('sub_progress')}
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
          onClick={() => handleTabChange('sub_pending_review')}
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
          onClick={() => handleTabChange('sub_completed')}
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

      {/* 根据当前选中的标签渲染对应的组件 */}
      <div className="mx-4 mt-6">
        {activeTab === 'sub_progress' && (
          <ProgressTasksTab 
            tasks={subProgressTasks} 
            isLoading={isLoading} 
            isSubmitting={isSubmitting} 
            uploadStatus={uploadStatus} 
            linkUploadStatus={linkUploadStatus} 
            handleUploadScreenshot={handleUploadScreenshot} 
            handleUploadLink={handleUploadLink} 
            handleSubmitOrder={handleSubmitOrder} 
            handleViewDetails={handleViewDetails} 
            handleViewImage={handleViewImage} 
            handleCopyComment={handleCopyComment} 
            fetchUserTasks={fetchUserTasks} 
            getTaskTypeName={getTaskTypeName}
          />
        )}
        
        {activeTab === 'sub_pending_review' && (
          <PendingReviewTasksTab 
            tasks={subPendingReviewTasks} 
            isLoading={isLoading} 
            handleViewDetails={handleViewDetails} 
            handleViewImage={handleViewImage} 
            fetchUserTasks={fetchUserTasks} 
            getTaskTypeName={getTaskTypeName}
          />
        )}
        
        {activeTab === 'sub_completed' && (
          <CompletedTasksTab 
            tasks={subCompletedTasks} 
            isLoading={isLoading} 
            handleViewDetails={handleViewDetails} 
            handleViewImage={handleViewImage} 
            fetchUserTasks={fetchUserTasks} 
            getTaskTypeName={getTaskTypeName}
          />
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