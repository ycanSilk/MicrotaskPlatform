'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SimpleStorage, SimpleUser } from '@/lib/simple-auth';
import Link from 'next/link';

export default function AdminLayout({
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
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login/adminlogin');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    SimpleStorage.clearUser();
    router.push('/auth/login/adminlogin');
  };

  // 获取当前页面标题
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return '数据总览';
    if (pathname.includes('/users')) return '用户管理';
    if (pathname.includes('/finance')) return '财务管理';
    if (pathname.includes('/settings')) return '系统设置';
    return '管理员中心';
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
      {/* 顶部管理栏 */}
      <div className="bg-purple-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">管理员</span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⚙️</span>
            <span className="text-sm">系统正常</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-yellow-400">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">5</span>
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
        <div className="grid grid-cols-4 py-2">
          <Link
            href="/admin/dashboard"
            className={`flex flex-col items-center py-2 ${
              isActive('/dashboard') ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-xs">总览</span>
          </Link>
          <Link
            href="/admin/users"
            className={`flex flex-col items-center py-2 ${
              isActive('/users') ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">👥</span>
            <span className="text-xs">用户</span>
          </Link>

          <Link
            href="/admin/finance"
            className={`flex flex-col items-center py-2 ${
              isActive('/finance') ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">💰</span>
            <span className="text-xs">财务</span>
          </Link>
          <Link
            href="/admin/settings"
            className={`flex flex-col items-center py-2 ${
              isActive('/settings') ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-xs">设置</span>
          </Link>
        </div>
      </div>
    </div>
  );
}