'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BalanceData {
  balance: number;
}

export default function PublisherProfilePage() {
  const router = useRouter();
  const [balance, setBalance] = useState<BalanceData>({ balance: 0 });
  const [userInfo, setUserInfo] = useState({
    nickname: '商家小王',
    company: '美食工作室',
    businessType: '餐饮',
    level: 'Lv.5'
  });

  // 获取余额数据
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setBalance({ balance: 1298 });
    }, 500);
  }, []);

  // 查看余额详情
  const viewBalanceDetails = () => {
    router.push('/publisher/balance');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部信息栏 - 支付宝风格渐变背景 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        {/* 用户信息区 - 保留的部分 */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
              🏪
            </div>
            <div>
              <div className="font-bold text-lg flex items-center">
                {userInfo.nickname}
                <span className="ml-2 text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                  {userInfo.level}
                </span>
              </div>
              <div className="text-xs opacity-80 mt-1">{userInfo.company} · {userInfo.businessType}</div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/publisher/profile/settings')}
            className="opacity-80 text-sm flex items-center"
          >
            <span className="mr-1">👤</span> 设置
          </button>
        </div>
      </div>

      {/* 主要功能区域 - 列表形式 */}
      <div className="mt-4 bg-white">
        {/* 余额模块 */}
        <div 
          onClick={viewBalanceDetails}
          className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100"
        >
          <div className="flex items-center">
            <span className="text-xl mr-4 text-green-500">💰</span>
            <div>
              <div className="text-base text-gray-800">账户余额</div>
              <div className="text-lg font-bold mt-1">¥{balance.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </div>

        {/* 发布任务 */}
        <button 
          onClick={() => router.push('/publisher/create')}
          className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100"
        >
          <div className="flex items-center">
            <span className="text-xl mr-4 text-red-500">✏️</span>
            <span className="text-base text-gray-800">发布任务</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>

        {/* 订单管理 */}
        <button 
          onClick={() => router.push('/publisher/dashboard')}
          className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100"
        >
          <div className="flex items-center">
            <span className="text-xl mr-4 text-green-500">📋</span>
            <span className="text-base text-gray-800">订单管理</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>

        {/* 数据统计 */}
        <button 
          onClick={() => router.push('/publisher/profile/data-stats')}
          className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100"
        >
          <div className="flex items-center">
            <span className="text-xl mr-4 text-blue-500">📊</span>
            <span className="text-base text-gray-800">数据统计</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>

        {/* 银行卡 */}
        <button 
          onClick={() => router.push('/publisher/finance')}
          className="w-full flex items-center justify-between px-6 py-5"
        >
          <div className="flex items-center">
            <span className="text-xl mr-4 text-purple-500">💳</span>
            <span className="text-base text-gray-800">银行卡</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>
      </div>
    </div>
  );
}