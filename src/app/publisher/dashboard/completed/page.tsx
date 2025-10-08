'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth/publisher/auth';
import CompletedTasksTab from '../components/CompletedTasksTab';

// 定义数据类型
interface Task {
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
  inProgress: number;
  pending: number;
  publishTime: string;
  deadline: string;
  description: string;
}

export default function CompletedTabPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  // 获取仪表板数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        let authToken = null;
        if (typeof window !== 'undefined') {
          try {
            const authSession = PublisherAuthStorage.getAuth();
            if (authSession && authSession.token) {
              authToken = authSession.token;
            }
          } catch (e) {
            // 静默处理认证错误
          }
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const response = await fetch('/api/publisher/dashboard?timeRange=all', {
          headers,
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        const result = await response.json();
        
        if (result.success) {
          setCompletedTasks(result.data.completedTasks);
        }
      } catch (error) {
        // 静默处理错误，UI会显示加载状态
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑将在TasksTab组件中处理
  };

  // 处理任务操作
  const handleTaskAction = (taskId: string, action: string) => {
    // 这里可以添加具体的操作逻辑
  };

  // 过滤最近订单
  const filterRecentOrders = (tasks: any[]) => {
    return tasks.filter(task => {
      const taskTime = new Date(task.publishTime).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return taskTime >= sevenDaysAgo;
    });
  };

  // 搜索订单
  const searchOrders = (tasks: any[]) => {
    if (!searchTerm.trim()) return tasks;
    
    return tasks.filter(task => 
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 排序任务
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
        case 'price':
          return b.price - a.price;
        case 'status':
          return a.statusText.localeCompare(b.statusText);
        default:
          return 0;
      }
    });
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
    <CompletedTasksTab
      tasks={completedTasks}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      handleTaskAction={handleTaskAction}
      filterRecentOrders={filterRecentOrders}
      searchOrders={searchOrders}
      sortTasks={sortTasks}
      onViewAllClick={() => router.push('/publisher/tasks/completed' as any)}
    />
  );
}