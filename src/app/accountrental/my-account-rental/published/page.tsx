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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
  id: string;
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
}

const PublishedAccountsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
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
            id: 'pub001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: getPlatformIcon('douyin'),
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00'
          },
          {
            id: 'pub001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: '🎵',
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00'
          },{
            id: 'pub001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: '🎵',
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00'
          },{
            id: 'pub001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: '🎵',
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00'
          },{
            id: 'pub001',
            title: '美食探店达人',
            platform: 'douyin',
            platformIcon: '🎵',
            followers: '120k',
            status: 'active',
            publishTime: '2025-10-03T10:30:00',
            rentalCount: 23,
            rating: 4.8,
            price: 120,
            lastRentalTime: '2025-10-04T10:30:00'
          },
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
                         account.id.toLowerCase().includes(searchTerm.toLowerCase());
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
      active: { color: 'bg-green-100 text-green-700', text: '出租中' },
      pending: { color: 'bg-yellow-100 text-yellow-700', text: '审核中' },
      inactive: { color: 'bg-gray-100 text-gray-700', text: '已下架' },
      sold: { color: 'bg-blue-100 text-blue-700', text: '已售出' }
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

  // 账号操作菜单状态管理
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // 处理下拉菜单开关
  const toggleDropdownMenu = (accountId: string | null) => {
    setDropdownMenuOpen(dropdownMenuOpen === accountId ? null : accountId);
  };

  // 处理排序菜单开关
  const toggleSortMenu = () => {
    setSortMenuOpen(!sortMenuOpen);
  };

  // 关闭所有下拉菜单
  const closeAllMenus = () => {
    setDropdownMenuOpen(null);
    setSortMenuOpen(false);
  };

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
          <h1 className="text-lg font-bold text-center flex-1">我发布的账号</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* 搜索和筛选区域 */}
      <div className="px-4 py-3 bg-white mt-2">
        <div className="relative mb-3">
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索账号名称或ID"
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
          
          {/* 自定义排序下拉菜单 */}
          <div className="relative">
            <button 
              onClick={toggleSortMenu}
              className="flex items-center text-gray-600 text-sm px-3 py-1.5 rounded-full border border-gray-200"
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

      {/* 筛选条件面板 */}
      {isFilterVisible && (
        <div className="px-4 py-3 bg-white mt-1">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">账号状态</h3>
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
                出租中
              </button>
              <button
                onClick={() => setSelectedStatus('pending')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                审核中
              </button>
              <button
                onClick={() => setSelectedStatus('inactive')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'inactive' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                已下架
              </button>
              <button
                onClick={() => setSelectedStatus('sold')}
                className={`px-3 py-1.5 text-xs rounded-full ${selectedStatus === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                已售出
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
            <div className="text-5xl mb-3">📱</div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">暂无发布账号</h3>
            <p className="text-gray-500 text-sm mb-4">您还没有发布过任何账号</p>
            <Button
              onClick={() => router.push('/accountrental/account-rental-publish')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              发布新账号
            </Button>
          </div>
        ) : (
          // 账号列表
          <div className="space-y-3">
            {sortedAccounts.map((account) => {
              const statusInfo = getStatusInfo(account.status);
              
              return (
                <Card key={account.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                          {account.platformIcon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{account.title}</h3>
                          <p className="text-xs text-gray-500">ID: {account.id}</p>
                        </div>
                      </div>
                      
                      {/* 自定义账号操作下拉菜单 */}
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdownMenu(account.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreOutlined className="h-5 w-5 text-gray-500" />
                        </button>
                        {dropdownMenuOpen === account.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
                            <button 
                              onClick={() => handleViewAccount(account.id)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <EyeOutlined className="mr-2 h-4 w-4" />
                              查看详情
                            </button>
                            <button 
                              onClick={() => handleEditAccount(account.id)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <EditOutlined className="mr-2 h-4 w-4" />
                              编辑账号
                            </button>
                            {account.status === 'active' ? (
                              <button 
                                onClick={() => handleToggleStatus(account.id, account.status)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center text-red-600"
                              >
                                <ExclamationCircleOutlined className="mr-2 h-4 w-4 text-red-600" />
                                下架账号
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleToggleStatus(account.id, account.status)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center text-green-600"
                              >
                                <ArrowUpOutlined className="mr-2 h-4 w-4 text-green-600" />
                                上架账号
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">平台</div>
                        <div className="font-medium text-gray-800">{getPlatformName(account.platform)}</div>
                      </div>
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">粉丝数</div>
                        <div className="font-medium text-gray-800">{account.followers}</div>
                      </div>
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">租金</div>
                        <div className="font-medium text-gray-800">¥{account.price}/时</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">出租次数</div>
                        <div className="font-medium text-gray-800">{account.rentalCount}</div>
                      </div>
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">评分</div>
                        <div className="font-medium text-gray-800">{account.rating || '-'}</div>
                      </div>
                      <div className="text-center py-1.5 bg-gray-50 rounded">
                        <div className="text-gray-500">状态</div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <span>发布时间: {formatDate(account.publishTime)}</span>
                      {account.lastRentalTime && (
                        <span>最后租赁: {formatDate(account.lastRentalTime)}</span>
                      )}
                    </div>
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