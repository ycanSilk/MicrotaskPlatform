'use client';

import React, { useState } from 'react';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState('today');
  
  // 模拟平台数据
  const platformData = {
    today: {
      totalUsers: 12345,
      newUsers: 234,
      activeTasks: 456,
      completedTasks: 189,
      totalRevenue: 45678.90,
      pendingReviews: 23
    },
    week: {
      totalUsers: 12345,
      newUsers: 1234,
      activeTasks: 2567,
      completedTasks: 1456,
      totalRevenue: 234567.80,
      pendingReviews: 156
    },
    month: {
      totalUsers: 12345,
      newUsers: 4567,
      activeTasks: 8945,
      completedTasks: 6789,
      totalRevenue: 1234567.90,
      pendingReviews: 678
    }
  };

  const currentData = platformData[dateRange as keyof typeof platformData];

  // 用户分布数据
  const userStats = {
    commenter: { count: 8567, active: 6234, growth: '+12.5%' },
    publisher: { count: 1234, active: 890, growth: '+8.3%' },
    admin: { count: 12, active: 8, growth: '0%' }
  };

  // 最近活动
  const recentActivities = [
    { id: 1, type: 'user', action: '新用户注册', user: '评论员小李', time: '5分钟前', icon: '👤' },
    { id: 2, type: 'task', action: '任务完成', user: '派单员小王', time: '8分钟前', icon: '✅' },
    { id: 3, type: 'review', action: '任务审核', user: '管理员A', time: '12分钟前', icon: '📋' },
    { id: 4, type: 'withdraw', action: '提现申请', user: '评论员小张', time: '15分钟前', icon: '💰' },
    { id: 5, type: 'system', action: '系统维护', user: '系统', time: '30分钟前', icon: '⚙️' }
  ];

  return (
    <div className="pb-20">
      {/* 时间范围选择 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setDateRange('today')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            dateRange === 'today' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          今日
        </button>
        <button
          onClick={() => setDateRange('week')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            dateRange === 'week' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          本周
        </button>
        <button
          onClick={() => setDateRange('month')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            dateRange === 'month' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-purple-50'
          }`}
        >
          本月
        </button>
      </div>

      {/* 核心数据概览 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">平台概览</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{currentData.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-blue-700">总用户数</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{currentData.newUsers}</div>
              <div className="text-xs text-green-700">新增用户</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-600">{currentData.activeTasks}</div>
              <div className="text-xs text-orange-700">活跃任务</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">¥{currentData.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-purple-700">平台收入</div>
            </div>
          </div>
        </div>
      </div>

      {/* 用户分布统计 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">用户分布</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">💬</span>
                <div>
                  <div className="font-medium text-gray-800">评论员</div>
                  <div className="text-xs text-gray-500">活跃：{userStats.commenter.active}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{userStats.commenter.count.toLocaleString()}</div>
                <div className="text-xs text-green-600">{userStats.commenter.growth}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-green-600">📋</span>
                <div>
                  <div className="font-medium text-gray-800">派单员</div>
                  <div className="text-xs text-gray-500">活跃：{userStats.publisher.active}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{userStats.publisher.count.toLocaleString()}</div>
                <div className="text-xs text-green-600">{userStats.publisher.growth}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-purple-600">⚙️</span>
                <div>
                  <div className="font-medium text-gray-800">管理员</div>
                  <div className="text-xs text-gray-500">活跃：{userStats.admin.active}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{userStats.admin.count}</div>
                <div className="text-xs text-gray-600">{userStats.admin.growth}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 待处理事项 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">待处理事项</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{currentData.pendingReviews}</div>
                <div className="text-xs text-orange-700">待审核任务</div>
              </div>
            </div>
            <div className="border border-red-200 rounded-lg p-3 bg-red-50">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">5</div>
                <div className="text-xs text-red-700">待处理投诉</div>
              </div>
            </div>
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">12</div>
                <div className="text-xs text-blue-700">待审核提现</div>
              </div>
            </div>
            <div className="border border-green-200 rounded-lg p-3 bg-green-50">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">3</div>
                <div className="text-xs text-green-700">系统告警</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">最近活动</h3>
          </div>
          <div className="divide-y max-h-64 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.user} · {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="mx-4 mt-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3">快捷操作</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
              📋 审核任务
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
              👥 管理用户
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
              💰 财务审批
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
              ⚙️ 系统设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}