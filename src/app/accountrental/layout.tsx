'use client';
import React, { memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from './components/Header';

const AccountRentalLayout = memo(({ children }: { children: React.ReactNode }) => {
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
  const isMarketActive = pathname.includes('account-rental-market');
  const isPublishActive = pathname.includes('account-rental-publish');
  const isMyActive = pathname.includes('my-account-rental');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部区域 - 使用Header组件 */}
      <Header />

      {/* 主内容区域 */}
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      {/* 底部导航栏 */}
      <footer className="h-[56px] bg-white border-t border-gray-200 flex justify-around items-center">
        <button 
          onClick={handleMarketClick}
          className="flex flex-col items-center"
        >
          <span className="text-xl">🏪</span>
          <span className={`text-xs mt-1 ${isMarketActive ? 'text-blue-600' : 'text-gray-500'}`}>租赁市场</span>
        </button>
        <button 
          onClick={handlePublishClick}
          className="flex flex-col items-center"
        >
          <span className="text-xl">📝</span>
          <span className={`text-xs mt-1 ${isPublishActive ? 'text-blue-600' : 'text-gray-500'}`}>发布租赁</span>
        </button>
        <button 
          onClick={handleMyClick}
          className="flex flex-col items-center"
        >
          <span className="text-xl">👤</span>
          <span className={`text-xs mt-1 ${isMyActive ? 'text-blue-600' : 'text-gray-500'}`}>我的</span>
        </button>
      </footer>
    </div>
  );
});

export default AccountRentalLayout;