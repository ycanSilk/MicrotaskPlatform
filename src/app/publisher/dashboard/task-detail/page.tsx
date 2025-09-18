'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 定义子任务数据类型
interface SubTask {
  id: string;
  parentId: string;
  status: string;
  commenterId: string;
  commenterName: string;
  commentContent: string;
  commentTime: string;
  screenshotUrl: string;
}

// 定义任务数据类型
interface Task {
  id: string;
  orderNumber: string;
  videoUrl: string;
  mention: string;
  status: string;
  quantity: number;
  completedQuantity: number;
  unitPrice: number;
  taskRequirements: string;
  publishTime: string;
  deadline: string;
  subOrders: SubTask[];
}

export default function TaskDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  
  console.log('TaskDetailPage rendered with searchParams:', Object.fromEntries(searchParams.entries()));
  console.log('Extracted taskId:', taskId);
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail(taskId);
    } else {
      setError('未提供任务ID');
      setLoading(false);
    }
  }, [taskId]);

  const fetchTaskDetail = async (id: string) => {
    try {
      setLoading(true);
      // 调用新的API获取任务详情
      const response = await fetch(`/api/publisher/task-detail?taskId=${id}`);
      const result = await response.json();
      
      if (result.success) {
        setTask(result.data);
      } else {
        setError(result.message || '获取任务详情失败');
      }
    } catch (err) {
      console.error('获取任务详情失败:', err);
      setError('获取任务详情时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSubTaskAction = (subTaskId: string, action: string) => {
    alert(`对子任务 ${subTaskId} 执行 ${action} 操作`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">加载中...</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
          <div className="text-gray-500">正在加载任务详情...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">错误</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">任务未找到</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-yellow-700">未找到指定的任务</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 统计子任务状态
  const statusCounts = {
    completed: task.subOrders.filter(sub => sub.status === 'completed').length,
    pending: task.subOrders.filter(sub => sub.status === 'pending').length,
    inReview: task.subOrders.filter(sub => sub.status === 'pending_review').length,
  };

  // 状态映射函数
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '进行中';
      case 'pending':
        return '待领取';
      case 'pending_review':
        return '审核中';
      default:
        return status;
    }
  };

  // 状态样式映射函数
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">任务详情</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 任务基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">任务信息</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">任务编号</p>
              <p className="font-medium">{task.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">视频链接</p>
              <p className="font-medium text-blue-600 truncate">{task.videoUrl}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">提及账号</p>
              <p className="font-medium">{task.mention}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">单价</p>
              <p className="font-medium">¥{task.unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">总数量</p>
              <p className="font-medium">{task.quantity} 条</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="font-medium">{task.completedQuantity} 条</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">发布时间</p>
              <p className="font-medium">{new Date(task.publishTime).toLocaleString('zh-CN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">截止时间</p>
              <p className="font-medium">{new Date(task.deadline).toLocaleString('zh-CN')}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">任务要求</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800">{task.taskRequirements}</p>
            </div>
          </div>
        </div>

        {/* 子任务统计 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">子任务统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-sm text-green-700">已完成</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.inReview}</div>
              <div className="text-sm text-orange-700">审核中</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.pending}</div>
              <div className="text-sm text-blue-700">待领取</div>
            </div>
          </div>
        </div>

        {/* 子任务列表 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">子任务列表</h2>
          <div className="space-y-4">
            {task.subOrders.map((subTask) => (
              <div key={subTask.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">子任务 #{subTask.id}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(subTask.status)}`}>
                      {getStatusText(subTask.status)}
                    </span>
                  </div>
                  {subTask.status === 'pending_review' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSubTaskAction(subTask.id, '通过')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleSubTaskAction(subTask.id, '驳回')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        驳回
                      </button>
                    </div>
                  )}
                </div>
                
                {subTask.commenterName && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">评论员</p>
                    <p className="font-medium">{subTask.commenterName} ({subTask.commenterId})</p>
                  </div>
                )}
                
                {subTask.commentContent && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">评论内容</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-800">{subTask.commentContent}</p>
                    </div>
                  </div>
                )}
                
                {subTask.commentTime && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">提交时间</p>
                    <p className="font-medium">{new Date(subTask.commentTime).toLocaleString('zh-CN')}</p>
                  </div>
                )}
                
                {subTask.screenshotUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">截图</p>
                    <div className="bg-gray-100 rounded flex items-center justify-center">
                      <img 
                        src={subTask.screenshotUrl} 
                        alt="评论截图" 
                        className="max-h-40 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}