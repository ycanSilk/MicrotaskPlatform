import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackButton } from './BackButton';

interface PublisherHeaderProps {
  user: {
    id: string;
    username?: string;
    name?: string;
    role: string;
    balance: number;
    status?: string;
    createdAt?: string;
  };
}

export const PublisherHeader: React.FC<PublisherHeaderProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log('Logging out user');
    try {
      // 在实际应用中，这里会调用认证相关的方法来清除登录状态
      // PublisherAuthStorage.clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/auth/login/publisherlogin');
    }
  };

  // 返回按钮的显示逻辑已移至BackButton组件中

  return (
    <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <BackButton />
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">¥{user?.balance?.toFixed(2)}</span>
     
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <span className="text-yellow-400">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">2</span>
        </div>
        <button onClick={handleLogout} className="text-sm">👤</button>
      </div>
    </div>
  );
};