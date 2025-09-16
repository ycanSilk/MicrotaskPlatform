'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SimpleStorage, SimpleUser } from '@/lib/simple-auth';
import Link from 'next/link';

export default function CommenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = SimpleStorage.getUser();
    if (!currentUser || currentUser.role !== 'commenter') {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    SimpleStorage.clearUser();
    router.push('/auth/login');
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
        <div className="grid grid-cols-5 py-2">
          <Link
            href="/commenter/hall"
            className={`flex flex-col items-center py-2 ${
              isActive('/hall') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-xs">大厅</span>
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