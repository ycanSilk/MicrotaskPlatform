import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '../../../components/button/ReturnToPreviousPage';
import { UserOutlined } from '@ant-design/icons';
import { commonLogout } from '@/auth/common';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';
import { useState } from 'react';
import SearchBar from '../../../components/button/SearchBar';

interface TopNavigationBarProps {
  user: any | null;
}

export default function TopNavigationBar({ user }: TopNavigationBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    commonLogout();
    router.push('/auth/login/commenterlogin');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <BackButton className="text-white hover:bg-blue-600" />
        <div className="flex items-center space-x-1">
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <SearchBar 
          placeholder="搜索任务、订单" 
          customModules={[
            {
              keywords: ['任务', '抢单', '订单', 'hall'],
              urlPath: '/commenter/hall',
              exactMatch: false
            },
            {
              keywords: ['我的任务', '任务列表', '进行中'],
              urlPath: '/commenter/tasks',
              exactMatch: false
            },
            {
              keywords: ['余额', '提现', '收入'],
              urlPath: '/commenter/account',
              exactMatch: false
            }
          ]}
        />
        <CustomerServiceButton 
          buttonText="联系客服" 
          modalTitle="在线客服"
          userId={user?.id || 'guest'}
          className="text-white"
        />
        <button onClick={handleLogout} className="text-sm">
          <UserOutlined />
        </button>
      </div>
    </div>
  );
}