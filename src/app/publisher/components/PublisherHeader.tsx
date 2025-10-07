import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackButton } from '../../../components/button/ReturnToPreviousPage';
import SearchBar from '../../../components/button/SearchBar';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';

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

  // 搜索逻辑已集成在SearchBar组件内部，无需额外处理

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BackButton />
        </div>
        
       
        
        <div className="flex items-center">
            <div className="flex-1 max-w-md mr-1 text-lg">
                <SearchBar 
                  placeholder="搜索任务、用户或关键词"
                  customModules={[
                    {
                      keywords: ['任务', '发布', '完成', '进行中'],
                      urlPath: '/publisher/tasks',
                      exactMatch: false
                    },
                    {
                      keywords: ['订单', '交易', '历史'],
                      urlPath: '/publisher/orders',
                      exactMatch: false
                    },
                    {
                      keywords: ['余额', '账户', '资金'],
                      urlPath: '/publisher/account',
                      exactMatch: false
                    },
                    {
                      keywords: ['银行卡', '支付', '提现'],
                      urlPath: '/publisher/bankcards',
                      exactMatch: false
                    }
                  ]}
                />
            </div>  
            <CustomerServiceButton className="font-bold text-xl mr-3" />
            <button onClick={handleLogout} className="text-lg">
              <span className="ml-1">登出</span>
            </button>
          </div>
      </div>
    </>
  );
};