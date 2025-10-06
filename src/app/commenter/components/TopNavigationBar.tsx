import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '../../../components/button/ReturnToPreviousPage';
import { UserOutlined } from '@ant-design/icons';
import { commonLogout } from '@/auth/common';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';
import { useState } from 'react';

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
    <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BackButton className="text-white hover:bg-blue-600" />
        <div className="flex items-center space-x-1">
        </div>
      </div>
      <div className="flex items-center space-x-3">
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