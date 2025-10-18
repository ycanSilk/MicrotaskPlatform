'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentLoggedInUser, commonLogout } from '@/auth/common';
import Link from 'next/link';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import AlertModal from '../../components/ui/AlertModal';
import { BackButton } from '../../components/button/ReturnToPreviousPage';
import { ReloadOutlined, UserOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, PropertySafetyOutlined, UserAddOutlined, WarningOutlined } from '@ant-design/icons';
import TopNavigationBar from './components/TopNavigationBar';
import BottomNavigationBar from './components/BottomNavigationBar';

export default function CommenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 显示功能暂未开放提示
  const showNotAvailableAlert = () => {
    setShowAlertModal(true);
  };

  useEffect(() => {
    // 完全移除登录验证逻辑
    // 对于任务详情页面，直接设置isLoading为false，允许页面显示
    if (pathname?.includes('/commenter/task-detail')) {
      console.log('任务详情页面，跳过所有认证检查，直接加载');
      setIsLoading(false);
      return;
    }
    
    // 对于其他页面，保留简化的认证流程
    const initializeAuth = async () => {
      // 确保在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        console.log('初始化评论员界面');
        
        // 尝试获取用户信息，但不强制要求
        const auth = CommenterAuthStorage.getAuth();
        if (auth && auth.user && auth.user.role === 'commenter') {
          setUser(auth.user);
        } else {
          // 尝试获取通用登录用户
          const currentUser = getCurrentLoggedInUser();
          if (currentUser && currentUser.role === 'commenter') {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('初始化界面出错:', error);
      } finally {
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
    if (pathname?.includes('/hall') ?? false) return '任务大厅';
    if (pathname?.includes('/tasks') ?? false) return '我的任务';
    if (pathname?.includes('/earnings') ?? false) return '收益中心';
    if (pathname?.includes('/invite') ?? false) return '邀请好友';
    if (pathname?.includes('/profile') ?? false) return '个人中心';
    return '评论员中心';
  };

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return pathname?.includes(path) ?? false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部余额栏 */}
      <TopNavigationBar user={user} />

      {/* 页面标题 */}
      <div className="bg-white px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800">
          {getPageTitle()}
        </h2>
      </div>

      {/* 主要内容区域 - 添加底部内边距避免被底部导航栏遮挡 */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* 底部导航栏 */}
      <BottomNavigationBar />

    </div>
  );
}