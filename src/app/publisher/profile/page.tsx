'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShopOutlined, WalletOutlined, EditOutlined, OrderedListOutlined, BarChartOutlined, CreditCardOutlined, RightOutlined } from '@ant-design/icons';

interface BalanceData {
  balance: number;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

export default function PublisherProfilePage() {
  const router = useRouter();
  const [balance, setBalance] = useState<BalanceData>({ balance: 0 });
  const [userInfo, setUserInfo] = useState({
    nickname: '张三',
    phoneNumber: '13800138000',
    imgurl: '/images/0e92a4599d02a7.jpg'
  });

  // 获取余额数据
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setBalance({ balance: 1298 });
    }, 500);
  }, []);

  // 菜单项列表
  const menuItems: MenuItem[] = [
    {
      id: 'balance',
      title: '账户余额',
      icon: <WalletOutlined className="text-xl" />,
      color: 'bg-yellow-100',
      path: '/publisher/balance'
    },
    {
      id: 'create-task',
      title: '我发布的',
      icon: <EditOutlined className="text-xl" />,
      color: 'bg-red-100',
      path: '/publisher/create'
    },
    {
      id: 'create-task',
      title: '我的租赁',
      icon: <EditOutlined className="text-xl" />,
      color: 'bg-red-100',
      path: '/publisher/create'
    },
    {
      id: 'order-management',
      title: '订单管理',
      icon: <OrderedListOutlined className="text-xl" />,
      color: 'bg-green-100',
      path: '/publisher/dashboard'
    },
    {
      id: 'data-stats',
      title: '数据总览',
      icon: <BarChartOutlined className="text-xl" />,
      color: 'bg-blue-100',
      path: '/publisher/profile/data-stats'
    },
    {
      id: 'bank-cards',
      title: '银行卡',
      icon: <CreditCardOutlined className="text-xl" />,
      color: 'bg-purple-100',
      path: '/publisher/bank-cards'
    }
  ];

  // 处理菜单项点击
  const handleMenuItemClick = (path: string) => {
    router.push(path as any);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部用户信息区域 */}
      <div className="bg-blue-500 text-white p-6 mb-5">
        <div 
          className="flex items-center justify-between space-x-4 mb-4 cursor-pointer hover:bg-blue-600 rounded-lg p-2 transition-colors"
          onClick={() => router.push('/publisher/profile/settings')}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
              <img src={userInfo.imgurl} alt="" className="w-full h-full overflow-hidden rounded-lg" />
            </div>
            <div>
              <span className="flex font-bold text-lg items-center">
                {userInfo.nickname}
              </span>
              <span className="flex text-sm opacity-80">{userInfo.phoneNumber}</span>
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
          <p>商家中心 v1.0.0</p>
          <p className="mt-1">© 2023 版权所有</p>
        </div>
      </div>
    </div>
  );
}