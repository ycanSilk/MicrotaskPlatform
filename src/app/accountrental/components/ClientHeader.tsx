'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname,useRouter, useSearchParams } from 'next/navigation';
import { BackButton } from '../../../components/button/ReturnToPreviousPage';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';
import { UserOutlined } from '@ant-design/icons';

interface User {
  id: string;
  username?: string;
  name?: string;
  role: string;
  balance: number;
  status?: string;
  createdAt?: string;
}

interface ClientHeaderProps {
  user?: User | null;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showUserName, setShowUserName] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pageTitle, setPageTitle] = useState('账户租赁');
  const headerRef = useRef<HTMLDivElement>(null);

  // 定义路由到标题的映射关系
  const routeTitleMap: Record<string, string> = {
    '/accountrental': '账户租赁',
    '/accountrental/account-rental-market': '出租市场',
    '/accountrental/account-rental-requests': '求租市场',
    '/accountrental/account-rental-publish': '发布租赁',
    '/accountrental/my-account-rental': '我的租赁',
    '/accountrental/account-rental-market/market-detail': '出租账号详情',
    '/accountrental/account-rental-requests/request-detail': '求租信息详情',
    '/accountrental/account-rental-publish/publish-for-rent': '发布出租信息',
    '/accountrental/account-rental-publish/publish-requests': '发布求租信息',
    '/accountrental/my-account-rental/forrentorder': '出租订单',
    '/accountrental/my-account-rental/rentalorder': '租用订单',
    '/accountrental/my-account-rental/rentaloffer': '出租信息',
    '/accountrental/my-account-rental/rentalrequest': '求租信息',
    '/accountrental/my-account-rental/rentalrequest/rentalrequest-detail/[id]': '求租信息详情',
    '/accountrental/my-account-rental/rentaloffer/rentaloffer-detail/[id]': '出租信息详情',
    '/accountrental/my-account-rental/forrentorder/forrentorder-detail/[id]': '出租订单详情',
    '/accountrental/my-account-rental/rentalorder/rentalorder-detail/[id]': '租用订单详情'
  };

  useEffect(() => {
    setIsClient(true);
    
    // 在客户端计算页面标题
    if (pathname) {
      // 尝试精确匹配
      if (routeTitleMap[pathname]) {
        setPageTitle(routeTitleMap[pathname]);
        return;
      }

      // 尝试匹配路径前缀（移除查询参数后的路径）
      const pathWithoutQuery = pathname.split('?')[0];
      if (routeTitleMap[pathWithoutQuery]) {
        setPageTitle(routeTitleMap[pathWithoutQuery]);
        return;
      }

      // 尝试匹配包含特定路径段的路由
      for (const [route, title] of Object.entries(routeTitleMap)) {
        if (pathWithoutQuery.includes(route)) {
          setPageTitle(title);
          return;
        }
      }
    }
  }, [pathname]);

  const handleDashboardClick = () => {
    // 获取 URL 中的 from 参数 - 安全处理可能为 null 的情况
    const fromSource = searchParams?.get('from');
    
    console.log('来源参数:', fromSource); // 调试信息
    
    // 优先根据来源参数决定跳转目标
    if (fromSource === 'commenter-hall') {
      // 来自接单模块，返回接单模块
      router.push('/commenter/hall');
    } else if (fromSource === 'publisher-dashboard') {
      // 来自派单模块，返回派单模块
      router.push('/publisher/dashboard');
    } else if (user?.role === 'commenter') {
      // 评论员角色跳转到接单模块
      router.push('/commenter/hall');
    } else if (user?.role === 'publisher') {
      // 发布者角色跳转到派单模块
      router.push('/publisher/dashboard');
    } else {
      // 默认跳转到首页
      router.push('/');
    }
  };

  const handleUserAvatarClick = () => {
    setShowUserName(!showUserName);
  };

  return (
    <div ref={headerRef} className="bg-[#008cffff] border-b border-[#9bcfffff] px-4 py-3 flex items-center justify-between h-[60px] box-border">
      <div className="flex items-center flex-1">
        {isClient && <BackButton className="text-white" />}
        <h1 className="text-md text-white ml-1">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center relative">
        {isClient && (
          <CustomerServiceButton 
            buttonText="联系客服" 
            modalTitle="在线客服" 
            userId={user?.id || 'guest'} 
            className="text-white mr-1 font-bold text-lg"
          />
        )}
        
        {isClient && user && user.username && (
            <div className="relative mr-1">
              <button
                onClick={handleUserAvatarClick}
                onMouseEnter={() => setShowUserName(true)}
                onMouseLeave={() => {
                  setTimeout(() => setShowUserName(false), 300);
                }}
                className="w-[36px] h-[36px] cursor-pointer flex items-center justify-center text-lg text-white transition-all duration-300 ease"
                aria-label="用户信息"
              >
                <UserOutlined />
              </button>
              {showUserName && (
                <div
                  className="absolute top-[44px] right-0 bg-white border border-[#e8e8e8] rounded-md p-2 shadow-lg z-50 min-w-[120px] text-center"
                >
                  <span className="text-sm">
                    {user.username}
                  </span>
                </div>
              )}
            </div>
          )}
        <button
          onClick={handleDashboardClick}
          className="text-sm cursor-pointer text-white transition-all duration-300 ease"
        >
          退出
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;