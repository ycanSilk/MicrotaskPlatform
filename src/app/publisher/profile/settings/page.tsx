"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertModal from '../../../../components/ui/AlertModal';

export default function SettingsPage() {
  const router = useRouter();
  
  // 设置选项
  const [settingsOptions, setSettingsOptions] = useState([
    { id: 'notifications', label: '消息通知', icon: '🔔', enabled: true },
    { id: 'taskReminder', label: '任务提醒', icon: '⏰', enabled: true },
    { id: 'autoReview', label: '自动审核', icon: '🤖', enabled: false },
    { id: 'nightMode', label: '夜间模式', icon: '🌙', enabled: false }
  ]);
  
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

  // 切换设置
  const toggleSetting = (settingId: string) => {
    setSettingsOptions(prev => 
      prev.map(option => 
        option.id === settingId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
    showAlert('设置已更新', `已${settingsOptions.find(o => o.id === settingId)?.enabled ? '关闭' : '开启'}${getSettingLabel(settingId)}`, '✅');
  };

  // 获取设置标签
  const getSettingLabel = (settingId: string) => {
    const setting = settingsOptions.find(o => o.id === settingId);
    return setting ? setting.label : '';
  };

  // 导航到其他页面
  const navigateTo = (route: string) => {
    // @ts-ignore - 忽略路由类型检查
    router.push(route);
  };

  const handleBack = () => {
    router.back();
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm">
        <div className="px-5 py-4 flex items-center">
          <button 
            onClick={handleBack}
            className="text-gray-600 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-800">设置</h1>
        </div>
      </div>

      {/* 功能设置 */}
      <div className="mt-4 bg-white shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-700">功能设置</h3>
        </div>
        <div>
          {settingsOptions.map((option) => (
            <div key={option.id} className="p-5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{option.icon}</span>
                <span className="text-gray-800">{option.label}</span>
              </div>
              <button
                onClick={() => toggleSetting(option.id)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${option.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div 
                  className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${option.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} 
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 账户安全 */}
      <div className="mt-4 bg-white shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-700">账户安全</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <button 
            className="w-full p-5 flex items-center justify-between text-left"
            onClick={() => navigateTo('/publisher/profile/account-security')}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-blue-500">🔒</span>
              <span className="text-gray-800">修改密码</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
          <button 
            className="w-full p-5 flex items-center justify-between text-left"
            onClick={() => navigateTo('/publisher/profile/binding')}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-green-500">📱</span>
              <span className="text-gray-800">绑定手机</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
        </div>
      </div>

      {/* 其他 */}
      <div className="mt-4 bg-white shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-700">其他</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <button 
            className="w-full p-5 flex items-center justify-between text-left"
            onClick={() => navigateTo('/publisher/profile/help-center')}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-orange-500">❓</span>
              <span className="text-gray-800">帮助中心</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
          <button 
            className="w-full p-5 flex items-center justify-between text-left"
            onClick={() => navigateTo('/publisher/profile/contact')}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-purple-500">📞</span>
              <span className="text-gray-800">联系客服</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
          <button 
            className="w-full p-5 flex items-center justify-between text-left"
            onClick={() => navigateTo('/publisher/profile/about')}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">ℹ️</span>
              <span className="text-gray-800">关于我们</span>
            </div>
            <span className="text-gray-400">{'>'}</span>
          </button>
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div className="mt-8 px-5 mb-10">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          退出登录
        </button>
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