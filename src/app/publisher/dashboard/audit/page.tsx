'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth/publisher/auth';
import AuditTab from '../components/AuditTab';

// 定义数据类型
interface PendingOrder {
  id: string;
  taskTitle: string;
  commenterName: string;
  submitTime: string;
  content: string;
  images: string[];
  status: string;
  orderNumber?: string;
}

export default function AuditTabPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);

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
        
        const response = await fetch('/api/publisher/dashboard?timeRange=all', {
          headers,
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        const result = await response.json();
        
        if (result.success) {
          setPendingOrders(result.data.pendingOrders);
        }
      } catch (error) {
        console.error('获取仪表板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑将在AuditTab组件中处理
  };

  // 处理订单审核
  const handleOrderReview = (orderId: string, action: string) => {
    console.log(`处理订单 ${orderId} 的审核操作: ${action}`);
    // 这里可以添加具体的审核逻辑
  };

  // 打开图片查看器
  const openImageViewer = (imageUrl: string) => {
    console.log('打开图片查看器:', imageUrl);
    // 这里可以添加图片查看器逻辑
  };

  // 过滤最近订单
  const filterRecentOrders = (orders: any[]) => {
    return orders.filter(order => {
      const orderTime = new Date(order.submitTime).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return orderTime >= sevenDaysAgo;
    });
  };

  // 搜索订单
  const searchOrders = (orders: any[]) => {
    if (!searchTerm.trim()) return orders;
    
    return orders.filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 排序审核任务
  const sortAuditTasks = (orders: any[]) => {
    return [...orders].sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
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
    <AuditTab
      pendingOrders={pendingOrders}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      handleOrderReview={handleOrderReview}
      openImageViewer={openImageViewer}
      filterRecentOrders={filterRecentOrders}
      searchOrders={searchOrders}
      sortAuditTasks={sortAuditTasks}
      onViewAllClick={() => router.push('/publisher/orders')}
    />
  );
}