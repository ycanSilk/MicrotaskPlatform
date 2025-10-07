import React from 'react';
import ReorderButton from '../../../commenter/components/ReorderButton';
import OrderHeaderTemplate from './OrderHeaderTemplate';
import MainOrderCard from '../../../../components/task/main-order/MainOrderCard';
import type { Order } from '../../../../components/task/main-order/MainOrderCard';

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
  updatedTime?: string;
}

interface ActiveTasksTabProps {
  tasks: Task[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  handleTaskAction: (taskId: string, action: string) => void;
  filterRecentOrders: (tasks: any[]) => any[];
  searchOrders: (tasks: any[]) => any[];
  sortTasks: (tasks: Task[]) => Task[];
  onViewAllClick: () => void;
}

const ActiveTasksTab: React.FC<ActiveTasksTabProps> = ({
  tasks,
  searchTerm,
  setSearchTerm,
  handleSearch,
  sortBy,
  setSortBy,
  handleTaskAction,
  filterRecentOrders,
  searchOrders,
  sortTasks,
  onViewAllClick
}) => {
  // 复制订单号功能
  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      // 创建临时提示元素
      const tooltip = document.createElement('div');
      tooltip.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      tooltip.innerText = '订单号已复制';
      document.body.appendChild(tooltip);
      // 2秒后移除提示
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 2000);
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  // 获取过滤和搜索后的订单
  const filteredTasks = sortTasks(searchOrders(filterRecentOrders(tasks)));

  // 获取排序选项
  const sortOptions = [
    { value: 'time', label: '按时间排序' },
    { value: 'price', label: '按价格排序' },
    { value: 'status', label: '按状态排序' }
  ];

  // 数据格式转换
  const convertToOrderFormat = (task: Task): Order => ({
    id: task.id,
    orderNumber: task.id,
    title: task.title,
    description: task.description,
    status: task.status.toLowerCase() as any,
    createdAt: task.publishTime,
    updatedAt: task.updatedTime || task.publishTime,
    budget: task.price * task.maxParticipants,
    type: task.category === '账号租赁' ? ('other' as const) : ('comment' as const),
    subOrders: [
      { id: '1', orderId: task.id, userId: '', userName: '', status: 'completed' as const, reward: task.price },
      ...Array.from({ length: task.completed - 1 }, (_, i) => ({
        id: `${i + 2}`, orderId: task.id, userId: '', userName: '', status: 'completed' as const, reward: task.price
      })),
      ...Array.from({ length: task.inProgress }, (_, i) => ({
        id: `${task.completed + i + 1}`, orderId: task.id, userId: '', userName: '', status: 'processing' as const, reward: task.price
      })),
      ...Array.from({ length: (task.pending || 0) }, (_, i) => ({
        id: `${task.completed + task.inProgress + i + 1}`, orderId: task.id, userId: '', userName: '', status: 'pending' as const, reward: task.price
      }))
    ],
    videoUrl: ''
  });

  return (
    <div className="mx-4 mt-6 space-y-4">
      {/* 使用标准模板组件 */}
      <OrderHeaderTemplate
        title="进行中的任务"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewAllUrl="/publisher/orders"
        onViewAllClick={onViewAllClick}
        sortOptions={sortOptions}
      />
      
      {/* 订单列表 */}
      {filteredTasks.map((task, index) => (
        <MainOrderCard
          key={`task-${task.id}-${index}`}
          order={convertToOrderFormat(task)}
          onCopyOrderNumber={handleCopyOrderNumber}
          onViewDetails={(orderId) => handleTaskAction(orderId, '查看详情')}
        />
      ))}
    </div>
  );
};

export default ActiveTasksTab;