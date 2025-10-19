'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RightOutlined from '@ant-design/icons/RightOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import StarOutlined from '@ant-design/icons/StarOutlined';

// 定义菜单项接口
interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  path?: string;
}

const MyAccountRentalPage = () => {
  const router = useRouter();

  // 所有菜单项列表 - 更新为四个按钮
  const menuItems: MenuItem[] = [
    {
      id: 'rental-orders',
      title: '出租订单',
      icon: <ShopOutlined className="text-xl" />,
      color: 'bg-blue-100',
      path: '/accountrental/my-account-rental/forrentorder'
    },
    {
      id: 'lease-orders',
      title: '租用订单',
      icon: <WalletOutlined className="text-xl" />,
      color: 'bg-green-100',
      path: '/accountrental/my-account-rental/rentalorder'
    },
    {
      id: 'rental-info',
      title: '出租信息',
      icon: <FileTextOutlined className="text-xl" />,
      color: 'bg-purple-100',
      path: '/accountrental/my-account-rental/rentaloffer'
    },
    {
      id: 'lease-info',
      title: '求租信息',
      icon: <StarOutlined className="text-xl" />,
      color: 'bg-amber-100',
      path: '/accountrental/my-account-rental/rentalrequest'
    }
  ];

  // 处理菜单项点击
  const handleMenuItemClick = (path?: string) => {
    if (path) {
      router.push(path as any);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 功能菜单列表 */}
      <div className="mb-5">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuItemClick(item.path)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  // 增大移动端触摸区域
                  minHeight: '60px',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-xl`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                <div className="text-gray-400">
                  <RightOutlined className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountRentalPage;