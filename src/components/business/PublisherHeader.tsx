import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackButton } from './BackButton';
import { SearchBox } from '../ui/SearchBox';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { CustomerServiceButton } from '../button/CustomerServiceButton';

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

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // 在实际应用中，这里会实现搜索逻辑
  };

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BackButton />
          <button 
              onClick={() => router.push('/publisher/dashboard')} 
              className="text-lg font-bold text-black hover:text-blue-300 transition-colors"
              aria-label="返回首页"
            >
              <HomeOutlined size={20} />
            </button>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <SearchBox 
            placeholder="搜索任务、用户或关键词"
            onSearch={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-3 mr-5">
            {/* 使用通用客服按钮组件 */}
            <CustomerServiceButton />
            
            <button onClick={handleLogout} className="text-sm">
              <UserOutlined size={20} /><span className="ml-1">登出</span>
            </button>
          </div>
      </div>
    </>
  );
};