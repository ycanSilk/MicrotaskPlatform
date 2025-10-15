'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Radio } from '@/components/ui/Radio';
import { Label } from '@/components/ui/Label';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import AccountCard from '../components/AccountCard';
import AccountRentalLayout from '../layout';
import { AccountRentalInfo } from '../types';

// 筛选选项常量集合
const FILTER_OPTIONS = {
  platform: [
    { value: 'all', label: '平台' },
    { value: 'douyin', label: '抖音' },
    { value: 'xiaohongshu', label: '小红书' },
    { value: 'kuaishou', label: '快手' }
  ],
  publishTime: [
    { value: 'all', label: '发布时间' },
    { value: '12h', label: '12小时内' },
    { value: '24h', label: '24小时内' },
    { value: '2d', label: '2天内' },
    { value: '3d', label: '3天内' }
  ],
  priceFilter: [
    { value: 'all', label: '价格' },
    { value: '0-50', label: '0-50元' },
    { value: '50-100', label: '50-100元' },
    { value: '100-200', label: '100-200元' },
    { value: '200+', label: '200元以上' }
  ]

};

// 根据平台获取对应图标
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'douyin':
      return <AudioOutlined className="text-6xl" />;
    case 'xiaohongshu':
      return <BookOutlined className="text-6xl" />;
    case 'kuaishou':
      return <ToolOutlined className="text-6xl" />;
    default:
      return <BookOutlined className="text-6xl" />;
  }
};

// 模拟账号数据
const MOCK_ACCOUNT_DATA: AccountRentalInfo[] = [
  {
    id: 'acc-001',
    platform: 'douyin',
    platformIcon: getPlatformIcon('douyin'),
    accountTitle: '美食探店达人',
    followersRange: '50k-100k',
    engagementRate: '5.2%',
    contentCategory: 'food',
    orderPrice: 120,
    price: 120*0.77, // 订单单价 = 派单单价 * 77%
    rentalDuration: 1,
    minimumRentalHours: 2,
    accountScore: 4.8,
    region: 'national',
    accountAge: '12+',
    deliveryTime: 60,
    maxConcurrentUsers: 1,
    responseTime: 30,
    availableCount: 1,
    publishTime: '2023-06-15T09:30:00Z',
    includedFeatures: ['基础发布', '数据分析'],
    description: '专注于美食探店内容，有稳定的粉丝群体和良好的互动率',
    advantages: ['粉丝活跃度高', '内容质量优', '响应速度快'],
    restrictions: ['禁止发布违法内容', '禁止更改账号设置'],
    status: 'active',
    images: ['/images/1758380776810_96.jpg', '/images/1758380782226_96.jpg'],
    publisherName: '美食达人'
  }

];



export default function AccountRentalMarketPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountRentalInfo[]>([]);
  
  // 处理返回逻辑
  const handleBack = () => {
    // 检查是否有from参数，如果有且等于commenter-hall，则返回抢单大厅
    const fromParam = searchParams?.from;
    if (fromParam === 'commenter-hall') {
      router.push('/commenter/hall');
    } else {
      // 否则使用浏览器的返回功能
      router.back();
    }
  };
  
  // 其他状态和逻辑保持不变
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedFollowersRange, setSelectedFollowersRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('time_desc');
  const [priceSort, setPriceSort] = useState('all');
  const [publishTime, setPublishTime] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // 懒加载相关状态
  const [displayedAccounts, setDisplayedAccounts] = useState<AccountRentalInfo[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 初始化数据
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟 - 减少延迟时间以提高用户体验
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 实际项目中，这里应该从API获取数据
        // const response = await fetch('/api/account-rental/market', {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${authToken}`
        //   }
        // });
        // const result = await response.json();
        // if (result.success) {
        //   setAccounts(result.data);
        // }
        
        // 暂时使用模拟数据
        // 为了演示懒加载效果，复制数据以增加数量
        const expandedData = [...MOCK_ACCOUNT_DATA];
        for (let i = 0; i < 5; i++) {
          expandedData.push(...MOCK_ACCOUNT_DATA.map(item => ({
            ...item,
            id: `${item.id}-${i+1}`
          })));
        }
        setAccounts(expandedData);
      } catch (error) {
        console.error('获取账号租赁市场数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // 处理筛选条件变化时重置分页
  useEffect(() => {
    setPage(1);
    setDisplayedAccounts([]);
  }, [searchTerm, selectedPlatform, selectedFollowersRange, selectedSort, publishTime, priceFilter]);

  // 获取分类名称 - 保留用于搜索筛选兼容性

  // 使用useMemo优化筛选和排序操作，避免不必要的重复计算
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(account => 
        account.accountTitle.toLowerCase().includes(term)
      );
    }

    // 平台筛选
    if (selectedPlatform !== 'all') {
      result = result.filter(account => account.platform === selectedPlatform);
    }

    // 粉丝数筛选
    if (selectedFollowersRange !== 'all') {
      result = result.filter(account => account.followersRange === selectedFollowersRange);
    }

    // 发布时间筛选
    if (publishTime !== 'all') {
      const now = new Date();
      let timeThreshold = new Date();
      
      switch (publishTime) {
        case '12h':
          timeThreshold.setHours(now.getHours() - 12);
          break;
        case '24h':
          timeThreshold.setHours(now.getHours() - 24);
          break;
        case '2d':
          timeThreshold.setDate(now.getDate() - 2);
          break;
        case '3d':
          timeThreshold.setDate(now.getDate() - 3);
          break;
        default:
          break;
      }
      
      result = result.filter(account => {
        if (!account.publishTime) return false;
        return new Date(account.publishTime) >= timeThreshold;
      });
    }

    // 价格筛选
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case '0-50':
          result = result.filter(account => account.price >= 0 && account.price <= 50);
          break;
        case '50-100':
          result = result.filter(account => account.price > 50 && account.price <= 100);
          break;
        case '100-200':
          result = result.filter(account => account.price > 100 && account.price <= 200);
          break;
        case '200+':
          result = result.filter(account => account.price > 200);
          break;
        default:
          break;
      }
    }

    // 排序 - 默认按发布时间降序排序
    if (selectedSort === 'time_desc') {
      // 按发布时间降序排序
      result.sort((a, b) => {
        return new Date(b.publishTime || '').getTime() - new Date(a.publishTime || '').getTime();
      });
    }

    return result;
  }, [accounts, searchTerm, selectedPlatform, selectedFollowersRange, selectedSort, publishTime, priceFilter]);

  // 当筛选结果变化时，重新设置显示的账号
  useEffect(() => {
    if (filteredAccounts.length > 0) {
      const initialBatch = filteredAccounts.slice(0, itemsPerPage);
      setDisplayedAccounts(initialBatch);
      setHasMore(filteredAccounts.length > initialBatch.length);
    } else {
      setDisplayedAccounts([]);
      setHasMore(false);
    }
  }, [filteredAccounts]);

  // 加载更多账号
  const loadMoreAccounts = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // 模拟网络请求延迟 - 减少延迟时间
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newBatch = filteredAccounts.slice(startIndex, endIndex);
      
      if (newBatch.length > 0) {
        setDisplayedAccounts(prev => [...prev, ...newBatch]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < filteredAccounts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载更多账号失败:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 使用无限滚动钩子
  const { containerRef } = useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMoreAccounts,
    threshold: 200
  });

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑已经在useEffect中处理
  };

  // 处理搜索输入框回车
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 处理账号卡片点击
  const handleAccountClick = (accountId: string) => {
    // 在实际项目中，应该跳转到账号详情页
    // router.push(`/publisher/account-rental-market/detail/${accountId}`);
    console.log('查看账号详情:', accountId);
  };

  // 处理立即租用按钮点击
  const handleRentNow = (accountId: string) => {
    // 在实际项目中，应该跳转到租用确认页
    // router.push(`/publisher/account-rental-market/rent/${accountId}`);
    console.log('立即租用账号:', accountId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <div>加载中...</div>
          <div className="text-xs text-gray-500 mt-2">
            正在获取账号租赁市场数据，请稍候...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* 发布出租账号按钮 */}
      <div className="px-4 pt-4">
        <Button 
          onClick={() => router.push('/accountrental/account-rental-publish')}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg text-lg font-medium shadow-md transition-all min-h-12 active:scale-95"
        >
          发布出租账号
        </Button>
      </div>

      {/* 筛选和搜索区域 - 优化移动端体验 */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-xl py-4 px-3 shadow-sm">
          {/* 横向筛选栏 - 2个元素固定一行显示，优化移动端体验 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="py-2">
              <div className="flex items-center space-x-0">
                {/* 筛选选项组件 - 优化移动端选择器 */}
                {
                  [
                    { value: publishTime, onChange: setPublishTime, options: FILTER_OPTIONS.publishTime },
                    { value: selectedPlatform, onChange: setSelectedPlatform, options: FILTER_OPTIONS.platform }
                  ].map((filter, index) => (
                  <div key={index} className="relative flex-1">
                    <select
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="appearance-none w-full bg-transparent text-gray-700 border border-transparent focus:outline-none focus:border-blue-300 pr-8 py-2 text-center text-sm md:text-base"
                      style={{
                        // 增大移动端触摸区域
                        minHeight: '44px',
                        // 优化iOS选择器外观
                        WebkitAppearance: 'none',
                        // 优化移动端字体大小
                        fontSize: '14px'
                      }}
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
              
                    {/* 分隔线 */}
                    {index < 1 && <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-6 w-px bg-gray-200"></div>}
                  </div>
                ))
                }
              </div>
            </div>
          </div>
          
          {/* 搜索框 - 响应式布局，优化移动端体验 */}
          <div className="flex gap-2  w-full">
            <div className='flex-1'>
              <Input
                type="text"
                placeholder="搜索账号标题或分类..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="h-12 px-4"
                style={{
                  // 增大移动端触摸区域
                  minHeight: '48px',
                  // 优化移动端输入体验
                  fontSize: '14px'
                }}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap px-4 min-h-12 min-w-12 transition-all active:scale-95"
            >
              <SearchOutlined size={20} />
            </Button>
          </div>
        </div>
      </div>

              {/* 账号列表 - 添加滚动容器引用 */}
              <div 
                className="px-4"
                ref={containerRef}
                style={{ 
                  overflowY: 'auto'
                }}
              >
                {displayedAccounts.length === 0 && !loading ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">暂无符合条件的账号</h3>
                    <p className="text-gray-600 mb-4">尝试调整筛选条件或搜索关键词</p>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedPlatform('all');
                        setSelectedFollowersRange('all');
                        setSelectedSort('time_desc');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      重置筛选条件
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedAccounts.map(account => (
                      <AccountCard 
                        key={account.id} 
                        account={account} 
                        onAccountClick={handleAccountClick} 
                        onRentNow={handleRentNow} 
                      />
                    ))}

                    {/* 加载更多指示器 */}
                    {loadingMore && (
                      <div className="py-6 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">加载中...</span>
                      </div>
                    )}

                    {/* 没有更多数据时的提示 */}
                    {!hasMore && displayedAccounts.length > 0 && (
                      <div className="py-6 text-center text-gray-500 text-sm">
                        没有更多账号了
                      </div>
                    )}
                  </div>
                )}
              </div>

      {/* 提示信息 */}
      <div className="px-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">账号租赁提示</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                请根据您的需求筛选合适的账号进行租赁。租赁前请仔细查看账号详情和租赁条款，确保账号符合您的推广需求。如有疑问，可联系客服咨询。
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
  