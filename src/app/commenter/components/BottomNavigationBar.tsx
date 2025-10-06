import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeOutlined, FileTextOutlined, DollarOutlined, PropertySafetyOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';

interface BottomNavigationBarProps {
  // 可以添加需要的props
}

export default function BottomNavigationBar({}: BottomNavigationBarProps) {
  const pathname = usePathname();

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return pathname?.includes(path) ?? false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="grid grid-cols-6 py-2">
        <Link
          href="/commenter/hall"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/hall') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <HomeOutlined />
          </span>
          <span className={`text-xs ${isActive('/hall') ? 'text-blue-500' : 'text-gray-500'}`}>抢单大厅</span>
        </Link>
        <Link
          href="/commenter/tasks"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/tasks') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <FileTextOutlined />
          </span>
          <span className={`text-xs ${isActive('/tasks') ? 'text-blue-500' : 'text-gray-500'}`}>任务</span>
        </Link>
        <Link
          href="/commenter/earnings"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/earnings') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <DollarOutlined />
          </span>
          <span className={`text-xs ${isActive('/earnings') ? 'text-blue-500' : 'text-gray-500'}`}>收益</span>
        </Link>
        <Link
          href="/accountrental/account-rental-market?from=commenter-hall"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/accountrental') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <PropertySafetyOutlined />
          </span>
          <span className={`text-xs ${isActive('/accountrental') ? 'text-blue-500' : 'text-gray-500'}`}>账号租赁</span>
        </Link>
        <Link
          href="/commenter/invite"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/invite') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <UserAddOutlined />
          </span>
          <span className={`text-xs ${isActive('/invite') ? 'text-blue-500' : 'text-gray-500'}`}>邀请</span>
        </Link>
        <Link
          href="/commenter/profile"
          className="flex flex-col items-center py-2"
        >
          <span className={`text-lg w-10 h-10 flex items-center justify-center rounded-full mb-1 ${isActive('/profile') ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>
            <UserOutlined />
          </span>
          <span className={`text-xs ${isActive('/profile') ? 'text-blue-500' : 'text-gray-500'}`}>我的</span>
        </Link>
      </div>
    </div>
  );
}