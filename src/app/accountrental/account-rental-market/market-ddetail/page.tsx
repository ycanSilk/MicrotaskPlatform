'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AccountRentalInfo } from '../../types';

// 根据平台获取对应图标
const getPlatformIcon = (platform: string) => {
  const iconMap: Record<string, string> = {
    douyin: '🎵',
    xiaohongshu: '📕',
    kuaishou: '🎬',
  };
  return iconMap[platform] || '📱';
};

// 工具函数集合
const utils = {
  // 获取平台颜色
  getPlatformColor: (platform: string): string => {
    const platformColors: Record<string, string> = {
      douyin: 'bg-gradient-to-r from-red-500 to-pink-600',
      xiaohongshu: 'bg-gradient-to-r from-red-400 to-orange-500',
      kuaishou: 'bg-gradient-to-r from-blue-500 to-teal-400'
    };
    return platformColors[platform] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  },
  
  // 获取账号年龄名称
  getAccountAgeName: (age: string): string => {
    const ageMap: Record<string, string> = {
      '1-3': '1-3个月',
      '3-6': '3-6个月',
      '6-12': '6-12个月',
      '12+': '1年以上'
    };
    return ageMap[age] || age;
  },
  
  // 获取平台中文名
  getPlatformName: (platform: string): string => {
    const platformNames: Record<string, string> = {
      douyin: '抖音',
      xiaohongshu: '小红书',
      kuaishou: '快手'
    };
    return platformNames[platform] || platform;
  }
};

// 模拟获取账号详情数据
const fetchAccountDetail = async (accountId: string): Promise<AccountRentalInfo> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据
  return {
    id: accountId,
    platform: 'douyin',
    platformIcon: <span>{getPlatformIcon('douyin')}</span>,
    accountTitle: '美食探店达人',
    followersRange: '50k-100k',
    engagementRate: '5.2%',
    contentCategory: 'food',
    region: 'national',
    accountAge: '12+',
    accountScore: 4.8,
    orderPrice: 120,
    price: 120*0.77,
    rentalDuration: 1,
    minimumRentalHours: 2,
    deliveryTime: 60,
    maxConcurrentUsers: 1,
    responseTime: 30,
    includedFeatures: ['基础发布', '数据分析'],
    description: '专注于美食探店内容，有稳定的粉丝群体和良好的互动率。账号主要发布各类美食探店视频，覆盖本地热门餐厅和特色小吃，粉丝粘性高，互动活跃。',
    advantages: ['粉丝活跃度高', '内容质量优', '响应速度快', '美食领域专业度高'],
    restrictions: ['禁止发布违法内容', '禁止更改账号设置', '禁止删除原有内容'],
    isVerified: true,
    rating: 4.8,
    rentalCount: 120,
    availableCount: 1,
    publishTime: '2023-06-15T09:30:00Z',
    status: 'active',
    images: ['/images/1758380776810_96.jpg', '/images/1758380782226_96.jpg'],
    publisherName: '美食达人'
  };
};

const AccountDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams?.get('id') || '';
  
  const [account, setAccount] = useState<AccountRentalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取账号详情
  useEffect(() => {
    const loadAccountDetail = async () => {
      if (!accountId) {
        setError('账号ID不存在');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchAccountDetail(accountId);
        setAccount(data);
      } catch (err) {
        setError('获取账号详情失败');
        console.error('获取账号详情失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAccountDetail();
  }, [accountId]);
  
  // 处理返回
  const handleBack = () => {
    router.back();
  };
  
  // 处理立即租用
  const handleRentNow = () => {
    // 触发父页面的支付模态框显示
    // 这里通过URL参数传递，实际项目中可以使用状态管理或事件总线
    router.push(`/accountrental/account-rental-market?rentId=${accountId}&showPayment=true`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }
  
  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{error || '账号不存在'}</h3>
          <Button 
            onClick={handleBack} 
            className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
          >
            返回市场
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <Button 
          onClick={handleBack} 
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          ← 返回市场
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 账号标题区域 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 账号图片 */}
            <div className="w-full md:w-1/3">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {account.images && account.images.length > 0 ? (
                  <img 
                    src={account.images[0]} 
                    alt={account.description} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${utils.getPlatformColor(account.platform)} flex items-center justify-center`}>
                    {getPlatformIcon(account.platform)}
                  </div>
                )}
              </div>
              
              {/* 其他图片缩略图 */}
              {account.images && account.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {account.images.slice(1).map((img, index) => (
                    <div key={index} className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img src={img} alt={`图片${index + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 账号信息 */}
            <div className="w-full md:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{account.accountTitle}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                  {utils.getPlatformName(account.platform)}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">粉丝数量：</span>
                  <span className="font-medium">{account.followersRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">互动率：</span>
                  <span className="font-medium">{account.engagementRate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">账号年龄：</span>
                  <span className="font-medium">{utils.getAccountAgeName(account.accountAge)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">账号评分：</span>
                  <span className="font-medium text-blue-600">{account.accountScore}分</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">已出租次数：</span>
                  <span className="font-medium">{account.rentalCount || 0}次</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">租金：</div>
                  <div className="text-2xl font-bold text-red-600">¥{account.price.toFixed(2)}/天</div>
                </div>
                
                <Button 
                  onClick={handleRentNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md active:scale-95 transition-all"
                >
                  立即租用
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 账号详情 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">账号详情</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{account.description}</p>
          </div>
        </div>
        
        {/* 账号优势 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">账号优势</h2>
          <ul className="space-y-2">
            {account.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 租赁说明 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">租赁说明</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">基本信息</h3>
            <div className="space-y-2 text-gray-700">
              <div>• 出租时长：{account.rentalDuration}天</div>
              <div>• 最短租用时间：{account.minimumRentalHours}小时</div>
              <div>• 最大并发使用人数：{account.maxConcurrentUsers}人</div>
              <div>• 响应时间：{account.responseTime}分钟内</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">包含功能</h3>
            <div className="space-y-2">
              {account.includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">使用限制</h3>
            <div className="space-y-2">
              {account.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{restriction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 风险提示 */}
        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="font-medium text-red-900 mb-2">风险提示</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                请在租用前仔细阅读账号详情和租赁条款。租用期间请注意遵守平台规则，避免发布违规内容。
                如因违规使用导致账号被封禁或其他损失，由租用方自行承担责任。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailPage;