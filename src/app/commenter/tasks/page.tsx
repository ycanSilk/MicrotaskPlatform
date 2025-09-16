'use client';

import React, { useState } from 'react';

type TaskStatus = 'inProgress' | 'pending' | 'completed';

interface Task {
  id: number;
  title: string;
  price: number;
  category: string;
  status: TaskStatus;
  statusText: string;
  statusColor: string;
  description: string;
  deadline?: string;
  progress?: number;
  submitTime?: string;
  completedTime?: string;
  reviewNote?: string;
  requirements: string;
  publishTime: string;
}

export default function CommenterTasksPage() {
  const [activeTab, setActiveTab] = useState<TaskStatus>('inProgress');
  
  // 模拟任务数据
  const allTasks: Task[] = [
    // 进行中的任务
    {
      id: 1,
      title: '美食探店推广',
      price: 3.50,
      category: '美食',
      status: 'inProgress',
      statusText: '进行中',
      statusColor: 'bg-blue-100 text-blue-600',
      description: '剩余时间: 2小时18分钟',
      deadline: '2024-01-15 18:00',
      progress: 80,
      requirements: '评论 + 点赞 + 关注',
      publishTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      title: '数码产品体验',
      price: 4.20,
      category: '数码',
      status: 'inProgress',
      statusText: '进行中',
      statusColor: 'bg-blue-100 text-blue-600',
      description: '剩余时间: 1天6小时',
      deadline: '2024-01-16 20:00',
      progress: 30,
      requirements: '深度评测 + 视频分享',
      publishTime: '2024-01-15 10:00'
    },
    {
      id: 3,
      title: '旅游景点推荐',
      price: 5.80,
      category: '旅游',
      status: 'inProgress',
      statusText: '进行中',
      statusColor: 'bg-blue-100 text-blue-600',
      description: '剩余时间: 3天12小时',
      deadline: '2024-01-18 12:00',
      progress: 10,
      requirements: '图文分享 + 评论',
      publishTime: '2024-01-15 08:30'
    },
    // 待审核的任务
    {
      id: 4,
      title: '护肤产品体验',
      price: 5.20,
      category: '美妆',
      status: 'pending',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '已提交，等待审核',
      submitTime: '2024-01-15 16:30',
      requirements: '使用体验 + 效果分享',
      publishTime: '2024-01-14 14:00'
    },
    {
      id: 5,
      title: '家居用品评测',
      price: 4.60,
      category: '生活',
      status: 'pending',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '已提交，等待审核',
      submitTime: '2024-01-15 12:45',
      requirements: '实用性评测 + 推荐理由',
      publishTime: '2024-01-14 09:15'
    },
    {
      id: 6,
      title: '健身器材试用',
      price: 6.00,
      category: '运动',
      status: 'pending',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '已提交，等待审核',
      submitTime: '2024-01-15 10:20',
      requirements: '使用感受 + 效果展示',
      publishTime: '2024-01-13 16:00'
    },
    {
      id: 7,
      title: '儿童玩具评测',
      price: 3.80,
      category: '母婴',
      status: 'pending',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '已提交，等待审核',
      submitTime: '2024-01-14 20:15',
      requirements: '安全性评测 + 趣味性分析',
      publishTime: '2024-01-13 11:30'
    },
    {
      id: 8,
      title: '书籍阅读分享',
      price: 2.90,
      category: '教育',
      status: 'pending',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      description: '已提交，等待审核',
      submitTime: '2024-01-14 15:30',
      requirements: '读后感 + 推荐理由',
      publishTime: '2024-01-13 08:00'
    },
    // 已完成的任务
    {
      id: 9,
      title: '科技产品评测',
      price: 4.80,
      category: '数码',
      status: 'completed',
      statusText: '已完成',
      statusColor: 'bg-green-100 text-green-600',
      description: '任务已完成并获得奖励',
      completedTime: '2024-01-14 18:30',
      requirements: '深度评测 + 视频分享',
      publishTime: '2024-01-13 14:00'
    },
    {
      id: 10,
      title: '餐厅美食推荐',
      price: 3.20,
      category: '美食',
      status: 'completed',
      statusText: '已完成',
      statusColor: 'bg-green-100 text-green-600',
      description: '任务已完成并获得奖励',
      completedTime: '2024-01-14 12:15',
      requirements: '用餐体验 + 菜品推荐',
      publishTime: '2024-01-12 19:00'
    }
  ];
  
  // 过滤不同状态的任务
  const getFilteredTasks = (status: TaskStatus) => {
    return allTasks.filter(task => task.status === status);
  };
  
  const inProgressTasks = getFilteredTasks('inProgress');
  const pendingTasks = getFilteredTasks('pending');
  const completedTasks = getFilteredTasks('completed');
  
  const currentTasks = getFilteredTasks(activeTab);
  
  // 获取按钮样式
  const getTabButtonStyle = (status: TaskStatus) => {
    const isActive = activeTab === status;
    return `flex-1 py-4 px-3 rounded-lg text-sm transition-colors ${
      isActive 
        ? 'bg-blue-500 text-white shadow-md' 
        : 'bg-white border text-gray-600 hover:bg-blue-50'
    }`;
  };
  
  // 获取任务操作按钮
  const getTaskButton = (task: Task) => {
    switch (task.status) {
      case 'inProgress':
        return (
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
            继续完成
          </button>
        );
      case 'pending':
        return (
          <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed" disabled>
            等待审核
          </button>
        );
      case 'completed':
        return (
          <button className="w-full bg-green-100 text-green-600 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors">
            查看详情
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* 任务状态筛选（合并统计和筛选功能） */}
      <div className="mx-4 mt-4 flex space-x-2">
        <button 
          onClick={() => setActiveTab('inProgress')}
          className={getTabButtonStyle('inProgress')}
        >
          <div className="flex flex-col items-center">
            <div className={`text-lg font-bold ${
              activeTab === 'inProgress' ? 'text-white' : 'text-blue-500'
            }`}>
              {inProgressTasks.length}
            </div>
            <span className="text-xs">进行中</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={getTabButtonStyle('pending')}
        >
          <div className="flex flex-col items-center">
            <div className={`text-lg font-bold ${
              activeTab === 'pending' ? 'text-white' : 'text-orange-500'
            }`}>
              {pendingTasks.length}
            </div>
            <span className="text-xs">待审核</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={getTabButtonStyle('completed')}
        >
          <div className="flex flex-col items-center">
            <div className={`text-lg font-bold ${
              activeTab === 'completed' ? 'text-white' : 'text-green-500'
            }`}>
              {completedTasks.length}
            </div>
            <span className="text-xs">已完成</span>
          </div>
        </button>
      </div>

      {/* 任务列表 */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-800">
            {activeTab === 'inProgress' && '进行中的任务'}
            {activeTab === 'pending' && '待审核的任务'}
            {activeTab === 'completed' && '已完成的任务'}
            ({currentTasks.length})
          </span>
        </div>

        {currentTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-gray-500">暂无相关任务</div>
          </div>
        ) : (
          currentTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${task.statusColor}`}>
                  {task.statusText}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <div className="text-lg font-bold text-orange-500">¥{task.price.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {task.category} | {task.publishTime}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                要求：{task.requirements}
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                {task.description}
              </div>
              
              {/* 进度条（仅进行中的任务显示） */}
              {task.status === 'inProgress' && task.progress !== undefined && (
                <div className="mb-4">
                  <div className="bg-gray-200 h-2 rounded mb-1">
                    <div 
                      className="bg-blue-500 h-2 rounded transition-all duration-300" 
                      style={{width: `${task.progress}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">完成进度 {task.progress}%</div>
                </div>
              )}
              
              {/* 时间信息 */}
              {task.deadline && task.status === 'inProgress' && (
                <div className="text-xs text-gray-500 mb-3">
                  截止时间：{task.deadline}
                </div>
              )}
              
              {task.submitTime && task.status === 'pending' && (
                <div className="text-xs text-gray-500 mb-3">
                  提交时间：{task.submitTime}
                </div>
              )}
              
              {task.completedTime && task.status === 'completed' && (
                <div className="text-xs text-gray-500 mb-3">
                  完成时间：{task.completedTime}
                </div>
              )}
              
              {getTaskButton(task)}
            </div>
          ))
        )}
      </div>

      {/* 任务提示 */}
      <div className="mx-4 mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">任务小贴士</h4>
            <p className="text-sm text-blue-600">
              按时完成任务可以提高信誉度，获得更多高价值任务推荐。记得在截止时间前提交哦！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}