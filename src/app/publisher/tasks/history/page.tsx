'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryTask {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  statusText: string;
  statusColor: string;
  participants: number;
  maxParticipants: number;
  completed: number;
  publishTime: string;
  deadline: string;
  description: string;
}

export default function TaskHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [historyTasks, setHistoryTasks] = useState<HistoryTask[]>([]);
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'status' | 'price'

  // 获取历史任务数据
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        console.log('正在获取历史任务数据');
        
        // 获取认证token
        let authToken = null;
        if (typeof window !== 'undefined') {
          try {
            const token = localStorage.getItem('auth_token');
            if (token) {
              authToken = token;
              console.log('获取到认证token:', token);
            } else {
              console.log('未找到认证token');
            }
          } catch (e) {
            console.log('获取认证token失败:', e);
          }
        }
        
        // 构建请求头
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
          console.log('设置Authorization头:', headers['Authorization']);
        }
        
        // 使用新的API路由获取当前用户的所有任务
        const response = await fetch('/api/publisher/tasks', {
          headers
        });
        const result = await response.json();
        console.log('API响应:', result);
        
        if (result.success) {
          setHistoryTasks(result.data);
          console.log('历史任务数据更新完成');
        } else {
          console.error('API返回错误:', result.message);
        }
      } catch (error) {
        console.error('获取历史任务数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const sortTasks = (tasks: HistoryTask[]) => {
    return [...tasks].sort((a, b) => {
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

  const handleTaskAction = (taskId: string, action: string) => {
    console.log('handleTaskAction called with:', { taskId, action });
    if (action === '查看详情') {
      const url = `/publisher/dashboard/task-detail?id=${encodeURIComponent(taskId)}`;
      console.log('Full URL to navigate to:', url);
      // 使用类型断言修复Next.js 14 router push类型问题
      router.push(url as unknown as never);
    } else {
      alert(`对任务 ${taskId} 执行 ${action} 操作`);
    }
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="pb-20 flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* 页面标题和返回按钮 */}
      <div className="mx-4 mt-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-500 hover:text-blue-700"
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
          onChange={(e) => setSortBy(e.target.value)}
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
          {sortTasks(historyTasks).map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
              {/* 任务头部信息 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-800">{task.title}</h3>
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
                <div className="text-lg font-bold text-green-600">
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
                <div className="bg-gray-200 h-2 rounded">
                  <div 
                    className="bg-green-500 h-2 rounded" 
                    style={{width: `${(task.participants / task.maxParticipants) * 100}%`}}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  已完成：{task.completed}/{task.participants} 人
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTaskAction(task.id, '查看详情')}
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
}