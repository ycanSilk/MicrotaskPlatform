'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PhoneOutlined, FileTextOutlined, WalletOutlined, BarChartOutlined, UserOutlined, QuestionCircleOutlined, SettingOutlined, RightOutlined, HomeOutlined, CreditCardOutlined, StarOutlined, ShopOutlined } from '@ant-design/icons';

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
    avatar: '👤',
    level: '高级用户',
    score: 4.8,
    memberSince: '2023-01-15',
    accountNumber: 'ACC87654321'
  };

  // 所有菜单项列表
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: '个人主页',
      icon: <HomeOutlined className="text-xl" />,
      color: 'bg-blue-100',
      path: '/accountrental/my-account-rental'
    },
    {
      id: 'balance',
      title: '账户余额',
      icon: <WalletOutlined className="text-xl" />,
      color: 'bg-yellow-100',
      path: '/accountrental/my-account-rental/balance'
    },
    {
      id: 'bills',
      title: '交易账单',
      icon: <CreditCardOutlined className="text-xl" />,
      color: 'bg-purple-100',
      path: '/accountrental/my-account-rental/bills'
    },
    {
        id: 'published',
          title: '已发布账号',
          icon: <ShopOutlined className="text-xl" />,
          color: 'bg-green-100',
          path: '/accountrental/my-account-rental/published'
        },
    {
      id: 'rented',
      title: '已租赁账号',
      icon: <StarOutlined className="text-xl" />,
      color: 'bg-indigo-100',
      path: '/accountrental/my-account-rental/rented'
    },
    {
      id: 'personal-info',
      title: '个人信息',
      icon: <UserOutlined className="text-xl" />,
      color: 'bg-gray-100',
      path: '/accountrental/my-account-rental/personal-info'
    },
    {
      id: 'help-center',
      title: '帮助中心',
      icon: <QuestionCircleOutlined className="text-xl" />,
      color: 'bg-red-100',
      path: '/accountrental/my-account-rental/help-center'
    },
    {
      id: 'settings',
      title: '设置',
      icon: <SettingOutlined className="text-xl" />,
      color: 'bg-indigo-100',
      path: '/accountrental/my-account-rental/settings'
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 mb-5">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
            {userInfo.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold">{userInfo.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded">{userInfo.level}</span>
              <span className="text-blue-100 text-sm">评分 {userInfo.score}</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-blue-100">
          账号: {userInfo.accountNumber} | 注册时间: {userInfo.memberSince}
        </div>
      </div>

      {/* 余额区域 */}
      <div className="px-4 mb-5">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-gray-500 text-sm">我的余额</h2>
              <p className="text-3xl font-bold mt-1">¥{balance.toFixed(2)}</p>
            </div>
            <Button
              onClick={handleWithdraw}
              className="bg-blue-600 hover:bg-blue-700 text-white min-h-12 active:scale-95 transition-all"
            >
              提现
            </Button>
          </div>
          <div className="flex justify-around text-center">
            <div className="text-gray-500 text-sm">
              <div className="mb-1">总收益</div>
              <div className="font-medium text-gray-800">¥5,620.00</div>
            </div>
            <div className="text-gray-500 text-sm">
              <div className="mb-1">待结算</div>
              <div className="font-medium text-gray-800">¥350.00</div>
            </div>
            <div className="text-gray-500 text-sm">
              <div className="mb-1">优惠券</div>
              <div className="font-medium text-orange-500">3张</div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单列表 */}
      <div className="px-4 mb-5">
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
      <div className="px-4">
        <div className="text-center text-gray-500 text-xs">
          <p>账号租赁系统 v1.0.0</p>
          <p className="mt-1">© 2023 版权所有</p>
        </div>
      </div>


    </div>
  );
};

export default MyAccountRentalPage;