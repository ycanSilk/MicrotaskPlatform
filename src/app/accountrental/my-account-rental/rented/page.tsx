'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/Dropdown-menu';
import { Alert } from '@/components/ui/Alert';

// 根据平台获取对应图标
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'douyin':
      return <AudioOutlined className="text-2xl" />;
    case 'xiaohongshu':
      return <BookOutlined className="text-2xl" />;
    case 'kuaishou':
      return <ToolOutlined className="text-2xl" />;
    default:
      return <BookOutlined className="text-2xl" />;
  }
};

// 模拟租赁的账号数据
interface RentedAccount {
  id: string;
  orderId: string;
  accountId: string;
  accountTitle: string;
  platform: string;
  platformIcon: React.ReactNode;
  rentalStartTime: string;
  rentalEndTime: string;
  actualEndTime?: string;
  price: number;
  totalHours: number;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired' | 'overdue' | 'scheduled';
  rating?: number;
  review?: string;
  paymentStatus: 'paid' | 'unpaid';
}

const RentedAccountsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [rentedAccounts, setRentedAccounts] = useState<RentedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟获取数据
  useEffect(() => {
    const fetchRentedAccounts = async () => {
      try {
        setLoading(true);
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 模拟数据
        const mockData: RentedAccount[] = [
          {
            id: 'rent001',
            orderId: 'ORD-20230701-001',
            accountId: 'acc-001',
            accountTitle: '美食探店达人',
            platform: 'douyin',
            platformIcon: getPlatformIcon('douyin'),
            rentalStartTime: '2023-07-01T10:00:00',
            rentalEndTime: '2023-07-01T14:00:00',
            actualEndTime: '2023-07-01T13:45:00',
            price: 120,
            totalHours: 4,
            totalAmount: 480,
            status: 'completed',
            rating: 4.8,
            review: '账号质量很好，粉丝互动率高',
            paymentStatus: 'paid'
          },
          {
            id: 'rent002',
            orderId: 'ORD-20230628-002',
            accountId: 'acc-002',
            accountTitle: '时尚搭配指南',
            platform: 'xiaohongshu',
            platformIcon: '📕',
            rentalStartTime: '2023-06-28T15:30:00',
            rentalEndTime: '2023-06-28T18:30:00',
            actualEndTime: '2023-06-28T18:30:00',
            price: 180,
            totalHours: 3,
            totalAmount: 540,
            status: 'completed',
            rating: 5,
            review: '非常满意，账号活跃度很高',
            paymentStatus: 'paid'
          },
          {
            id: 'rent003',
            orderId: 'ORD-20230702-003',
            accountId: 'acc-005',
            accountTitle: '生活方式分享',
            platform: 'douyin',
            platformIcon: '🎵',
            rentalStartTime: '2023-07-02T09:00:00',
            rentalEndTime: '2023-07-02T13:00:00',
            price: 150,
            totalHours: 4,
            totalAmount: 600,
            status: 'active',
            paymentStatus: 'paid'
          },
          {
            id: 'rent004',
            orderId: 'ORD-20230630-004',
            accountId: 'acc-003',
            accountTitle: '科技产品评测',
            platform: 'kuaishou',
            platformIcon: '🔧',
            rentalStartTime: '2023-06-30T14:00:00',
            rentalEndTime: '2023-06-30T17:00:00',
            actualEndTime: '2023-06-30T16:00:00',
            price: 90,
            totalHours: 3,
            totalAmount: 270,
            status: 'completed',
            rating: 4.5,
            paymentStatus: 'paid'
          },
          {
            id: 'rent005',
            orderId: 'ORD-20230702-005',
            accountId: 'acc-004',
            accountTitle: '旅行摄影分享',
            platform: 'douyin',
            platformIcon: '🎵',
            rentalStartTime: '2023-07-03T16:00:00',
            rentalEndTime: '2023-07-03T19:00:00',
            price: 150,
            totalHours: 3,
            totalAmount: 450,
            status: 'scheduled',
            paymentStatus: 'unpaid'
          }
        ];
        
        setRentedAccounts(mockData);
      } catch (error) {
        console.error('获取租赁账号列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentedAccounts();
  }, []);

  // 筛选和搜索逻辑
  const filteredAccounts = rentedAccounts.filter(account => {
    const matchesSearch = account.accountTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         account.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || account.status === selectedStatus;
    const matchesPlatform = selectedPlatform === 'all' || account.platform === selectedPlatform;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // 排序逻辑
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.rentalStartTime).getTime() - new Date(a.rentalStartTime).getTime();
    } else if (sortBy === 'amount') {
      return b.totalAmount - a.totalAmount;
    } else if (sortBy === 'hours') {
      return b.totalHours - a.totalHours;
    }
    return 0;
  });

  // 获取状态对应的颜色和文本
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: 'bg-blue-100 text-blue-700', text: '进行中' },
      completed: { color: 'bg-green-100 text-green-700', text: '已完成' },
      cancelled: { color: 'bg-gray-100 text-gray-700', text: '已取消' },
      expired: { color: 'bg-orange-100 text-orange-700', text: '已过期' },
      overdue: { color: 'bg-red-100 text-red-700', text: '已逾期' },
      scheduled: { color: 'bg-purple-100 text-purple-700', text: '待开始' }
    };
    return statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status };
  };

  // 获取平台对应的名称
  const getPlatformName = (platform: string) => {
    const platformMap: Record<string, string> = {
      douyin: '抖音',
      xiaohongshu: '小红书',
      kuaishou: '快手'
    };
    return platformMap[platform] || platform;
  };

  // 处理查看账号详情
  const handleViewAccount = (accountId: string) => {
    // 在实际项目中，应该跳转到账号详情页
    console.log('查看账号详情:', accountId);
    // router.push(`/accountrental/account-rental-market/detail/${accountId}`);
  };

  // 处理查看订单详情
  const handleViewOrder = (orderId: string) => {
    // 在实际项目中，应该跳转到订单详情页
    console.log('查看订单详情:', orderId);
    // router.push(`/accountrental/orders/${orderId}`);
  };

  // 处理付款
  const handlePay = (orderId: string) => {
    // 在实际项目中，应该跳转到付款页面
    console.log('付款订单:', orderId);
    // router.push(`/accountrental/payment/${orderId}`);
  };

  // 处理取消订单
  const handleCancelOrder = (orderId: string) => {
    // 在实际项目中，应该调用API取消订单
    console.log('取消订单:', orderId);
    // 这里可以添加取消订单的逻辑
  };

  // 处理评价
  const handleReview = (orderId: string) => {
    // 在实际项目中，应该跳转到评价页面
    console.log('评价订单:', orderId);
    // router.push(`/accountrental/review/${orderId}`);
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
  };

  // 格式化时间（带时分）
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化时间（只带时分）
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-center flex-1">我租赁的账号</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* 提示信息 */}
      <div className="px-4 py-3 bg-blue-50 mt-2">
        <div className="flex items-start">
          <InfoCircleOutlined className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
          <p className="text-xs text-blue-700">租赁期间请遵守平台规则，文明使用账号</p>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="px-4 py-3 bg-white mt-1">
        <div className="relative mb-3">
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索订单号、账号名称或ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center text-gray-600 text-sm px-3 py-1.5 rounded-full border border-gray-200"
          >
            <FilterOutlined className="mr-1 h-4 w-4" />
            筛选
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center text-gray-600 text-sm px-3 py-1.5 rounded-full border border-gray-200"
              >
                {sortBy === 'latest' && '最新租赁'}
                {sortBy === 'amount' && '金额最高'}
                {sortBy === 'hours' && '时长最长'}
                <DownOutlined className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={() => setSortBy('latest')}>最新租赁</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('amount')}>金额最高</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('hours')}>时长最长</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 筛选条件面板 */}
      {isFilterVisible && (
        <div className="px-4 py-3 bg-white mt-1">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">租赁状态</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedStatus('active')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                进行中
              </button>
              <button
                onClick={() => setSelectedStatus('completed')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                已完成
              </button>
              <button
                onClick={() => setSelectedStatus('scheduled')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                待开始
              </button>
              <button
                onClick={() => setSelectedStatus('cancelled')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'cancelled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                已取消
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">平台类型</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedPlatform === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedPlatform('douyin')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedPlatform === 'douyin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                抖音
              </button>
              <button
                onClick={() => setSelectedPlatform('xiaohongshu')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedPlatform === 'xiaohongshu' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                小红书
              </button>
              <button
                onClick={() => setSelectedPlatform('kuaishou')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedPlatform === 'kuaishou' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                快手
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 账号列表 */}
      <div className="px-4 py-3">
        {loading ? (
          // 加载状态
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedAccounts.length === 0 ? (
          // 空状态
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">暂无租赁记录</h3>
            <p className="text-gray-500 text-sm mb-4">您还没有租赁过任何账号</p>
            <Button
              onClick={() => router.push('/accountrental/account-rental-market')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              浏览账号市场
            </Button>
          </div>
        ) : (
          // 账号列表
          <div className="space-y-3">
            {sortedAccounts.map((account) => {
              const statusInfo = getStatusInfo(account.status);
              const isActive = account.status === 'active';
              const isScheduled = account.status === 'scheduled';
              const isCompleted = account.status === 'completed';
              const isPaid = account.paymentStatus === 'paid';
              
              return (
                <Card key={account.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                          {account.platformIcon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{account.accountTitle}</h3>
                          <div className="flex items-center mt-0.5">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mr-2 ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {!isPaid && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                待付款
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreOutlined className="h-5 w-5 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(account.orderId)}>
                            <InfoCircleOutlined className="mr-2 h-4 w-4" />
                            订单详情
                          </DropdownMenuItem>
                          {isScheduled && !isPaid && (
                            <DropdownMenuItem onClick={() => handlePay(account.orderId)} className="text-blue-600">
                              <ClockCircleOutlined className="mr-2 h-4 w-4 text-blue-600" />
                              立即付款
                            </DropdownMenuItem>
                          )}
                          {isScheduled && isPaid && (
                            <DropdownMenuItem 
                              onClick={() => handleCancelOrder(account.orderId)}
                              className="text-red-600"
                            >
                              <ExclamationCircleOutlined className="mr-2 h-4 w-4 text-red-600" />
                              取消订单
                            </DropdownMenuItem>
                          )}
                          {isCompleted && !account.rating && (
                            <DropdownMenuItem 
                              onClick={() => handleReview(account.orderId)}
                              className="text-green-600"
                            >
                              <CheckCircleOutlined className="mr-2 h-4 w-4 text-green-600" />
                              评价订单
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>



                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">订单编号</span>
                        <span className="font-medium text-gray-800">{account.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">平台</span>
                        <span className="font-medium text-gray-800">{getPlatformName(account.platform)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">租赁日期</span>
                        <span className="font-medium text-gray-800">{formatDate(account.rentalStartTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">租赁时长</span>
                        <span className="font-medium text-gray-800">{account.totalHours}小时</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-3 text-sm">
                      <div className="flex items-center">
                        <CalendarOutlined className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {formatTime(account.rentalStartTime)} - {formatTime(account.rentalEndTime)}
                        </span>
                      </div>
                      {account.actualEndTime && (
                        <div className="text-xs text-gray-500">
                          实际结束: {formatTime(account.actualEndTime)}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-red-600">
                        ¥{account.totalAmount.toFixed(2)}
                      </div>
                      <div className="flex space-x-2">
                        {isActive && (
                          <Button 
                            onClick={() => handleViewAccount(account.accountId)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5"
                          >
                            查看账号
                          </Button>
                        )}
                        {isScheduled && !isPaid && (
                          <Button 
                            onClick={() => handlePay(account.orderId)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-1.5"
                          >
                            立即付款
                          </Button>
                        )}
                        {isCompleted && !account.rating && (
                          <Button 
                            onClick={() => handleReview(account.orderId)}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-1.5"
                          >
                            评价
                          </Button>
                        )}
                        {isCompleted && account.rating && (
                          <div className="flex items-center text-yellow-500">
                            {'★'.repeat(Math.floor(account.rating))}
                            {account.rating % 1 >= 0.5 && '☆'}
                          </div>
                        )}
                      </div>
                    </div>

                    {account.review && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">我的评价</h4>
                        <p className="text-xs text-gray-600">{account.review}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-4 text-center text-xs text-gray-500">
        <p>租赁记录保存期限为12个月</p>
      </div>
    </div>
  );
};

export default RentedAccountsPage;