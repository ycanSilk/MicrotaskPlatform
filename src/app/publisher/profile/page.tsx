'use client';

import React, { useState } from 'react';

export default function PublisherProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '商家小王',
    company: '美食工作室',
    phone: '138****8888',
    email: 'publisher@example.com',
    address: '北京市朝阳区某某街道',
    businessType: '餐饮',
    description: '专注美食推广，为用户提供优质的探店体验任务。'
  });

  // 统计数据
  const statsData = {
    totalTasks: 189,
    completedTasks: 165,
    totalSpent: 3847.20,
    rating: 4.8,
    followers: 1234
  };

  // 认证信息
  const verificationData = {
    realName: '已认证',
    business: '已认证',
    phone: '已认证',
    email: '未认证'
  };

  // 设置选项
  const settingsOptions = [
    { id: 'notifications', label: '消息通知', icon: '🔔', enabled: true },
    { id: 'taskReminder', label: '任务提醒', icon: '⏰', enabled: true },
    { id: 'autoReview', label: '自动审核', icon: '🤖', enabled: false },
    { id: 'nightMode', label: '夜间模式', icon: '🌙', enabled: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    alert('保存成功！');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSetting = (settingId: string) => {
    // 这里可以实现具体的设置切换逻辑
    alert(`切换${settingId}设置`);
  };

  return (
    <div className="pb-20">
      {/* 功能选择 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          个人信息
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'stats' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          数据统计
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'settings' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          设置
        </button>
      </div>

      {activeTab === 'profile' && (
        <>
          {/* 头像和基本信息 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">个人信息</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-green-500 text-sm hover:text-green-600"
                >
                  {isEditing ? '取消' : '编辑'}
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div>
                  <div className="font-medium text-gray-800">{formData.nickname}</div>
                  <div className="text-sm text-gray-500">{formData.company}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      {formData.businessType}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      ⭐ {statsData.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* 详细信息表单 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  />
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    保存修改
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 认证状态 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">认证状态</h3>
              <div className="space-y-3">
                {Object.entries(verificationData).map(([key, status]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {key === 'realName' && '实名认证'}
                      {key === 'business' && '企业认证'}
                      {key === 'phone' && '手机认证'}
                      {key === 'email' && '邮箱认证'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        status === '已认证' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {status}
                      </span>
                      {status === '未认证' && (
                        <button className="text-xs text-green-500 hover:text-green-600">
                          去认证
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'stats' && (
        <>
          {/* 数据统计 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">我的数据</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{statsData.totalTasks}</div>
                  <div className="text-xs text-blue-700">总发布任务</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{statsData.completedTasks}</div>
                  <div className="text-xs text-green-700">完成任务</div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">¥{statsData.totalSpent}</div>
                  <div className="text-xs text-orange-700">总投入</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{statsData.followers}</div>
                  <div className="text-xs text-purple-700">关注我的</div>
                </div>
              </div>
            </div>
          </div>

          {/* 等级信息 */}
          <div className="mx-4 mt-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">👑</span>
                  <span className="font-bold text-gray-800">金牌派单员</span>
                </div>
                <span className="text-sm font-medium text-orange-600">Lv.5</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                距离下一级还需要完成 15 个任务
              </div>
              <div className="bg-gray-200 h-2 rounded">
                <div className="bg-orange-500 h-2 rounded" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <>
          {/* 设置选项 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">功能设置</h3>
              </div>
              <div className="divide-y">
                {settingsOptions.map((option) => (
                  <div key={option.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-gray-800">{option.label}</span>
                    </div>
                    <button
                      onClick={() => toggleSetting(option.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        option.enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                        option.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 其他设置 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">其他</h3>
              </div>
              <div className="divide-y">
                <button className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">🔒 账户安全</span>
                  <span className="text-gray-400">{'>'}</span>
                </button>
                <button className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">❓ 帮助中心</span>
                  <span className="text-gray-400">{'>'}</span>
                </button>
                <button className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">📞 联系客服</span>
                  <span className="text-gray-400">{'>'}</span>
                </button>
                <button className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">ℹ️ 关于我们</span>
                  <span className="text-gray-400">{'>'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 退出登录 */}
          <div className="mx-4 mt-6">
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}