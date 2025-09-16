'use client';

import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('system');
  
  // 系统设置
  const [systemSettings, setSystemSettings] = useState({
    siteName: '抖音任务平台',
    siteDescription: '专业的社交媒体营销任务平台',
    taskReviewTime: 24, // 小时
    withdrawMinAmount: 50,
    withdrawFee: 2,
    platformCommission: 5, // 百分比
    inviteCommission: 5, // 百分比
    autoReview: false,
    maintenanceMode: false
  });

  // 用户角色设置
  const userRoles = [
    {
      id: 'commenter',
      name: '评论员',
      permissions: ['view_tasks', 'submit_tasks', 'withdraw_money', 'invite_users'],
      maxWithdrawDaily: 5000,
      reviewRequired: true,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'publisher',
      name: '派单员',
      permissions: ['create_tasks', 'manage_tasks', 'view_stats', 'withdraw_money'],
      maxWithdrawDaily: 50000,
      reviewRequired: false,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'admin',
      name: '管理员',
      permissions: ['all_permissions'],
      maxWithdrawDaily: 999999,
      reviewRequired: false,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  // 任务分类管理
  const [taskCategories, setTaskCategories] = useState([
    { id: 1, name: '美食', icon: '🍔', enabled: true, minPrice: 2.0, maxPrice: 20.0 },
    { id: 2, name: '数码', icon: '📱', enabled: true, minPrice: 5.0, maxPrice: 50.0 },
    { id: 3, name: '美妆', icon: '💄', enabled: true, minPrice: 3.0, maxPrice: 30.0 },
    { id: 4, name: '旅游', icon: '✈️', enabled: true, minPrice: 8.0, maxPrice: 100.0 },
    { id: 5, name: '影视', icon: '🎬', enabled: true, minPrice: 1.0, maxPrice: 15.0 },
    { id: 6, name: '运动', icon: '⚽', enabled: false, minPrice: 5.0, maxPrice: 40.0 }
  ]);

  // 系统通知
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '系统维护通知',
      content: '平台将于今晚22:00-23:00进行系统升级维护，期间暂停服务。',
      type: 'maintenance',
      enabled: true,
      startTime: '2024-01-15 22:00',
      endTime: '2024-01-15 23:00'
    },
    {
      id: 2,
      title: '新功能上线',
      content: '邀请好友功能已上线，邀请好友完成任务可获得5%佣金奖励！',
      type: 'feature',
      enabled: true,
      startTime: '2024-01-15 00:00',
      endTime: '2024-01-20 23:59'
    }
  ]);

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSystemSettings = () => {
    alert('系统设置保存成功！');
  };

  const handleToggleCategory = (categoryId: number) => {
    setTaskCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
  };

  const handleCategoryPriceChange = (categoryId: number, field: 'minPrice' | 'maxPrice', value: number) => {
    setTaskCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, [field]: value }
          : cat
      )
    );
  };

  const handleToggleNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, enabled: !notif.enabled }
          : notif
      )
    );
  };

  const addNewCategory = () => {
    const name = prompt('请输入分类名称：');
    const icon = prompt('请输入分类图标（emoji）：');
    if (name && icon) {
      setTaskCategories(prev => [...prev, {
        id: Math.max(...prev.map(c => c.id)) + 1,
        name,
        icon,
        enabled: true,
        minPrice: 1.0,
        maxPrice: 10.0
      }]);
    }
  };

  const addNewNotification = () => {
    const title = prompt('请输入通知标题：');
    const content = prompt('请输入通知内容：');
    if (title && content) {
      setNotifications(prev => [...prev, {
        id: Math.max(...prev.map(n => n.id)) + 1,
        title,
        content,
        type: 'info',
        enabled: true,
        startTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ')
      }]);
    }
  };

  return (
    <div className="pb-20">
      {/* 功能切换 */}
      <div className="mx-4 mt-4 grid grid-cols-4 gap-1">
        <button
          onClick={() => setActiveTab('system')}
          className={`py-2 px-2 rounded text-xs font-medium transition-colors ${
            activeTab === 'system' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          系统设置
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-2 px-2 rounded text-xs font-medium transition-colors ${
            activeTab === 'roles' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          角色权限
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-2 rounded text-xs font-medium transition-colors ${
            activeTab === 'categories' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          任务分类
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-2 px-2 rounded text-xs font-medium transition-colors ${
            activeTab === 'notifications' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          系统通知
        </button>
      </div>

      {activeTab === 'system' && (
        <>
          {/* 基本设置 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">基本设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
                  <input
                    type="text"
                    value={systemSettings.siteName}
                    onChange={(e) => handleSystemSettingChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
                  <textarea
                    value={systemSettings.siteDescription}
                    onChange={(e) => handleSystemSettingChange('siteDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 业务设置 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">业务设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">任务审核时间（小时）</label>
                  <input
                    type="number"
                    value={systemSettings.taskReviewTime}
                    onChange={(e) => handleSystemSettingChange('taskReviewTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低提现金额（元）</label>
                  <input
                    type="number"
                    value={systemSettings.withdrawMinAmount}
                    onChange={(e) => handleSystemSettingChange('withdrawMinAmount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">提现手续费（元）</label>
                  <input
                    type="number"
                    value={systemSettings.withdrawFee}
                    onChange={(e) => handleSystemSettingChange('withdrawFee', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">平台佣金（%）</label>
                  <input
                    type="number"
                    value={systemSettings.platformCommission}
                    onChange={(e) => handleSystemSettingChange('platformCommission', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邀请佣金（%）</label>
                  <input
                    type="number"
                    value={systemSettings.inviteCommission}
                    onChange={(e) => handleSystemSettingChange('inviteCommission', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 开关设置 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">功能开关</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">自动审核</div>
                    <div className="text-sm text-gray-500">启用后系统将自动审核符合条件的任务</div>
                  </div>
                  <button
                    onClick={() => handleSystemSettingChange('autoReview', !systemSettings.autoReview)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      systemSettings.autoReview ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                      systemSettings.autoReview ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">维护模式</div>
                    <div className="text-sm text-gray-500">启用后网站将显示维护页面</div>
                  </div>
                  <button
                    onClick={() => handleSystemSettingChange('maintenanceMode', !systemSettings.maintenanceMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      systemSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                      systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="mx-4 mt-6">
            <button
              onClick={handleSaveSystemSettings}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              保存设置
            </button>
          </div>
        </>
      )}

      {activeTab === 'roles' && (
        <>
          {/* 用户角色列表 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">用户角色管理</h3>
              </div>
              <div className="divide-y">
                {userRoles.map((role) => (
                  <div key={role.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-sm ${role.color}`}>
                          {role.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {role.reviewRequired ? '需要审核' : '无需审核'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        日提现限额：¥{role.maxWithdrawDaily.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">权限列表：</div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          {/* 任务分类管理 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-800">任务分类管理</h3>
                <button
                  onClick={addNewCategory}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  + 添加分类
                </button>
              </div>
              <div className="divide-y">
                {taskCategories.map((category) => (
                  <div key={category.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-800">{category.name}</span>
                        <button
                          onClick={() => handleToggleCategory(category.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            category.enabled 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {category.enabled ? '已启用' : '已禁用'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">最低价格（元）</label>
                        <input
                          type="number"
                          step="0.1"
                          value={category.minPrice}
                          onChange={(e) => handleCategoryPriceChange(category.id, 'minPrice', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">最高价格（元）</label>
                        <input
                          type="number"
                          step="0.1"
                          value={category.maxPrice}
                          onChange={(e) => handleCategoryPriceChange(category.id, 'maxPrice', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'notifications' && (
        <>
          {/* 系统通知管理 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-gray-800">系统通知管理</h3>
                <button
                  onClick={addNewNotification}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  + 添加通知
                </button>
              </div>
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">{notification.title}</span>
                          <button
                            onClick={() => handleToggleNotification(notification.id)}
                            className={`text-xs px-2 py-1 rounded ${
                              notification.enabled 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {notification.enabled ? '已启用' : '已禁用'}
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{notification.content}</div>
                        <div className="text-xs text-gray-500">
                          <div>开始时间：{notification.startTime}</div>
                          <div>结束时间：{notification.endTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}