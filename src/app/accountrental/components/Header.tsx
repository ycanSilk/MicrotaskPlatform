'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BackButton } from '@/components/button/ReturnToPreviousPage';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import SearchBar from '@/components/button/SearchBar';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';

import { User } from '@/types';

interface HeaderProps {
  // 可以添加需要的props
  customBackHandler?: () => void;
  user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ customBackHandler, user }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  
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

  // 账号租赁相关的搜索模块配置
  const accountRentalModules = [
    {
      keywords: ['账号租赁', '账号', '租赁', '平台账号'],
      urlPath: '/accountrental/account-rental-market',
      moduleName: '账号租赁市场',
    },
    {
      keywords: ['订单', '账号订单'],
      urlPath: '/accountrental/orders',
      moduleName: '账号订单管理',
    },
    {
      keywords: ['我的账号', '账号管理'],
      urlPath: '/accountrental/my-accounts',
      moduleName: '我的账号',
    },
  ];

  return (
    <header className="h-[56px] bg-blue-500 flex items-center px-4 border-b border-gray-200 sticky top-0 z-10">
      {/* 使用公共 BackButton 组件，并传递自定义返回处理函数 */}
      <BackButton className="w-[36px] h-[36px] flex items-center justify-center" customBackHandler={customBackHandler} />

      {/* 使用公共搜索组件 */}
      <div className="flex-1 ml-3 flex justify-end">
        <SearchBar
          className="w-[40px] h-[40px]  rounded-full flex items-center justify-center"
          customModules={accountRentalModules}
        />
      </div>

      <div >
        <CustomerServiceButton className="font-bold text-white text-xl" />
      </div>

      {/* 用户信息显示 */}
      {user && (
        <div className="ml-2 text-white flex items-center">
          <div className="text-sm font-medium mr-2">
            用户{user.id}
          </div>
        </div>
      )}

      {/* 退出账号租赁系统按钮 */}
      <button
        onClick={handleDashboardClick}
        className="ml-1 px-3 py-1.5 bg-transparent border-none cursor-pointer text-white rounded-full transition-colors hover:bg-blue-600 text-sm font-medium"
      >
        退出
      </button>
    </header>
  );
};

export default Header;