'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';
import { Button, AlertModal } from '@/components/ui';

// 定义账号租赁订单类型
interface AccountRentalOrder {
  id: string;
  orderNumber: string;
  platform: string;
  accountType: string;
  followers: string;
  engagement: string;
  rating: number;
  rentalDays: number;
  totalPrice: number;
  status: 'pending' | 'progress' | 'completed' | 'cancelled';
  publishTime: string;
  deadline: string;
  accountDetails: {
    username: string;
    loginMethod: string;
  };
  usagePurpose: string;
}

// 模拟从用户终端传递过来的订单数据
const generateMockOrders = (): AccountRentalOrder[] => {
  return [
    {
      id: 'order001',
      orderNumber: 'AR20250920458',
      platform: '抖音',
      accountType: '达人账号',
      followers: '50000+',
      engagement: '4.5%',
      rating: 4.9,
      rentalDays: 7,
      totalPrice: 350,
      status: 'progress',
      publishTime: '2025-09-20T10:30:00Z',
      deadline: '2025-09-27T23:59:59Z',
      accountDetails: {
        username: 'tech_account_001',
        loginMethod: '手机验证登录'
      },
      usagePurpose: '用于产品推广和内容宣传，主要发布科技类产品评测视频'
    },
    {
      id: 'order002',
      orderNumber: 'AR20250918365',
      platform: '抖音',
      accountType: '专业领域账号',
      followers: '20000+',
      engagement: '5.7%',
      rating: 4.7,
      rentalDays: 3,
      totalPrice: 150,
      status: 'completed',
      publishTime: '2025-09-18T14:20:00Z',
      deadline: '2025-09-21T23:59:59Z',
      accountDetails: {
        username: 'finance_expert_001',
        loginMethod: '密码登录'
      },
      usagePurpose: '用于金融知识分享和理财产品介绍'
    },
    {
      id: 'order003',
      orderNumber: 'AR20250921789',
      platform: '抖音',
      accountType: '普通用户',
      followers: '5000+',
      engagement: '3.2%',
      rating: 4.8,
      rentalDays: 5,
      totalPrice: 250,
      status: 'pending',
      publishTime: '2025-09-21T09:15:00Z',
      deadline: '2025-09-26T23:59:59Z',
      accountDetails: {
        username: 'daily_share_001',
        loginMethod: '第三方登录'
      },
      usagePurpose: '用于日常内容分享和生活记录，主要面向年轻用户群体'
    }
  ];
};

// 状态文本映射
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '待确认',
    'progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return statusMap[status] || status;
};

// 状态样式映射
const getStatusStyle = (status: string): string => {
  const styleMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  };
  return styleMap[status] || 'bg-gray-100 text-gray-800';
};

// 格式化日期
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AccountRentalPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AccountRentalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 通用提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });

  // 显示通用提示框
  const showAlert = (title: string, message: string, icon: string) => {
    setAlertConfig({ title, message, icon });
    setShowAlertModal(true);
  };

  // 加载订单数据
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 使用PublisherAuthStorage获取认证token和用户信息
        const auth = PublisherAuthStorage.getAuth();
        const token = auth?.token;
        
        if (!token) {
          showAlert('认证失败', '用户未登录，请重新登录', '❌');
          router.push('/publisher/login' as any);
          return;
        }
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 这里应该是实际的API请求，但现在使用模拟数据
        // const response = await fetch('/api/publisher/account-rental/orders', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const result = await response.json();
        // if (result.success) {
        //   setOrders(result.orders);
        // } else {
        //   throw new Error(result.message || '获取订单失败');
        // }
        
        // 使用模拟数据
        setOrders(generateMockOrders());
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取订单失败');
        showAlert('加载失败', err instanceof Error ? err.message : '获取订单失败，请稍后重试', '❌');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [router]);

  // 查看订单详情
  const handleViewOrderDetail = (orderId: string) => {
    router.push(`/publisher/dashboard/account-rental-detail?orderId=${orderId}`);
  };

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBack}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors mr-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">租号订单列表</h1>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-lg">
              🔑
            </div>
            <p className="text-blue-100">这里展示您通过用户终端发布的租号订单信息</p>
          </div>
          <p className="text-blue-100 text-sm">您可以查看每个订单的状态和详细信息，进行相应操作</p>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="px-4 py-6">
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">加载订单中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              加载失败
            </div>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-gray-300 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无租号订单</h3>
            <p className="text-gray-500 mb-6 text-center">您还没有通过用户终端发布任何租号订单</p>
            <Button 
              onClick={() => router.push('/publisher/create')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              发布新任务
            </Button>
          </div>
        )}

        {/* 订单列表 */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-4">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                        {order.platform === '抖音' ? '🎵' : '📱'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{order.platform} - {order.accountType}</h3>
                        <p className="text-gray-500 text-sm">订单号: {order.orderNumber}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* 订单信息 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">粉丝数量</span>
                      <span className="font-medium text-gray-900">{order.followers}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">互动率</span>
                      <span className="font-medium text-gray-900">{order.engagement}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">账号评分</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium text-gray-900">{order.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">租赁时长</span>
                      <span className="font-medium text-gray-900">{order.rentalDays} 天</span>
                    </div>
                  </div>

                  {/* 使用目的 */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">使用目的</div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                      {order.usagePurpose}
                    </div>
                  </div>

                  {/* 订单时间和价格 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      发布时间: {formatDate(order.publishTime)}
                    </div>
                    <div className="font-bold text-lg text-orange-500">
                      ¥{order.totalPrice}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <Button 
                    onClick={() => handleViewOrderDetail(order.id)}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    查看订单详情
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}