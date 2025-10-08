'use client';
import React from 'react';
import OrderStatus, { OrderStatusType } from '../../order/OrderStatus';
import OrderTaskType, { TaskType } from '../../order/OrderTaskType';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface AuditOrderCardProps {
  order: {
    id: string;
    taskTitle: string;
    commenterName: string;
    submitTime: string;
    content: string;
    images: string[];
    status: string;
    orderNumber?: string;
    updatedTime?: string;
  };
  onCopyOrderNumber: (orderNumber: string) => void;
  onOrderReview: (orderId: string, action: 'approve' | 'reject') => void;
  onImageClick: (imageUrl: string) => void;
}

const AuditOrderCard: React.FC<AuditOrderCardProps> = ({
  order,
  onCopyOrderNumber,
  onOrderReview,
  onImageClick
}) => {
  // 处理复制订单号
  const handleCopyOrderNumber = () => {
    onCopyOrderNumber(order.orderNumber || order.id);
  };

  // 处理图片点击
  const handleImageClick = (imageUrl: string) => {
    onImageClick(imageUrl);
  };

  // 处理审核操作
  const handleApprove = () => {
    onOrderReview(order.id, 'approve');
  };

  const handleReject = () => {
    onOrderReview(order.id, 'reject');
  };

  // 获取状态类型
  const getOrderStatusType = (status?: string): OrderStatusType => {
    if (!status) {
      return OrderStatusType.PENDING;
    }
    
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatusType.PENDING;
      case 'processing':
        return OrderStatusType.PROCESSING;
      case 'reviewing':
      case '待审核':
        return OrderStatusType.REVIEWING;
      case 'completed':
      case 'approved':
        return OrderStatusType.COMPLETED;
      case 'rejected':
        return OrderStatusType.REJECTED;
      case 'cancelled':
        return OrderStatusType.CANCELLED;
      default:
        return OrderStatusType.PENDING;
    }
  };

  // 获取任务类型
  const getTaskType = (taskTitle: string): TaskType => {
    if (taskTitle.includes('账号租赁')) {
      return TaskType.ACCOUNT_RENTAL;
    } else if (taskTitle.includes('视频发布')) {
      return TaskType.VIDEO_PUBLISH;
    } else {
      return TaskType.COMMENT;
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2 bg-white">
      {/* 订单号 */}
      <div className="flex items-center mb-2 overflow-hidden">
        <div className="flex-1 mr-2 whitespace-nowrap overflow-hidden text-truncate">
          订单编号：{order.orderNumber || order.id}
        </div>
        <button 
          className="text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md whitespace-nowrap"
          onClick={handleCopyOrderNumber}
        >
          复制
        </button>
      </div>
      
      {/* 订单状态和任务类型 - 同一行且独立占一行 */}
      <div className="flex items-center mb-2 space-x-4">
        <OrderStatus status={getOrderStatusType(order.status)} />
        <OrderTaskType type={getTaskType(order.taskTitle)} />
      </div>
      
      {/* 时间信息 - 各自独占一行 */}
      <div className="text-sm text-black mb-2">
        发布时间：
        {order.submitTime ? (
          typeof order.submitTime === 'string' && !isNaN(new Date(order.submitTime).getTime())
            ? new Date(order.submitTime).toLocaleString('zh-CN')
            : String(order.submitTime)
        ) : '暂无发布时间'}
      </div>
      <div className="text-sm text-black mb-2">
        更新时间：
        {order.updatedTime ? (
          typeof order.updatedTime === 'string' && !isNaN(new Date(order.updatedTime).getTime())
            ? new Date(order.updatedTime).toLocaleString('zh-CN')
            : String(order.updatedTime)
        ) : order.submitTime ? (
          typeof order.submitTime === 'string' && !isNaN(new Date(order.submitTime).getTime())
            ? new Date(order.submitTime).toLocaleString('zh-CN')
            : String(order.submitTime)
        ) : '暂无更新时间'}
      </div>
  
      {/* 领取用户信息展示 */}
      <div className="text-sm text-black mb-2">
        领取用户: {order.commenterName || String(order.id) || '未知评论员'}
      </div>

      {/* 提交内容 */}
      <div className="mb-3">
        <h5 className="text-sm font-medium  mb-2">提交内容:</h5>
        <div className="bg-white p-3 rounded text-sm text-black border border-gray-500">
          {order.content || '无内容'}
        </div>
      </div>

      {/* 图片附件 */}
      <div className="mb-3">
        <h5 className="text-sm font-medium text-gray-700 mb-2">上传截图:</h5>
        {order.images && order.images.length > 0 ? (
          <div className="flex space-x-2 flex-wrap">
            {order.images.map((image: string, index: number) => (
              <div 
                key={index} 
                className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden shadow-sm"
                onClick={() => handleImageClick(image)}
              >
                <img 
                  src={image} 
                  alt={`上传截图 ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // 防止无限循环
                    target.src = '/images/20250916161008.png';
                    target.alt = `图片加载失败 ${index + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 border border-gray-200">
            暂无上传截图
          </div>
        )}
      </div>

      {/* 审核按钮 */}
      <div className="flex space-x-3 mt-3">
        <button
          onClick={handleApprove}
          className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          disabled={order.status === 'completed' || order.status === 'approved'}
        >
          <CheckCircleOutlined className="mr-1" /> 通过审核
        </button>
        <button
          onClick={handleReject}
          className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          disabled={order.status === 'completed' || order.status === 'approved'}
        >
          <CloseCircleOutlined className="mr-1" /> 驳回订单
        </button>
      </div>
    </div>
  );
};

export default AuditOrderCard;