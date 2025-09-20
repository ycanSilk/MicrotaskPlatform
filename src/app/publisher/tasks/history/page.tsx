'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 定义历史任务接口
interface HistoryTask {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'main_progress' | 'main_completed' | string;
  statusText: string;
  statusColor: string;
  participants: number;
  maxParticipants: number;
  completed: number;
  inProgress: number;
  pending: number;
  pendingReview: number;
  publishTime: string;
  deadline: string;
  description: string;
}

// API响应接口
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const TaskHistoryPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyTasks, setHistoryTasks] = useState<HistoryTask[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'status'>('time');

  // 获取历史任务数据
  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取认证token
      let authToken = null;
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('publisher_auth_token');
          if (token) {
            authToken = token;
          } else {
            throw new Error('未找到认证token');
          }
        } catch (e) {
          throw new Error('获取认证信息失败');
        }
      }
      
      // 构建请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      // 发送API请求
      const response = await fetch('/api/publisher/tasks', {
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
      }
      
      const result: ApiResponse<HistoryTask[]> = await response.json();
      
      if (result.success) {
        setHistoryTasks(result.data || []);
      } else {
        throw new Error(result.message || '获取数据失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取数据异常');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // 排序功能
  const getSortedTasks = () => {
    return [...historyTasks].sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else if (sortBy === 'price') {
        return b.price - a.price;
      }
      return 0;
    });
  };

  // 处理任务操作
  const handleTaskAction = (taskId: string) => {
    const url = `/publisher/dashboard/task-detail?id=${encodeURIComponent(taskId)}`;
    router.push(url as never);
  };

  // 重试获取数据
  const handleRetry = () => {
    fetchHistoryData();
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="pb-20 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <div className="text-gray-500">加载中，请稍候...</div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="pb-20 flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 max-w-md w-full">
          <p className="mb-2 font-medium">获取数据失败</p>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 显示空状态
  if (historyTasks.length === 0) {
    return (
      <div className="pb-20 flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="text-gray-400 mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">暂无历史订单</h3>
        <p className="text-gray-500 text-center max-w-md">
          您还没有任何历史订单记录。完成任务后，您可以在这里查看历史订单。
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* 页面标题和返回按钮 */}
      <div className="mx-4 mt-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          ← 返回
        </button>
        <h2 className="text-lg font-bold text-gray-800">历史订单</h2>
        <div></div> {/* 占位元素，用于保持标题居中 */}
      </div>

      {/* 排序选择 */}
      <div className="mx-4 mt-6 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">全部历史订单</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'time' | 'price' | 'status')}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="time">按时间排序</option>
          <option value="price">按价格排序</option>
          <option value="status">按状态排序</option>
        </select>
      </div>

      {/* 任务列表 */}
      <div className="mx-4 mt-4">
        <div className="space-y-4">
          {getSortedTasks().map((task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 任务头部信息 */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-[0]">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-800 truncate">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${task.statusColor}`}>
                      {task.statusText}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>分类：{task.category} | 价格：¥{task.price}</div>
                    <div>发布时间：{task.publishTime}</div>
                    <div>截止时间：{task.deadline}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600 whitespace-nowrap">
                  ¥{task.price.toFixed(2)}
                </div>
              </div>

              {/* 任务描述 */}
              <div className="mb-3">
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {task.description}
                </div>
              </div>

              {/* 参与情况 */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">参与情况</span>
                  <span className="text-sm text-gray-800">
                    {task.participants}/{task.maxParticipants} 人
                  </span>
                </div>
                <div className="bg-gray-200 h-2 rounded overflow-hidden">
                  <div 
                    className="bg-green-500 h-2 rounded transition-all duration-500 ease-out"
                    style={{width: `${(task.participants / task.maxParticipants) * 100}%`}}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-1">
                  <div>已完成：{task.completed}人</div>
                  <div>进行中：{task.inProgress}人</div>
                  <div>待领取：{task.pending}人</div>
                  <div>待审核：{task.pendingReview || 0}人</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex">
                <button
                  onClick={() => handleTaskAction(task.id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition-colors text-sm"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryPage;