"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DataStatsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('week'); // 'today' | 'week' | 'month'
  
  // 模拟数据
  const statsData = {
    today: {
      publishedTasks: 12,
      completedTasks: 8,
      totalSpent: 156.80,
      pendingReview: 3
    },
    week: {
      publishedTasks: 45,
      completedTasks: 38,
      totalSpent: 892.50,
      pendingReview: 7
    },
    month: {
      publishedTasks: 189,
      completedTasks: 165,
      totalSpent: 3847.20,
      pendingReview: 24
    }
  };

  const currentStats = statsData[dateRange as keyof typeof statsData];

  // 任务分类统计
  const categoryStats = [
    { category: '美食', count: 45, spent: 324.50, color: 'bg-orange-50 text-orange-600' },
    { category: '数码', count: 38, spent: 612.80, color: 'bg-blue-50 text-blue-600' },
    { category: '美妆', count: 32, spent: 258.70, color: 'bg-pink-50 text-pink-600' },
    { category: '旅游', count: 28, spent: 445.60, color: 'bg-green-50 text-green-600' },
    { category: '影视', count: 25, spent: 189.30, color: 'bg-purple-50 text-purple-600' }
  ];

  // 效果统计
  const effectStats = [
    { metric: '平均完成率', value: '87.3%', trend: '+2.5%', color: 'text-green-600' },
    { metric: '平均单价', value: '¥4.85', trend: '+0.32', color: 'text-green-600' },
    { metric: '用户满意度', value: '4.8分', trend: '+0.1', color: 'text-green-600' },
    { metric: '复购率', value: '73.2%', trend: '-1.2%', color: 'text-red-500' }
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
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
          <h1 className="text-lg font-medium text-gray-800">数据统计</h1>
        </div>
      </div>

      {/* 时间范围选择 */}
      <div className="mt-4 px-5">
        <div className="flex rounded-lg bg-white p-1 shadow-sm">
          <button
            onClick={() => setDateRange('today')}
            className={`flex-1 py-2.5 text-center rounded-md font-medium transition-colors ${
              dateRange === 'today' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`flex-1 py-2.5 text-center rounded-md font-medium transition-colors ${
              dateRange === 'week' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`flex-1 py-2.5 text-center rounded-md font-medium transition-colors ${
              dateRange === 'month' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            本月
          </button>
        </div>
      </div>

      {/* 核心数据概览 */}
      <div className="mt-5 px-5">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">核心数据</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{currentStats.publishedTasks}</div>
              <div className="text-xs text-blue-700 mt-1">发布任务</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{currentStats.completedTasks}</div>
              <div className="text-xs text-green-700 mt-1">完成任务</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">¥{currentStats.totalSpent}</div>
              <div className="text-xs text-orange-700 mt-1">总支出</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{currentStats.pendingReview}</div>
              <div className="text-xs text-purple-700 mt-1">待审核</div>
            </div>
          </div>
        </div>
      </div>

      {/* 任务分类统计 */}
      <div className="mt-5 px-5">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">分类统计</h3>
          <div className="space-y-3">
            {categoryStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs ${item.color}`}>
                    {item.category}
                  </div>
                  <div className="text-sm text-gray-600">{item.count}个任务</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">¥{item.spent}</div>
                  <div className="text-xs text-gray-500">
                    {((item.spent / currentStats.totalSpent) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 效果分析 */}
      <div className="mt-5 px-5">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">效果分析</h3>
          <div className="grid grid-cols-2 gap-3">
            {effectStats.map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1.5">{item.metric}</div>
                <div className="font-bold text-gray-800 mb-1.5">{item.value}</div>
                <div className={`text-xs ${item.color} flex items-center`}>
                  {item.trend.startsWith('+') ? (
                    <>↗️ <span>{item.trend}</span></>
                  ) : (
                    <>↘️ <span>{item.trend}</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 优化建议 */}
      <div className="mt-5 px-5 mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-500 text-xl mt-0.5">💡</span>
            <div>
              <h4 className="font-medium text-yellow-800 mb-1.5">优化建议</h4>
              <div className="text-sm text-yellow-700 space-y-2">
                <p className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>美食类任务表现最佳，建议增加投入</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>复购率有所下降，建议关注用户反馈</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>可适当提高单价以吸引更多优质评论员</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}