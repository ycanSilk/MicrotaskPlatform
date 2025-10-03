'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth/publisher/auth';
import OverviewTab from '../components/OverviewTab';

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

interface DispatchedTask {
  id: string;
  title: string;
  status: string;
  statusText: string;
  participants: number;
  maxParticipants: number;
  time: string;
  completed: number;
  inProgress: number;
  pending: number;
  pendingReview?: number;
  price: number;
  orderNumber: string;
  taskType: string;
  taskRequirements: string;
}

interface Stats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalSpent: number;
  totalInProgressSubOrders: number;
  totalCompletedSubOrders: number;
  totalPendingReviewSubOrders: number;
  totalPendingSubOrders: number;
  averageOrderValue: number;
}

export default function OverviewTabPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statsTimeRange, setStatsTimeRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalSpent: 0,
    totalInProgressSubOrders: 0,
    totalCompletedSubOrders: 0,
    totalPendingReviewSubOrders: 0,
    totalPendingSubOrders: 0,
    averageOrderValue: 0
  });
  const [dispatchedTasks, setDispatchedTasks] = useState<DispatchedTask[]>([]);

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
            console.log('获取认证token失败:', e);
          }
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const response = await fetch(`/api/publisher/dashboard?timeRange=${statsTimeRange}`, {
          headers,
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        const result = await response.json();
        
        if (result.success) {
          setStats(result.data.stats);
          setDispatchedTasks(result.data.dispatchedTasks);
        }
      } catch (error) {
        console.error('获取仪表板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [statsTimeRange]);

  // 显示加载状态
  if (loading) {
    return (
      <div className="pb-20 flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <OverviewTab
      stats={stats}
      dispatchedTasks={dispatchedTasks}
      statsTimeRange={statsTimeRange}
      setStatsTimeRange={setStatsTimeRange}
    />
  );
}