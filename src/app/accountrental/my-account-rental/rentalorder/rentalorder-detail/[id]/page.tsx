'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Space, Avatar, message } from 'antd';
import { PhoneOutlined, CopyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { RentalOrderDetail } from '@/types';

const RentalOrderDetailPage = () => {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<RentalOrderDetail>({
    id: 'ORD202410010001',
    status: '已完成',
    statusText: '订单已完成',
    accountInfo: '租赁账号描速介绍租赁账号描速介绍租赁账号描速介绍租赁账号描速介绍租赁账号描速介绍',
    imageUrl: '/images/1758380776810_96.jpg',
    totalAmount: 199.00,
    orderNumber: '339942699275',
    paymentMethod: '支付宝',
    paymentTime: '2024-10-16 18:47:00',
    orderTime: '2024-10-16 18:46:56',
    rentalDays: 3,
    accountType: '抖音',
    followers: 125000,
    avgLikes: 5000
  });

  // 获取订单状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成':
        return 'text-green-600';
      case '待付款':
        return 'text-red-500';
      case '租赁中':
        return 'text-blue-500';
      case '已取消':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  // 复制订单号
  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderDetail.orderNumber);
      message.success('订单号已复制');
    } catch (err) {
      message.error('复制失败');
    }
  };

  // 联系客服
  const handleContactService = () => {
    message.info('正在连接客服...');
  };

  // 返回订单列表
  const handleBackToList = () => {
    router.push('/accountrental/my-account-rental/rentalorder');
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* 订单状态标题 */}
      <div className={`p-6 bg-white mb-2 ${getStatusStyle(orderDetail.status)}`}>
        <h2 className="text-xl font-medium mb-1">{orderDetail.statusText}</h2>
      </div>

      {/* 内容区域 */}
      <div className="max-w-2xl mx-auto p-4">
        {/* 订单描述和图片 */}
        <Card className="mb-4 border-0 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* 租赁描述信息 */}
            <div>
              <h3 className="text-base font-medium mb-2">{orderDetail.accountInfo}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>账号类型：{orderDetail.accountType}</div>
                <div>租赁时长：{orderDetail.rentalDays} 天</div>
              </div>
            </div>

            {/* 图片展示区域 */}
            <div>
              <h4 className="text-sm text-gray-500 mb-2">账号预览</h4>
              <div className="w-full aspect-video bg-gray-100 overflow-hidden rounded-md">
                {orderDetail.imageUrl ? (
                  <img 
                    src={orderDetail.imageUrl} 
                    alt={orderDetail.accountInfo} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Avatar size={60}>{orderDetail.accountInfo.charAt(0)}</Avatar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 订单信息 */}
        <Card className="mb-4 border-0 shadow-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">实付金额</span>
              <span className="text-lg font-medium text-black">¥{orderDetail.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">订单编号</span>
              <div className="flex items-center gap-2">
                <span>{orderDetail.orderNumber}</span>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />} 
                  size="small" 
                  onClick={handleCopyOrderNumber}
                >
                  复制
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">支付方式</span>
              <span>{orderDetail.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">支付时间</span>
              <span>{orderDetail.paymentTime}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">下单时间</span>
              <span>{orderDetail.orderTime}</span>
            </div>
          </div>
        </Card>

        {/* 底部按钮 */}
        <div className="flex justify-center py-4">
          <Button
            type="default"
            icon={<PhoneOutlined />}
            onClick={handleContactService}
            style={{ borderColor: '#000' }}
          >
            联系客服
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalOrderDetailPage;