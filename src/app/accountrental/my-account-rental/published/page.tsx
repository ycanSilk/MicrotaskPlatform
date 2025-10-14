'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SearchBar from '@/components/button/SearchBar';

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

// 模拟发布的账号数据
interface PublishedAccount {
  userid: string;
  orderId: string;
  title: string;
  platform: string;
  platformIcon: React.ReactNode;
  followers: string;
  status: 'active' | 'pending' | 'inactive' | 'sold';
  publishTime: string;
  rentalCount: number;
  rating: number;
  price: number;
  lastRentalTime?: string;
  sellerName: string;
  sellerAvatar: string;
  hasReturnInsurance?: boolean;
}

const PublishedAccountsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [publishedAccounts, setPublishedAccounts] = useState<PublishedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟获取数据
  useEffect(() => {
    const fetchPublishedAccounts = async () => {
      try {
        setLoading(true);
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟数据
        const mockData: PublishedAccount[] = [
          {
            userid: 'pub001',
            orderId: 'order001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: getPlatformIcon('douyin'),
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00',
            sellerName: '真诚对待 诚心交易',
            sellerAvatar: '👨‍💼',
            hasReturnInsurance: true
          },
          {
            userid: 'pub001',
            orderId: 'order002',
            title: '生活方式博主',
            platform: 'douyin',
            platformIcon: '🎵',
            followers: '120k',
            status: 'inactive',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00',
            sellerName: '英杰数码科技',
            sellerAvatar: '👨‍💻'
          },
          {
            userid: 'pub002',
            orderId: 'order003',
            title: '旅行摄影师',
            platform: 'xiaohongshu',
            platformIcon: '📕',
            followers: '85k',
            status: 'active',
            publishTime: '2025-10-02T10:30:00',
            rentalCount: 18,
            rating: 4.6,
            price: 95,
            lastRentalTime: '2025-10-03T10:30:00',
            sellerName: 'wyfd168',
            sellerAvatar: '📸',
            hasReturnInsurance: true
          },
          {
            userid: 'pub003',
            orderId: 'order004',
            title: '健身达人分享',
            platform: 'kuaishou',
            platformIcon: '🎬',
            followers: '65k',
            status: 'inactive',
            publishTime: '2025-10-01T10:30:00',
            rentalCount: 12,
            rating: 4.7,
            price: 80,
            lastRentalTime: '2025-10-02T10:30:00',
            sellerName: '大马猴吃香蕉',
            sellerAvatar: '🐵'
          }
        ];
        
        setPublishedAccounts(mockData);
      } catch (error) {
        console.error('获取发布账号列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedAccounts();
  }, []);

  // 筛选和搜索逻辑
  const filteredAccounts = publishedAccounts.filter(account => {
    const matchesSearch = account.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         account.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || account.status === selectedStatus;
    const matchesPlatform = selectedPlatform === 'all' || account.platform === selectedPlatform;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // 排序逻辑
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'rentalCount') {
      return b.rentalCount - a.rentalCount;
    } else if (sortBy === 'price') {
      return b.price - a.price;
    }
    return 0;
  });

  // 获取状态对应的颜色和文本
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: 'text-green-600', text: '交易成功' },
      pending: { color: 'text-yellow-600', text: '待发货' },
      inactive: { color: 'text-orange-600', text: '交易关闭，有退款' },
      sold: { color: 'text-blue-600', text: '已售出' }
    };
    return statusMap[status] || { color: 'text-blue-600', text: status };
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

  // 账号租赁相关的搜索模块配置
  const accountRentalModules = [
    {
      keywords: ['账号', '账号租赁', '出租'],
      urlPath: '/accountrental/account-rental-market',
      moduleName: '账号租赁市场',
    },
    {
      keywords: ['我的账号', '发布账号'],
      urlPath: '/accountrental/my-account-rental/published',
      moduleName: '我发布的账号',
    },
    {
      keywords: ['租赁记录', '租用账号'],
      urlPath: '/accountrental/my-account-rental/rented',
      moduleName: '我租用的账号',
    },
  ];

  // 处理应用筛选条件
  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
    // 在实际项目中，这里可以添加应用筛选条件的逻辑
    console.log('应用筛选条件:', { selectedStatus, selectedPlatform });
  };

  // 账号操作菜单状态管理
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // 处理下拉菜单开关
  const toggleDropdownMenu = (accountId: string) => {
    // 先关闭排序菜单
    setSortMenuOpen(false);
    // 直接切换下拉菜单状态
    setDropdownMenuOpen(prev => {
      return prev === accountId ? null : accountId;
    });
  };

  // 处理排序菜单开关
  const toggleSortMenu = () => {
    // 先关闭下拉菜单
    setDropdownMenuOpen(null);
    // 再切换排序菜单状态
    setSortMenuOpen(!sortMenuOpen);
  };

  // 关闭所有下拉菜单
  const closeAllMenus = () => {
    setDropdownMenuOpen(null);
    setSortMenuOpen(false);
  };

  // 点击页面其他地方关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 使用特定类名来查找菜单容器
      const menuContainers = document.querySelectorAll('.account-menu-container');
      let isClickInsideAnyMenu = false;
      
      menuContainers.forEach(container => {
        if (container.contains(event.target as Node)) {
          isClickInsideAnyMenu = true;
        }
      });
      
      // 如果点击不在任何菜单内，则关闭所有菜单
      if (!isClickInsideAnyMenu) {
        closeAllMenus();
      }
    };

    // 添加点击事件监听器到document
    document.addEventListener('click', handleClickOutside);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 账号操作菜单
  const handleToggleStatus = (accountId: string, currentStatus: string) => {
    // 在实际项目中，应该调用API更新状态
    console.log(`${currentStatus === 'active' ? '下架' : '上架'}账号:`, accountId);
    // 这里可以添加状态更新的逻辑
    setDropdownMenuOpen(null);
  };

  // 处理编辑账号
  const handleEditAccount = (accountId: string) => {
    // 在实际项目中，应该跳转到编辑页面
    console.log('编辑账号:', accountId);
    // router.push(`/accountrental/account-rental-publish/edit/${accountId}`);
    setDropdownMenuOpen(null);
  };

  // 处理查看账号详情
  const handleViewAccount = (accountId: string) => {
    // 在实际项目中，应该跳转到账号详情页
    console.log('查看账号详情:', accountId);
    // router.push(`/accountrental/account-rental-market/detail/${accountId}`);
    setDropdownMenuOpen(null);
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索和筛选区域 - 调整为一行显示 */}
      <div className="px-4 py-3 mt-2">
        <div className="flex items-center space-x-3">
          {/* 搜索组件 */}
          <button 
            className="rounded-full py-1.5 px-6 bg-blue-500 text-white"
            onClick={() => document.querySelector('.anticon-search')?.closest('button')?.click()}
            aria-label="搜索"
          >
            <SearchOutlined className="h-6 w-5" />
          </button>
          
          {/* 隐藏原始的SearchBar按钮，保留其功能 */}
          <SearchBar
            placeholder="搜索账号名称或ID"
            className="hidden"
            customModules={accountRentalModules}
          />

          {/* 筛选按钮 */}
          <button 
            onClick={() => setIsFilterModalVisible(true)}
            className="w-auto p-2 flex items-center text-black text-sm px-3 rounded-full border border-gray-200"
          >
            <FilterOutlined className="mr-1 h-4 w-4" />
            筛选
          </button>

          {/* 自定义排序下拉菜单 */}
          <div className="relative">
            <button 
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="w-auto p-2 flex items-center text-black text-sm px-3 rounded-full border border-gray-200"
            >
              {sortBy === 'latest' && '最新发布'}
              {sortBy === 'rating' && '评分最高'}
              {sortBy === 'rentalCount' && '出租最多'}
              {sortBy === 'price' && '价格最高'}
              <DownOutlined className={`ml-1 h-4 w-4 transition-transform ${sortMenuOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
                <button 
                  onClick={() => { setSortBy('latest'); setSortMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  最新发布
                </button>
                <button 
                  onClick={() => { setSortBy('rating'); setSortMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  评分最高
                </button>
                <button 
                  onClick={() => { setSortBy('rentalCount'); setSortMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  出租最多
                </button>
                <button 
                  onClick={() => { setSortBy('price'); setSortMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  价格最高
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 筛选模态框 */}
      {isFilterModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg ">筛选条件</h3>
              <button 
                onClick={() => setIsFilterModalVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseOutlined className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <h4 className="text-sm  text-gray-700 mb-2">账号状态</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedStatus === 'all' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setSelectedStatus('active')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedStatus === 'active' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    交易成功
                  </button>
                  <button
                    onClick={() => setSelectedStatus('pending')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedStatus === 'pending' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    待发货
                  </button>
                  <button
                    onClick={() => setSelectedStatus('inactive')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedStatus === 'inactive' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    交易关闭
                  </button>
                  <button
                    onClick={() => setSelectedStatus('sold')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedStatus === 'sold' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    已售出
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm  text-gray-700 mb-2">平台类型</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedPlatform('all')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedPlatform === 'all' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('douyin')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedPlatform === 'douyin' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    抖音
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('xiaohongshu')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedPlatform === 'xiaohongshu' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    小红书
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('kuaishou')}
                    className={`px-3 py-1  text-xs rounded-full ${selectedPlatform === 'kuaishou' ? 'bg-blue-200 text-blue-700' : 'bg-blue-200 text-gray-700'}`}
                  >
                    快手
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <Button 
                onClick={handleApplyFilters}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 订单状态切换选项卡 */}
      <div className="px-4 py-2 border-b">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-1.5 text-sm font-medium ${selectedStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-4 py-1.5 text-sm font-medium ${selectedStatus === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            待付款
          </button>
          <button
            onClick={() => setSelectedStatus('active')}
            className={`px-4 py-1.5 text-sm font-medium ${selectedStatus === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            已完成
          </button>
          <button
            onClick={() => setSelectedStatus('inactive')}
            className={`px-4 py-1.5 text-sm font-medium ${selectedStatus === 'inactive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            退款中
          </button>
        </div>
      </div>

      {/* 账号列表 - 电商风格布局 */}
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
            <div className="text-5xl mb-3">📱</div>
            <h3 className="text-lg  text-gray-800 mb-1">暂无发布账号</h3>
            <p className="text-gray-500 text-sm mb-4">您还没有发布过任何账号</p>
            <Button
              onClick={() => router.push('/accountrental/account-rental-publish')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              发布新账号
            </Button>
          </div>
        ) : (
          // 账号列表 - 电商风格
          <div className="space-y-4">
            {sortedAccounts.map((account) => {
              const statusInfo = getStatusInfo(account.status);
              
              // 模拟商品图片
              const productImages = {
                'douyin': '/images/douyin-logo.png',
                'xiaohongshu': '/images/xiaohongshu-logo.png',
                'kuaishou': '/images/kuaishou-logo.png'
              };
              
              return (
                <Card key={account.orderId} className="overflow-hidden border-none shadow-sm">
                  {/* 卖家信息和订单状态 */}
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        {account.sellerAvatar}
                      </div>
                      <span className="text-sm font-medium">{account.sellerName}</span>
                    </div>
                    <span className={`text-sm ${statusInfo.color} font-medium`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  
                  {/* 商品信息和价格 */}
                  <div className="flex px-4 py-3 space-x-4">
                    {/* 商品图片 */}
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={productImages[account.platform as keyof typeof productImages] || productImages.douyin}
                        alt={account.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 商品详情 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium mb-1 line-clamp-2">
                        {account.title} - {getPlatformName(account.platform)}账号（{account.followers}粉丝）
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        租金：{account.price}元/天 · 已出租{account.rentalCount}次
                      </p>
                      {account.hasReturnInsurance && (
                        <span className="text-xs text-orange-500 border border-orange-200 px-1.5 py-0.5 rounded">
                          退货包运费
                        </span>
                      )}
                    </div>
                    
                    {/* 价格 */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        ¥{account.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex justify-end px-4 py-2 border-t space-x-2">
                    <button className="px-3 py-1 text-xs border border-gray-200 rounded text-gray-600 hover:bg-gray-50">
                      联系客服
                    </button>
                    <button className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                      查看详情
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-4 text-center text-xs text-gray-500">
        <p>账号管理提示：及时更新账号信息可提高出租率</p>
      </div>
    </div>
  );
};

export default PublishedAccountsPage;