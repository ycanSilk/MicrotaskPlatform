'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import CreditCardOutlined from '@ant-design/icons/CreditCardOutlined';
import StarOutlined from '@ant-design/icons/StarOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';

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
  const [balance, setBalance] = useState<number>(1280.50);

  // 用户信息
  const userInfo = {
    name: '张小明',
    imgurl: '/images/0e92a4599d02a7.jpg',
    accountNumber: 'ACC87654321',
    phoneNumber: '13800138000'
  };

  // 所有菜单项列表
  const menuItems: MenuItem[] = [
    {
      id: 'published-rent',
      title: '我发布的出租',
      icon: <ShopOutlined className="text-xl" />,
      color: 'bg-green-100',
      path: '/accountrental/my-account-rental/published-rent'
    },
    {
      id: 'published-request',
      title: '我发布的求租',
      icon: <StarOutlined className="text-xl" />,
      color: 'bg-indigo-100',
      path: '/accountrental/my-account-rental/published-request'
    },
    {
      id: 'my-rental',
      title: '我租赁的',
      icon: <WalletOutlined className="text-xl" />,
      color: 'bg-yellow-100',
      path: '/accountrental/my-account-rental/my-rental'
    },
    {
      id: 'help-center',
      title: '帮助中心',
      icon: <QuestionCircleOutlined className="text-xl" />,
      color: 'bg-red-100',
      path: '/accountrental/my-account-rental/help-center'
    }
  ];

  // 处理菜单项点击
  const handleMenuItemClick = (path?: string) => {
    if (path) {
      router.push(path as any);
    } else {
      console.log('菜单项被点击，但没有定义路径');
    }
  };

  // 处理提现
  const handleWithdraw = () => {
    console.log('提现功能');
    // 在实际项目中，这里应该跳转到提现页面
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部用户信息区域 */}
      <div className="bg-blue-500 text-white p-6 mb-5">
        <div 
          className="flex items-center justify-between space-x-4 mb-4 cursor-pointer hover:bg-blue-600 rounded-lg p-2 transition-colors"
          onClick={() => router.push('/accountrental/my-account-rental/information')}
        >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex ">
                <img src={userInfo.imgurl} alt={userInfo.name} className="w-full h-full overflow-hidden rounded-lg" />
              </div>
              <div>
                <span className="flex">{userInfo.name}</span>
                <span className="flex">{userInfo.phoneNumber}</span>
              </div>
            </div>
            <div className="text-white">
              <RightOutlined className="h-5 w-5" />
            </div>
          </div>
      </div>

     

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

      {/* 底部提示区域 */}
      <div>
        <div className="text-center text-gray-500 text-xs">
          <p>账号租赁系统 v1.0.0</p>
          <p className="mt-1">© 2023 版权所有</p>
        </div>
      </div>


    </div>
  );
};

export default MyAccountRentalPage;