"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlertModal from '../../../components/ui/AlertModal';

interface BalanceData {
  balance: number;
}

export default function PublisherProfilePage() {
  const router = useRouter();
  const [balance, setBalance] = useState<BalanceData>({
    balance: 0
  });
  const [userInfo, setUserInfo] = useState({
    nickname: '商家小王',
    company: '美食工作室',
    businessType: '餐饮',
    rating: 4.8,
    level: 'Lv.5',
    levelName: '金牌派单员',
    levelProgress: 75,
    levelRemaining: 15
  });
  const [statsSummary, setStatsSummary] = useState({
    totalTasks: 189,
    completedTasks: 165,
    followers: 1234
  });
  
  // 通用提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });

  // 显示通用提示框
  const showAlert = (title: string, message: string, icon: string) => {
    setAlertConfig({ title, message, icon });
    setShowAlertModal(true);
  };

  // 获取用户信息和余额数据
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      // 模拟余额数据
      setBalance({ balance: 1298 });
      
      // 从本地存储获取用户信息（如果有）
      if (typeof window !== 'undefined') {
        const storedUserInfo = localStorage.getItem('publisher_profile');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      }
    }, 500);
  }, []);

  // 退出登录处理
  const handleLogout = () => {
    // 清除本地存储的用户信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
      localStorage.removeItem('publisher_auth_token');
    }
    // 跳转到派单员登录页面
    router.push('/auth/login/publisherlogin');
  };

  // 跳转到二级页面
  const navigateToPage = (page: string) => {
    // @ts-ignore - 忽略路由类型检查
    router.push(`/publisher/profile/${page}`);
  };

  // 充值处理
  const handleRecharge = () => {
    router.push('/publisher/finance');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部信息栏 */}
      <div className="bg-white shadow-sm">
        {/* 用户信息区 */}
        <div className="px-5 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🏪
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg flex items-center">
                {userInfo.nickname}
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded">
                  {userInfo.levelName} {userInfo.level}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{userInfo.company} · {userInfo.businessType}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-500 text-sm flex items-center"
          >
            <span className="mr-1">👋</span> 退出登录
          </button>
        </div>
        
        {/* 等级进度条 */}
        <div className="px-5 pb-4">
          <div className="text-xs text-gray-500 mb-1.5">
            距离下一级还需完成 {userInfo.levelRemaining} 个任务
          </div>
          <div className="bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-yellow-500 h-full transition-all duration-500"
              style={{ width: `${userInfo.levelProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 余额区域 */}
      <div className="mt-4 bg-white px-5 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-600">账户余额</div>
          <button 
            onClick={handleRecharge}
            className="bg-green-50 text-green-600 text-sm px-3 py-1.5 rounded-full"
          >
            充值
          </button>
        </div>
        <div className="text-3xl font-bold text-gray-800">
          ¥{balance.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="font-medium text-gray-800">{statsSummary.totalTasks}</div>
            <div className="text-xs text-gray-500">总发布任务</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-800">{statsSummary.completedTasks}</div>
            <div className="text-xs text-gray-500">完成任务</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-800">{statsSummary.followers}</div>
            <div className="text-xs text-gray-500">关注我的</div>
          </div>
        </div>
      </div>

      {/* 功能按钮区域 */}
      <div className="mt-4 bg-white px-5 py-3 shadow-sm">
        <div className="text-gray-700 font-medium mb-3">我的功能</div>
        <div className="grid grid-cols-4 gap-3">
          <button 
            onClick={() => navigateToPage('personal-info')}
            className="flex flex-col items-center justify-center p-3"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-1.5">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-xs text-gray-600">个人信息</span>
          </button>
          <button 
            onClick={() => navigateToPage('data-stats')}
            className="flex flex-col items-center justify-center p-3"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-1.5">
              <span className="text-xl">📊</span>
            </div>
            <span className="text-xs text-gray-600">数据统计</span>
          </button>
          <button 
            onClick={() => navigateToPage('settings')}
            className="flex flex-col items-center justify-center p-3"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-1.5">
              <span className="text-xl">⚙️</span>
            </div>
            <span className="text-xs text-gray-600">设置</span>
          </button>
          <button 
            onClick={() => navigateToPage('verification')}
            className="flex flex-col items-center justify-center p-3"
          >
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-1.5">
              <span className="text-xl">📝</span>
            </div>
            <span className="text-xs text-gray-600">认证中心</span>
          </button>
        </div>
      </div>

      {/* 快捷入口区域 */}
      <div className="mt-4 bg-white px-5 py-4 shadow-sm">
        <div className="space-y-3.5">
          <button 
            onClick={() => router.push('/publisher/finance')}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-green-500">💰</span>
              <span className="text-gray-700">财务管理</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
          <div className="border-t border-gray-100"></div>
          <button 
            onClick={() => router.push('/publisher/tasks/history')}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-blue-500">📋</span>
              <span className="text-gray-700">任务历史</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
          <div className="border-t border-gray-100"></div>
          <button 
            onClick={() => navigateToPage('help-center')}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-orange-500">❓</span>
              <span className="text-gray-700">帮助中心</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
        </div>
      </div>

      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}