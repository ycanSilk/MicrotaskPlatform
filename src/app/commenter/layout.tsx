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
    const initializeAuth = async () => {
      // 确保在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        console.log('初始化评论员认证');
        console.log('当前路径:', pathname);
        
        // 如果已经在登录页面或invite页面，不执行认证检查
      if (pathname?.includes('/auth/login/commenterlogin') || pathname?.includes('/commenter/invite')) {
        console.log('已在登录页面或invite页面，跳过认证检查');
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