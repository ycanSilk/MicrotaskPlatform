'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { AudioOutlined, BookOutlined, ToolOutlined, RightOutlined, BulbOutlined } from '@ant-design/icons';

// 定义平台类型接口
interface Platform {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  accountCount: number;
  color: string;
}

// 平台类型配置
const PLATFORMS: Platform[] = [
  {
    id: 'douyin',
    title: '抖音',
    icon: <AudioOutlined className="text-3xl" />,
    description: '租用活跃抖音账号进行品牌推广和内容传播',
    accountCount: 1000,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'xiaohongshu',
    title: '小红书',
    icon: <BookOutlined className="text-3xl" />,
    description: '租用高质量小红书账号发布种草笔记和产品推荐',
    accountCount: 800,
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 'kuaishou',
    title: '快手',
    icon: <ToolOutlined className="text-3xl" />,
    description: '租用快手账号进行产品宣传和用户互动',
    accountCount: 600,
    color: 'from-blue-500 to-teal-400'
  }
];

// 平台卡片组件
const PlatformCard = ({ platform, onClick }: { platform: Platform, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      {/* 平台头部 */}
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center text-3xl`}>
          {platform.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-xl">{platform.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-500 text-sm">{platform.accountCount}+ 活跃账号</span>
          </div>
        </div>
      </div>

      {/* 平台描述 */}
      <div className="mb-4">
        <p className="text-gray-700">{platform.description}</p>
      </div>

      {/* 进入按钮 */}
      <div className="flex items-center justify-end">
        <div className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2">
          <span>继续</span>
          <RightOutlined />
        </div>
      </div>
    </div>
  );
}

export default function AccountRentalPlatformSelection() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlatformClick = (platform: Platform) => {
    if (platform.id === 'douyin') {
      // 抖音平台跳转到platformtype页面
      router.push('/accountrental/account-rental-publish/platformtype');
    } else {
      // 小红书和快手平台显示模态框
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 平台卡片列表 */}
      <div className="px-4 space-y-4">
        {PLATFORMS.map((platform) => (
          <PlatformCard 
            key={platform.id} 
            platform={platform} 
            onClick={() => handlePlatformClick(platform)}
          />
        ))}
      </div>

      {/* 提示信息 */}
      <div className="px-4">
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl"><BulbOutlined /></span>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">账号租用说明</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                请选择您需要租用账号的平台，目前支持抖音、小红书、快手等主流社交媒体平台。选择平台后，您将进入该平台的账号类型选择页面，可以选择具体的账号类型进行租用。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能暂未开放提示模态框 */}
      <AlertModal 
        isOpen={isModalOpen} 
        icon={<ToolOutlined />} 
        title="功能暂未开放" 
        message="该功能暂未开放，无法使用" 
        onClose={closeModal} 
      />
    </div>
  );
}