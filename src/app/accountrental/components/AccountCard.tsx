import React from 'react';
import { Button } from '@/components/ui/Button';
import { AccountRentalInfo } from '../types';
import { AudioOutlined, BookOutlined, ToolOutlined } from '@ant-design/icons';

// 根据平台获取对应图标
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'douyin':
      return <AudioOutlined className="text-6xl" />
    case 'xiaohongshu':
      return <BookOutlined className="text-6xl" />
    case 'kuaishou':
      return <ToolOutlined className="text-6xl" />
    default:
      return <BookOutlined className="text-6xl" />
  }
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
  
  // 获取分类名称
  getCategoryName: (category: string): string => {
    const categoryMap: Record<string, string> = {
      food: '美食',
      travel: '旅游',
      fashion: '时尚',
      beauty: '美妆',
      fitness: '健身',
      technology: '科技',
      finance: '财经',
      education: '教育',
      entertainment: '娱乐',
      sports: '体育'
    };
    return categoryMap[category] || category;
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

// 定义账号卡片属性接口
interface AccountCardProps {
  account: {
    id: string;
    platform: string;
    platformIcon: React.ReactNode;
    accountTitle: string;
    followersRange: string;
    engagementRate: string;
    contentCategory: string;
    region: string;
    accountAge: string;
    accountScore: number;
    price: number;
    rentalDuration: number;
    minimumRentalHours: number;
    deliveryTime: number;
    maxConcurrentUsers?: number;
    responseTime: number;
    includedFeatures: string[];
    description: string;
    advantages: string[];
    restrictions: string[];
    isVerified?: boolean;
    rating?: number;
    rentalCount?: number;
    availableCount?: number;
    publishTime?: string;
    status: 'active' | 'inactive' | 'pending';
  };
  onAccountClick: (accountId: string) => void;
  onRentNow: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onAccountClick, onRentNow }) => {
  return (
    <div 
      key={account.id}
      onClick={() => onAccountClick(account.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer overflow-hidden p-4"
      style={{
        // 移动端适配 - 增大点击区域
        touchAction: 'auto',
        // 优化移动端触摸反馈
        transition: 'all 0.2s ease'
      }}
    >
      {/* 平台图标和图片区域 - 顶部 */}
      <div className="w-full mb-4">
        <div className="relative">
          <div className="h-48 bg-gray-100">
            {/* 短视频账号封面 */}
            <div className={`w-full h-full ${utils.getPlatformColor(account.platform)} flex items-center justify-center text-6xl`}>
              {getPlatformIcon(account.platform)}
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {utils.getPlatformName(account.platform)}
          </div>
        </div>
      </div>

      {/* 标题区域 */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1">{account.accountTitle}</h3>
        
        {/* 账号详细信息 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
            {utils.getCategoryName(account.contentCategory)}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
            {account.followersRange}
          </span>
          <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs">
            免押金
          </span>
        </div>

        {/* 详细属性信息 - 优化移动端显示 */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500 mb-1 text-xs">账号评分</div>
            <div className="font-medium">{account.accountScore}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1 text-xs">账号年龄</div>
            <div className="font-medium">{utils.getAccountAgeName(account.accountAge)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1 text-xs">响应时间</div>
            <div className="font-medium">{account.responseTime}分钟</div>
          </div>
        </div>

        {/* 租金时长展示 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
              2小时起租
            </div>
            <div className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-xs">
              租5送1
            </div>
          </div>
          <div className="text-xl font-bold text-red-600">
            ¥{account.price.toFixed(2)}元/时
          </div>
        </div>

        {/* 租用按钮 - 使用新的方式处理点击事件，避免stopPropagation问题 */}
          <Button
            onClick={() => onRentNow(account.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium shadow-md active:scale-95 transition-all min-h-12"
          >
            立即租用
          </Button>
        </div>
      </div>
  );
};

export default AccountCard;