'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
    { value: 'douyin', label: '抖音' }
  ],
  publishTime: [
    { value: 'all', label: '发布时间' },
    { value: '1d', label: '1天内' },
    { value: '3d', label: '3天内' },
    { value: '7d', label: '7天内' }
  ]
};



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
  
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [publishTime, setPublishTime] = useState('all');
  const [loading, setLoading] = useState(true);
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
        
        // 调用后端API路由获取数据，使用合适的查询参数
        const response = await fetch(`/api/accountrental/market-lease-infos?page=0&size=20&sort=createTime&direction=DESC`);
        
        // 检查响应状态
        if (!response.ok) {
          console.error(`获取账号租赁市场数据失败: HTTP ${response.status}`);
          setAccounts([]);
          return;
        }
        
        // 尝试解析JSON，处理可能的非JSON响应
        let result;
        try {
          result = await response.json();
        } catch (e) {
          console.error('解析API响应失败，可能返回了非JSON数据:', e);
          setAccounts([]);
          return;
        }
        
        if (result.success && result.data) {
          // 直接设置API返回的数据
          setAccounts(result.data);
        } else {
          console.error('获取账号租赁市场数据失败:', result.message || '未知错误');
          // API调用失败，清空账号列表以显示空状态
          setAccounts([]);
        }
      } catch (error) {
        console.error('获取账号租赁市场数据失败:', error);
        // API调用异常，清空账号列表以显示空状态
        setAccounts([]);
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
  }, [selectedPlatform, publishTime]);

  // 使用useMemo优化筛选和排序操作，避免不必要的重复计算
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // 平台筛选
    if (selectedPlatform !== 'all') {
      result = result.filter(account => account.platform === selectedPlatform);
    }

    // 发布时间筛选
    if (publishTime !== 'all') {
      const now = new Date();
      let timeThreshold = new Date();
      
      switch (publishTime) {
        case '1d':
          timeThreshold.setDate(now.getDate() - 1);
          break;
        case '3d':
          timeThreshold.setDate(now.getDate() - 3);
          break;
        case '7d':
          timeThreshold.setDate(now.getDate() - 7);
          break;
        default:
          break;
      }
      
      result = result.filter(account => {
        if (!account.publishTime) return false;
        return new Date(account.publishTime) >= timeThreshold;
      });
    }

    // 按发布时间降序排序
    result.sort((a, b) => {
      return new Date(b.publishTime || '').getTime() - new Date(a.publishTime || '').getTime();
    });

    return result;
  }, [accounts, selectedPlatform, publishTime]);

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

  // 已删除搜索相关功能

  // 处理账号卡片点击
  const handleAccountClick = (accountId: string) => {
    router.push(`/accountrental/account-rental-market/market-detail?id=${accountId}`);
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
      <div className="px-4 pt-4 mb-3">
        <Button 
          onClick={() => router.push('/accountrental/account-rental-publish')}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg text-lg font-medium shadow-md transition-all min-h-12 active:scale-95"
        >
          发布出租账号
        </Button>
      </div>

      {/* 筛选和搜索区域 - 优化移动端体验 */}
      <div className="px-4">
        <div className="bg-white rounded-xl">
          {/* 横向筛选栏 - 2个元素固定一行显示，优化移动端体验 */}
          <div className="bg-white border border-gray-200 shadow-sm mb-3 overflow-hidden">
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
                  setSelectedPlatform('all');
                  setPublishTime('all');
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
  