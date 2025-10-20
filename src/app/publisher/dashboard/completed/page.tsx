'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth/publisher/auth';
import OrderHeaderTemplate from '../components/OrderHeaderTemplate';

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

// 定义子订单接口
interface SubOrder {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  status: 'completed' | 'processing' | 'reviewing' | 'pending';
  reward: number;
}

// 定义订单接口
interface Order {
  id: string;
  orderNumber: string;
  title: string;
  status: 'completed' | 'processing' | 'reviewing' | 'pending';
  publishTime: string;
  deadline: string;
  price: number;
  type: 'comment' | 'share' | 'other';
  description: string;
  subOrders: SubOrder[];
}

export default function CompletedTabPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    // 显示复制成功提示 - 全局管理
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  // 静态模拟数据
  const mockCompletedTasks: Task[] = [
    {
      id: "COMPLETE001",
      title: "微博内容转发评论",
      category: "评论任务",
      price: 2.0,
      status: "completed",
      statusText: "已完成",
      statusColor: "green",
      participants: 20,
      maxParticipants: 20,
      completed: 20,
      inProgress: 0,
      pending: 0,
      publishTime: "2025-10-15 10:20:00",
      deadline: "2025-10-22 10:20:00",
      description: "转发指定微博内容并添加原创评论，评论需积极正面，不少于8个字。"
    },
    {
      id: "COMPLETE002",
      title: "抖音账号关注",
      category: "其他任务",
      price: 1.5,
      status: "completed",
      statusText: "已完成",
      statusColor: "green",
      participants: 50,
      maxParticipants: 50,
      completed: 50,
      inProgress: 0,
      pending: 0,
      publishTime: "2025-10-12 15:30:00",
      deadline: "2025-10-19 15:30:00",
      description: "关注指定抖音账号，保持关注时间不少于7天，截图留存作为凭证。"
    },
    {
      id: "COMPLETE003",
      title: "小红书笔记收藏",
      category: "分享任务",
      price: 2.8,
      status: "completed",
      statusText: "已完成",
      statusColor: "green",
      participants: 15,
      maxParticipants: 15,
      completed: 15,
      inProgress: 0,
      pending: 0,
      publishTime: "2025-10-10 09:45:00",
      deadline: "2025-10-17 09:45:00",
      description: "收藏指定小红书笔记并点赞，确保账号活跃度，提高笔记热度。"
    }
  ];

  // 获取仪表板数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 直接使用静态数据，模拟API延迟
        setTimeout(() => {
          setCompletedTasks(mockCompletedTasks);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("获取数据失败:", error);
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



  const showCopySuccess = (message: string) => {
    setTooltipMessage(message);
    setShowCopyTooltip(true);
    setTimeout(() => {
      setShowCopyTooltip(false);
    }, 2000);
  };

  // 复制订单号功能
  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      showCopySuccess('订单号已复制');
    }).catch(() => {
      // 静默处理复制失败
    });
  };

  // 将任务转换为订单格式
  const convertToOrderFormat = (task: Task, index: number): Order => {
    return {
      id: task.id,
      orderNumber: `ORDER${task.id}${index}`,
      title: task.title,
      status: 'completed' as const,
      publishTime: task.publishTime,
      deadline: task.deadline,
      price: task.price,
      type: task.category === '评论任务' ? 'comment' : task.category === '分享任务' ? 'share' : 'other',
      description: task.description,
      subOrders: [
        ...Array.from({ length: task.completed || 0 }).map((_, i) => ({
          id: `sub-${task.id}-completed-${i}`,
          orderId: task.id,
          userId: '',
          userName: '',
          status: 'completed' as const,
          reward: typeof task.price === 'number' ? task.price : 0
        })),
        ...Array.from({ length: task.inProgress || 0 }).map((_, i) => ({
          id: `sub-${task.id}-processing-${i}`,
          orderId: task.id,
          userId: '',
          userName: '',
          status: 'processing' as const,
          reward: typeof task.price === 'number' ? task.price : 0
        })),
        ...Array.from({ length: task.pending || 0 }).map((_, i) => ({
          id: `sub-${task.id}-pending-${i}`,
          orderId: task.id,
          userId: '',
          userName: '',
          status: 'pending' as const,
          reward: typeof task.price === 'number' ? task.price : 0
        }))
      ]
    };
  };

  // 获取过滤和搜索后的任务
  const filteredTasks = sortTasks(searchOrders(filterRecentOrders(completedTasks)));
  
  // 订单卡片组件 - 使用全局提示管理复制操作
  const MainOrderCard = ({ order, onCopyOrderNumber }: { order: Order, onCopyOrderNumber: (orderNumber: string) => void }) => {
    // 计算子订单统计
    const subOrderStats = order.subOrders.reduce((acc, subOrder) => {
      acc[subOrder.status] = (acc[subOrder.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 获取状态样式
    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'processing':
          return 'bg-blue-100 text-blue-800';
        case 'reviewing':
          return 'bg-yellow-100 text-yellow-800';
        case 'pending':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    // 日期格式化
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    };

    // 任务类型图标
    const getTaskTypeIcon = (type: string) => {
      switch (type) {
        case 'comment':
          return '💬';
        case 'share':
          return '🔗';
        default:
          return '📋';
      }
    };

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all mb-3">
        {/* 订单号和复制按钮 */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-gray-700">
            订单号：{order.orderNumber}
          </div>
          <div className="relative">
            <button
              onClick={() => onCopyOrderNumber(order.orderNumber)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ⧉ 复制
            </button>
          </div>
        </div>

        {/* 创建时间 */}
        <div className="text-sm text-gray-500 mb-2">
          创建时间：{formatDate(order.publishTime)}
        </div>

        {/* 标题和状态 */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
            {order.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
            {order.status === 'completed' ? '已完成' : '进行中'}
          </span>
        </div>

        {/* 描述 */}
        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
          {order.description}
        </div>

        {/* 任务类型和预算 */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-1">{getTaskTypeIcon(order.type)}</span>
            {order.type === 'comment' ? '评论任务' : order.type === 'share' ? '分享任务' : '其他任务'}
          </div>
          <div className="text-sm font-medium text-gray-900">
            订单单价：¥{order.price.toFixed(2)}
          </div>
        </div>

        {/* 子订单状态统计 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            已完成：{subOrderStats.completed || 0}
          </span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            进行中：{subOrderStats.processing || 0}
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            待领取：{subOrderStats.pending || 0}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleTaskAction(order.id, '查看详情')}
            className="flex-1 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={() => handleTaskAction(order.id, '再次下单')}
            className="flex-1 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            再次下单
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4 mt-6 space-y-4">
      {/* 复制成功提示 */}
      {showCopyTooltip && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {tooltipMessage}
        </div>
      )}
      
      {/* 使用标准模板组件 */}
      <OrderHeaderTemplate
        title="已完成的订单"
        totalCount={completedTasks.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewAllUrl="/publisher/tasks/completed"
        onViewAllClick={() => router.push('/publisher/tasks/completed' as any)}
      />
      
      {/* 任务列表 */}
      <div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => {
            const order = convertToOrderFormat(task, index);
            return (
              <MainOrderCard
                key={`completed-${task.id}-${index}`}
                order={order}
                onCopyOrderNumber={handleCopyOrderNumber}
              />
            );
          })
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">暂无相关任务</p>
          </div>
        )}
      </div>
    </div>
  );
}