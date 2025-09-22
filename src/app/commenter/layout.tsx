'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentLoggedInUser, commonLogout } from '@/auth/common';
import Link from 'next/link';
import { CommenterAuthStorage } from '@/auth/commenter/auth';

export default function CommenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      // 确保在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        console.log('初始化评论员认证');
        console.log('当前路径:', pathname);
        
        // 如果已经在登录页面，不执行认证检查
        if (pathname?.includes('/auth/login/commenterlogin')) {
          console.log('已在登录页面，跳过认证检查');
          setIsLoading(false);
          return;
        }

        // 获取评论员认证信息
        const auth = CommenterAuthStorage.getAuth();
        console.log('认证信息结果:', auth);
        console.log('认证信息完整检查 - auth存在:', !!auth, '用户存在:', !!auth?.user, '角色是commenter:', auth?.user?.role === 'commenter');
        
        if (auth && auth.user && auth.user.role === 'commenter') {
          // 有有效的评论员认证信息
          console.log('找到有效的评论员认证信息，用户ID:', auth.user.id, '用户名:', auth.user.username);
          setUser(auth.user);
          console.log('认证成功，设置用户状态完成，继续加载页面内容');
        } else {
          console.log('评论员认证信息不完整或无效，进入备用检查流程');
          // 尝试获取通用登录用户
          const currentUser = getCurrentLoggedInUser();
          console.log('通用登录用户:', currentUser);
          
          if (currentUser && currentUser.role === 'commenter') {
            console.log('找到有效的通用登录用户，用户ID:', currentUser.user.id);
            setUser(currentUser);
            console.log('备用认证成功，设置用户状态完成');
          } else {
            // 没有有效的认证信息，跳转到登录页面
            console.log('跳转前详细分析 - auth对象:', auth, 'currentUser对象:', currentUser, '当前路径:', pathname);
            console.log('无有效认证信息，准备跳转到登录页面');
            console.log('执行跳转动作: 从', pathname, '跳转到 /auth/login/commenterlogin');
            // 使用replace而不是push，避免回退到受保护页面
            setTimeout(() => {
              console.log('跳转定时器触发，正在执行window.location.href重定向');
              window.location.href = '/auth/login/commenterlogin';
            }, 100);
            return;
          }
        }
      } catch (error) {
        console.error('初始化认证出错:', error);
        console.log('错误详情:', error instanceof Error ? error.message : String(error));
        console.log('错误堆栈:', error instanceof Error ? error.stack : '未知');
        console.log('执行错误跳转: 从', pathname, '跳转到 /auth/login/commenterlogin');
        // 出错时跳转到登录页面
        setTimeout(() => {
          console.log('错误跳转定时器触发，正在执行window.location.href重定向');
          window.location.href = '/auth/login/commenterlogin';
        }, 100);
      } finally {
        console.log('认证流程结束，设置isLoading为false');
        setIsLoading(false);
      }
    };

    // 使用setTimeout确保在DOM加载完成后执行
    setTimeout(() => {
      initializeAuth();
    }, 100);
  }, [router, pathname]);

  const handleLogout = () => {
    commonLogout();
    router.push('/auth/login/commenterlogin');
  };

  // 获取当前页面标题
  const getPageTitle = () => {
    if (pathname.includes('/hall')) return '任务大厅';
    if (pathname.includes('/tasks')) return '我的任务';
    if (pathname.includes('/earnings')) return '收益中心';
    if (pathname.includes('/invite')) return '邀请好友';
    if (pathname.includes('/profile')) return '个人中心';
    return '评论员中心';
  };

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部余额栏 */}
      <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">¥{user?.balance?.toFixed(2)}</span>
          <div className="flex items-center space-x-1">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm">抓紧中</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-orange-400">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">3</span>
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
        <div className="grid grid-cols-6 py-2">
          <Link
            href="/commenter/hall"
            className={`flex flex-col items-center py-2 ${
              isActive('/hall') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-xs">抢单大厅</span>
          </Link>
          <Link
            href="/commenter/tasks"
            className={`flex flex-col items-center py-2 ${
              isActive('/tasks') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">📋</span>
            <span className="text-xs">任务</span>
          </Link>
          <Link
            href="/commenter/earnings"
            className={`flex flex-col items-center py-2 ${
              isActive('/earnings') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">💰</span>
            <span className="text-xs">收益</span>
          </Link>
          <Link
            href="/commenter/lease"
            className={`flex flex-col items-center py-2 ${
              isActive('/lease') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">🏢</span>
            <span className="text-xs">账号出租</span>
          </Link>
          <Link
            href="/commenter/invite"
            className={`flex flex-col items-center py-2 ${
              isActive('/invite') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">👥</span>
            <span className="text-xs">邀请</span>
          </Link>
          <Link
            href="/commenter/profile"
            className={`flex flex-col items-center py-2 ${
              isActive('/profile') ? 'text-blue-500' : 'text-gray-400'
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