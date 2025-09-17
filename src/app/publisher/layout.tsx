'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthStorage } from '@/lib/auth'; // 使用完整的认证系统
import Link from 'next/link';

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true; // 防止组件卸载后的状态更新
    
    // 延迟检查用户状态以确保 localStorage 已经加载
    const checkUser = () => {
      if (!isMounted) return;
      
      try {
        console.log('Checking user authentication...');
        const authSession = AuthStorage.getAuth();
        console.log('Auth session from storage:', authSession);
        console.log('Publisher Layout: Current user:', authSession?.user); // 调试信息
        
        if (!authSession || !authSession.user) {
          console.log('Publisher Layout: No user found, redirecting to login'); // 调试信息
          // 检查localStorage中是否有数据
          const token = localStorage.getItem('auth_token');
          const userInfo = localStorage.getItem('user_info');
          console.log('Direct localStorage check - token:', token, 'user:', userInfo);
          
          if (isMounted) {
            router.push('/auth/login/publisherlogin');
          }
          return;
        }
        
        console.log('User role:', authSession.user.role);
        if (authSession.user.role !== 'publisher') {
          console.log('Publisher Layout: Wrong role, redirecting to login. Role:', authSession.user.role); // 调试信息
          if (isMounted) {
            router.push('/auth/login/publisherlogin');
          }
          return;
        }
        
        console.log('Publisher Layout: User authorized, setting user data'); // 调试信息
        if (isMounted) {
          setUser(authSession.user);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Publisher Layout: Error checking user:', error);
        if (isMounted) {
          router.push('/auth/login/publisherlogin');
        }
      }
    };
    
    // 立即检查一次
    checkUser();
    
    // 设置重试机制，在一定时间后再次检查
    const retryTimer = setTimeout(() => {
      checkUser();
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(retryTimer);
    };
  }, [router]); // 只依赖router，避免无限循环

  const handleLogout = () => {
    console.log('Logging out user');
    AuthStorage.clearAuth();
    router.push('/auth/login/publisherlogin');
  };

  // 获取当前页面标题
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return '任务管理';
    if (pathname.includes('/create')) return '发布任务';
    if (pathname.includes('/stats')) return '数据统计';
    if (pathname.includes('/finance')) return '充值提现';
    if (pathname.includes('/profile')) return '个人中心';
    return '派单员中心';
  };

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  if (isLoading) {
    console.log('Layout is loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <div>加载中...</div>
          <div className="text-xs text-gray-500 mt-2">
            检查用户权限中，请稍候...
          </div>
        </div>
      </div>
    );
  }

  // 如果没有用户数据，显示请登录提示
  if (!user) {
    console.log('No user data, showing login prompt');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-lg font-medium text-gray-800 mb-2">请登录</div>
          <div className="text-sm text-gray-600 mb-4">
            您需要以派单员身份登录才能访问此页面
          </div>
          <button 
            onClick={() => router.push('/auth/login/publisherlogin')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering layout with user:', user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部余额栏 */}
      <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">¥{user?.balance?.toFixed(2)}</span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">💎</span>
            <span className="text-sm">派单中</span>
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

      {/* 页面标题 */}
      <div className="bg-white px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800">
          {getPageTitle()}
        </h2>
      </div>

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-5 py-2">
          <Link
            href="/publisher/dashboard"
            className={`flex flex-col items-center py-2 ${
              isActive('/dashboard') ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">📋</span>
            <span className="text-xs">管理</span>
          </Link>
          <Link
            href="/publisher/create"
            className={`flex flex-col items-center py-2 ${
              isActive('/create') ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">➕</span>
            <span className="text-xs">发布</span>
          </Link>
          <Link
            href="/publisher/stats"
            className={`flex flex-col items-center py-2 ${
              isActive('/stats') ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-xs">统计</span>
          </Link>
          <Link
            href="/publisher/finance"
            className={`flex flex-col items-center py-2 ${
              isActive('/finance') ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">💰</span>
            <span className="text-xs">财务</span>
          </Link>
          <Link
            href="/publisher/profile"
            className={`flex flex-col items-center py-2 ${
              isActive('/profile') ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">👤</span>
            <span className="text-xs">我的</span>
          </Link>
        </div>
      </div>
    </div>
  );
}