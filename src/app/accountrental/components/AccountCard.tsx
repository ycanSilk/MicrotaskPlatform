import React from 'react';
import { Button } from '@/components/ui/Button';
import { AccountRentalInfo } from '../types';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';

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
  account: AccountRentalInfo;
  onAccountClick: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onAccountClick }) => {
  // 获取第一张图片
  const firstImage = account.images && account.images.length > 0 ? account.images[0] : null;
  
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
      {/* 图片展示区域 - 只显示第一张图片 */}
      <div className="w-full mb-4">
        <div className="relative">
          <div className="h-48 bg-gray-100">
            {/* 短视频账号封面 */}
            {firstImage ? (
              <img 
                src={firstImage}
                alt={account.description || '账号图片'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${utils.getPlatformColor(account.platform)} flex items-center justify-center text-6xl`}>
                {getPlatformIcon(account.platform)}
              </div>
            )}
          </div>
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs">
            {utils.getPlatformName(account.platform)}
          </div>
          {/* 用户标记 - 如果是当前用户(ID=3)发布的账号，显示标记 */}
          {account.userId === '3' && (
            <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              我的账号
            </div>
          )}
        </div>
      </div>

      {/* 标题区域 - 显示账号信息描述，最多显示两行 */}
      <div className="mb-3">
        <div className="mb-1 text-sm line-clamp-2">{account.description || account.accountTitle}</div>

        {/* 发布时间显示 */}
        {account.publishTime && (
            <div className="text-sm  mb-1">
              发布时间：{new Date(account.publishTime).toLocaleString('zh-CN')}
            </div>
          )}
          
          {account.publisherName && (
            <div className="text-sm text-gray-600 mb-1">
              发布用户：{account.publisherName}
            </div>
          )}
          
          {account.rentalDuration && (
            <div className="text-sm mb-1">
              出租时长：{account.rentalDuration}天
            </div>
          )}

        {/* 租金时长展示 */}
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-red-600">
            ¥{account.price.toFixed(2)}元/天
          </div>
        </div>
        </div>
      </div>
  );
};

export default AccountCard;