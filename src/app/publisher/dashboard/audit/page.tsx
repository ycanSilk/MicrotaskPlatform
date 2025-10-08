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
  updatedTime?: string;
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

  // 模拟订单数据
  const mockOrders: PendingOrder[] = [
    {
      id: 'SUB1758353659512002',
      orderNumber: 'SUB1758353659512002',
      taskTitle: '使用提供的账号登录后，按照要求浏览指定内容并发表评论',
      commenterName: '测试评论员1',
      submitTime: new Date(Date.now() - 3600000).toISOString(), // 1小时前
      updatedTime: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
      content: '这个内容很有价值，学到了很多东西。希望以后能有更多这样的优质内容分享。',
      images: ['/images/1758380776810_96.jpg'],
      status: 'reviewing'
    },
    {
      id: 'SUB1758353659512003',
      orderNumber: 'SUB1758353659512003',
      taskTitle: '视频内容评论任务，需要观看完整视频并给出真实评价',
      commenterName: '测试评论员2',
      submitTime: new Date(Date.now() - 7200000).toISOString(), // 2小时前
      updatedTime: new Date(Date.now() - 5400000).toISOString(), // 1.5小时前
      content: '视频制作非常精良，内容讲解清晰易懂，强烈推荐给大家观看。',
      images: ['/images/1758384598887_578.jpg'],
      status: 'reviewing'
    },
    {
      id: 'SUB1758353659512004',
      orderNumber: 'SUB1758353659512004',
      taskTitle: '账号租赁任务，按照要求使用指定账号进行操作',
      commenterName: '测试评论员3',
      submitTime: new Date(Date.now() - 10800000).toISOString(), // 3小时前
      updatedTime: new Date(Date.now() - 9000000).toISOString(), // 2.5小时前
      content: '已完成账号租赁任务，所有操作都已按照要求完成，请查看截图确认。',
      images: ['/images/1758596791656_544.jpg', '/images/1758380776810_96.jpg'],
      status: 'reviewing'
    }
  ];

  // 直接使用模拟数据进行渲染
  useEffect(() => {
    console.log('使用模拟数据进行渲染');
    setPendingOrders(mockOrders);
    setLoading(false);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑将在AuditTab组件中处理
  };

  // 处理订单审核
  const handleOrderReview = (orderId: string, action: string) => {
    // 这里可以添加具体的审核逻辑
  };

  // 打开图片查看器
  const openImageViewer = (imageUrl: string) => {
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