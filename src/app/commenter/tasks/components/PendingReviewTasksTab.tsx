import React from 'react';
import { useRouter } from 'next/navigation';

// 定义任务接口
export interface Task {
  id: string;
  parentId?: string;
  title?: string;
  price?: number;
  unitPrice?: number;
  status: string;
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

interface PendingReviewTasksTabProps {
  tasks: Task[];
  handleViewDetails: (taskId: string) => void;
  handleViewImage: (imageUrl: string) => void;
  getTaskTypeName: (taskType?: string) => string;
  isLoading: boolean;
  fetchUserTasks: () => void;
}

const PendingReviewTasksTab: React.FC<PendingReviewTasksTabProps> = ({
  tasks,
  handleViewDetails,
  handleViewImage,
  getTaskTypeName,
  isLoading,
  fetchUserTasks
}) => {
  const router = useRouter();

  return (
    <div className="mx-4 mt-6">
      {tasks.map((task) => (
        <div key={task.id || 'unknown'} className="rounded-lg p-4 mb-4 shadow-sm transition-all hover:shadow-md bg-white">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-800">订单号：{task.subOrderNumber || task.orderNumber || '未命名任务'}</h3>
          </div>
          
          {/* 价格和任务信息区域 - 显示单价、任务状态和发布时间 */}
          <div className="mb-3">
            <div className="text-lg font-bold text-orange-500 mb-2">订单单价：¥{(task.unitPrice || task.price || 0).toFixed(2)}</div>
            <div className="flex flex-col space-y-1">
              <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap inline-block w-32 ${task.statusColor || 'bg-yellow-100 text-yellow-600'}`}>
                  状态：{task.statusText || '待审核'}
                </span>

                 <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 whitespace-nowrap inline-block w-32">
                  任务类型：{getTaskTypeName(task.taskType) || '评论'}
                </span>

                <span className="text-xs text-gray-500">
                  发布时间：{task.publishTime || '未知时间'}
                </span>
                
                {/* 提交时间 */}
                {task.submitTime && (
                  <div className="text-xs text-gray-500 mb-3">
                    提交时间：{task.submitTime}
                  </div>
                )}
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
          
          {/* 截图显示区域 - 自适应高度，居中显示 */}
          <div className="mb-4">
            <div 
              className={`w-1/3 relative cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:shadow-md flex items-center justify-center min-h-[7.5rem]`}
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
              点击可放大查看截图
            </p>
          </div>
          
          {/* 查看详情按钮 */}
          <div className="flex space-x-2">
            <button 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => handleViewDetails(task.id)}
            >
              查看详情
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingReviewTasksTab;