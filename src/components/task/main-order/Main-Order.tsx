import React from 'react';
import { useRouter } from 'next/navigation';

// 定义订单类型接口
export interface SubOrder {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  status: 'pending' | 'processing' | 'reviewing' | 'completed' | 'rejected' | 'cancelled';
  submitTime?: string;
  reviewTime?: string;
  reward: number;
  content?: string;
  screenshots?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'reviewing' | 'completed' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  budget: number;
  assignedTo?: string;
  completionTime?: string;
  type: 'comment' | 'like' | 'share' | 'other';
  subOrders: SubOrder[];
  videoUrl?: string;
}

interface MainOrderCardProps {
  order: Order;
  onCopyOrderNumber?: (orderNumber: string) => void;
  onViewDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  copiedOrderNumber?: string | null;
}

const MainOrderCard: React.FC<MainOrderCardProps> = ({
  order,
  onCopyOrderNumber,
  onViewDetails,
  onReorder,
  copiedOrderNumber
}) => {
  const router = useRouter();

  // 获取子订单各状态的统计数据
  const getSubOrderStats = (subOrders: SubOrder[]) => {
    const stats = {
      total: subOrders.length,
      pending: subOrders.filter(sub => sub.status === 'pending').length,
      processing: subOrders.filter(sub => sub.status === 'processing').length,
      reviewing: subOrders.filter(sub => sub.status === 'reviewing').length,
      completed: subOrders.filter(sub => sub.status === 'completed').length,
      rejected: subOrders.filter(sub => sub.status === 'rejected').length
    };
    return stats;
  };

  // 获取状态对应的中文名称和样式
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      pending: { text: '待处理', className: 'bg-yellow-100 text-yellow-800' },
      processing: { text: '进行中', className: 'bg-blue-100 text-blue-800' },
      reviewing: { text: '审核中', className: 'bg-purple-100 text-purple-800' },
      completed: { text: '已完成', className: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒绝', className: 'bg-red-100 text-red-800' },
      cancelled: { text: '已取消', className: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  };

  // 获取任务类型对应的文本
  const getTaskTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      comment: '评论任务',
      like: '点赞推广',
      share: '内容分享',
      other: '账号租赁'
    };
    return typeMap[type] || '其他任务';
  };

  // 计算完成进度
  const subOrderStats = getSubOrderStats(order.subOrders);
  const completionRate = subOrderStats.total > 0 
    ? Math.round((subOrderStats.completed / subOrderStats.total) * 100) 
    : 0;

  // 处理复制订单号
  const handleCopyOrderNumber = () => {
    if (onCopyOrderNumber) {
      onCopyOrderNumber(order.orderNumber);
    }
  };

  // 处理查看详情
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(order.id);
    } else {
      router.push(`/publisher/orders/task-detail/${order.id}`);
    }
  };

  // 处理补单
  const handleReorder = () => {
    if (onReorder) {
      onReorder(order.id);
    } else {
      router.push(`/publisher/create?reorder=${order.id}`);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2 bg-white">
      <div className="flex items-center mb-1 overflow-hidden">
        <div className="flex-1 mr-2 whitespace-nowrap overflow-hidden text-truncate">
          订单编号：{order.orderNumber}
        </div>
        <button 
          className="text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md whitespace-nowrap"
          onClick={handleCopyOrderNumber}
        >
          {copiedOrderNumber === order.orderNumber ? '已复制' : '复制'}
        </button>
      </div>
      <div className="flex items-center space-x-3 mb-2 pb-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(order.status).className}`}>
          {getStatusInfo(order.status).text}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {getTaskTypeText(order.type)}
        </span>
      </div>
      <div className="mb-2 text-sm ">
        更新时间：{order.updatedAt}
      </div>
      <div className="mb-2 text-sm ">
        发布时间：{order.createdAt}
      </div>
      <div className="mb-2">
        <p className='mb-2'>视频链接：</p>
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 text-base font-medium mb-2 flex items-center"
        >
          {order.videoUrl || '暂无视频链接'}
        </a>
        <p className="text-gray-700 bg-gray-100 text-sm line-clamp-3 leading-relaxed mt-2 w-full p-3 rounded-lg">
          任务要求：{order.description}
        </p>
      </div>
      <div className="flex justify-between gap-2 mb-2">
        <div className="flex-1 bg-green-600 rounded-lg p-3 text-center">
          <span className="text-white mb-2">总价格</span>
          <span className="text-white block">¥{order.budget.toFixed(2)}</span>
        </div>
        <div className="flex-1 bg-green-600 rounded-lg p-3 text-center">
          <span className="text-white mb-2">单价</span>
          <span className="text-white block">¥{(order.budget / Math.max(subOrderStats.total, 1)).toFixed(2)}</span>
        </div>
        <div className="flex-1 bg-green-600 rounded-lg p-3 text-center">
          <span className="text-white mb-2">订单数</span>
          <span className="text-white block">{subOrderStats.total}</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 text-sm mb-2">
        <div className="text-center">
          <div className="text-blue-500 mb-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
            总览
          </div>
          <div className="font-medium text-blue-500">{subOrderStats.total}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 mb-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
            待领取
          </div>
          <div className="font-medium text-gray-500">{subOrderStats.pending}</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-500 mb-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            进行中
          </div>
          <div className="font-medium text-yellow-500">{subOrderStats.processing}</div>
        </div>
        <div className="text-center">
          <div className="text-purple-500 mb-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
            待审核
          </div>
          <div className="font-medium text-purple-500">{subOrderStats.reviewing}</div>
        </div>
        <div className="text-center">
          <div className="text-green-500 mb-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            已完成
          </div>
          <div className="font-medium text-green-500">{subOrderStats.completed}</div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm text-black mb-2">
          <span>完成进度</span>
          <span>{subOrderStats.completed}/{subOrderStats.total} ({completionRate}%)</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full"
          onClick={handleViewDetails}
        >
          查看详情
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full"
          onClick={handleReorder}
        >
          补单
        </button>
      </div>
    </div>
  );
};

export default MainOrderCard;