'use client';
import React, { memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from './components/Header';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

interface AccountRentalLayoutProps {
  children: React.ReactNode;
}

const AccountRentalLayout = memo(({ children }: AccountRentalLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarketClick = () => {
    router.push('/accountrental/account-rental-market');
  };

  const handlePublishClick = () => {
    router.push('/accountrental/account-rental-publish');
  };

  const handleMyClick = () => {
    router.push('/accountrental/my-account-rental');
  };

  // 确定当前激活的导航项
  const isMarketActive = pathname?.includes('account-rental-market') ?? false;
  const isPublishActive = pathname?.includes('account-rental-publish') ?? false;
  const isMyActive = pathname?.includes('my-account-rental') ?? false;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部区域 - 使用Header组件 */}
      <Header />

      {/* 主内容区域 */}
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      {/* 底部导航栏 */}
      <footer className="h-[56px] bg-white flex justify-around items-center border-t border-gray-300 py-3">
        <button 
          onClick={handleMarketClick}
          className="flex flex-col items-center"
        >
          <span className={`text-xl w-6 h-6 flex items-center justify-center rounded-full  ${isMarketActive ? ' text-blue-500' : 'text-gray-500'}`}>
            <ShopOutlined />
          </span>
          <span className={`text-xs ${isMarketActive ? 'text-blue-500' : 'text-gray-500'}`}>租赁市场</span>
        </button>
        <button 
          onClick={handlePublishClick}
          className="flex flex-col items-center"
        >
          <span className={`text-xl w-6 h-6 flex items-center justify-center rounded-full  ${isPublishActive ? ' text-blue-500' : 'text-gray-500'}`}>
            <FileTextOutlined />
          </span>
          <span className={`text-xs ${isPublishActive ? 'text-blue-500' : 'text-gray-500'}`}>发布租赁</span>
        </button>
        <button 
          onClick={handleMyClick}
          className="flex flex-col items-center"
        >
          <span className={`text-xl w-6 h-6 flex items-center justify-center rounded-full  ${isMyActive ? ' text-blue-500' : 'text-gray-500'}`}>
            <UserOutlined />
          </span>
          <span className={`text-xs ${isMyActive ? 'text-blue-500' : 'text-gray-500'}`}>我的</span>
        </button>
      </footer>
    </div>
  );
});

export default AccountRentalLayout;