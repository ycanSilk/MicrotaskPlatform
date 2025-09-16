'use client';

import React, { useState } from 'react';

export default function PublisherDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'status' | 'price'
  const [statsTimeRange, setStatsTimeRange] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month'
  
  // 模拟发布的任务数据
  const myTasks = [
    {
      id: 1,
      title: '美食探店推广',
      category: '美食',
      price: 3.50,
      status: 'active',
      statusText: '进行中',
      statusColor: 'bg-green-100 text-green-600',
      participants: 12,
      maxParticipants: 20,
      completed: 8,
      publishTime: '2024-01-15 14:30',
      deadline: '2024-01-18 23:59',
      description: '需要到店体验并发布真实评论'
    },
    {
      id: 2,
      title: '护肤产品体验',
      category: '美妆',
      price: 5.20,
      status: 'active',
      statusText: '进行中',
      statusColor: 'bg-green-100 text-green-600',
      participants: 8,
      maxParticipants: 15,
      completed: 5,
      publishTime: '2024-01-15 10:20',
      deadline: '2024-01-20 23:59',
      description: '使用产品一周后发布使用心得'
    },
    {
      id: 3,
      title: '科技产品评测',
      category: '数码',
      price: 6.80,
      status: 'review',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      participants: 10,
      maxParticipants: 10,
      completed: 9,
      publishTime: '2024-01-14 16:45',
      deadline: '2024-01-17 23:59',
      description: '深度评测产品各项性能'
    },
    {
      id: 4,
      title: '旅游景点推荐',
      category: '旅游',
      price: 4.20,
      status: 'completed',
      statusText: '已完成',
      statusColor: 'bg-green-100 text-green-600',
      participants: 15,
      maxParticipants: 15,
      completed: 15,
      publishTime: '2024-01-12 09:00',
      deadline: '2024-01-15 23:59',
      description: '分享景点游玩攻略和体验'
    },
    {
      id: 5,
      title: '电影观后感',
      category: '影视',
      price: 3.80,
      status: 'paused',
      statusText: '已暂停',
      statusColor: 'bg-gray-100 text-gray-600',
      participants: 3,
      maxParticipants: 20,
      completed: 2,
      publishTime: '2024-01-13 20:15',
      deadline: '2024-01-25 23:59',
      description: '观看指定电影并分享观后感'
    },
    {
      id: 6,
      title: '直播带货推广',
      category: '直播',
      price: 8.00,
      status: 'review',
      statusText: '待审核',
      statusColor: 'bg-orange-100 text-orange-600',
      participants: 5,
      maxParticipants: 10,
      completed: 5,
      publishTime: '2024-01-16 09:00',
      deadline: '2024-01-19 23:59',
      description: '参与直播间互动并分享产品体验'
    }
  ];

  // 待审核的订单数据
  const pendingOrders = [
    {
      id: 101,
      taskTitle: '科技产品评测',
      commenterName: '评论员小王',
      submitTime: '2024-01-16 14:30',
      content: '这款手机的拍照功能确实不错，夜景模式很实用...',
      images: ['image1.jpg', 'image2.jpg'],
      status: 'pending'
    },
    {
      id: 102,
      taskTitle: '直播带货推广',
      commenterName: '评论员小李',
      submitTime: '2024-01-16 16:20',
      content: '直播间氛围很好，主播介绍很详细，产品质量不错...',
      images: ['image3.jpg'],
      status: 'pending'
    },
    {
      id: 103,
      taskTitle: '科技产品评测',
      commenterName: '评论员小张',
      submitTime: '2024-01-16 18:15',
      content: '产品包装精美，使用体验良好，性价比很高...',
      images: ['image4.jpg', 'image5.jpg'],
      status: 'pending'
    }
  ];

  // 根据时间范围获取统计数据
  const getStatsByTimeRange = (range: string) => {
    const baseStats = {
      totalTasks: myTasks.length,
      activeTasks: myTasks.filter(t => t.status === 'active').length,
      completedTasks: myTasks.filter(t => t.status === 'completed').length,
      totalSpent: myTasks.reduce((sum, task) => sum + (task.price * task.completed), 0),
      totalParticipants: myTasks.reduce((sum, task) => sum + task.participants, 0)
    };

    // 模拟不同时间范围的数据
    const multipliers = {
      today: { tasks: 0.2, spent: 0.15, participants: 0.3 },
      yesterday: { tasks: 0.3, spent: 0.25, participants: 0.4 },
      week: { tasks: 0.8, spent: 0.7, participants: 0.85 },
      month: { tasks: 1, spent: 1, participants: 1 }
    };

    const multiplier = multipliers[range as keyof typeof multipliers] || multipliers.today;
    
    return {
      totalTasks: Math.ceil(baseStats.totalTasks * multiplier.tasks),
      activeTasks: Math.ceil(baseStats.activeTasks * multiplier.tasks),
      completedTasks: Math.ceil(baseStats.completedTasks * multiplier.tasks),
      totalSpent: baseStats.totalSpent * multiplier.spent,
      totalParticipants: Math.ceil(baseStats.totalParticipants * multiplier.participants)
    };
  };

  const stats = getStatsByTimeRange(statsTimeRange);

  // 派发的任务列表（替换最近活动）
  const dispatchedTasks = [
    { id: 1, title: '美食探店推广', status: 'active', statusText: '进行中', participants: 12, maxParticipants: 20, time: '2小时前' },
    { id: 2, title: '护肤产品体验', status: 'active', statusText: '进行中', participants: 8, maxParticipants: 15, time: '4小时前' },
    { id: 3, title: '科技产品评测', status: 'review', statusText: '待审核', participants: 10, maxParticipants: 10, time: '1天前' },
    { id: 4, title: '旅游景点推荐', status: 'completed', statusText: '已完成', participants: 15, maxParticipants: 15, time: '2天前' },
    { id: 5, title: '电影观后感', status: 'paused', statusText: '已暂停', participants: 3, maxParticipants: 20, time: '3天前' }
  ];

  const getTasksByStatus = (status: string) => {
    return myTasks.filter(task => task.status === status);
  };

  const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else if (sortBy === 'price') {
        return b.price - a.price;
      }
      return 0;
    });
  };

  const handleTaskAction = (taskId: number, action: string) => {
    alert(`对任务 ${taskId} 执行 ${action} 操作`);
  };

  const handleOrderReview = (orderId: number, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? '通过' : '驳回';
    alert(`${actionText}订单 ${orderId}`);
  };

  return (
    <div className="pb-20">
      {/* 状态切换 */}
      <div className="mx-4 mt-4 grid grid-cols-4 gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          概览
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`py-3 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === 'active' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          进行中
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === 'audit' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          审核任务
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-3 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === 'completed' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          已完成
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 数据概览 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">我的数据</h3>
                {/* 时间范围切换 */}
                <div className="flex bg-gray-100 rounded-lg p-2">
                  <button
                    onClick={() => setStatsTimeRange('today')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      statsTimeRange === 'today' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    今天
                  </button>
                  <button
                    onClick={() => setStatsTimeRange('yesterday')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      statsTimeRange === 'yesterday' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    昨天
                  </button>
                  <button
                    onClick={() => setStatsTimeRange('week')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      statsTimeRange === 'week' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    本周
                  </button>
                  <button
                    onClick={() => setStatsTimeRange('month')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      statsTimeRange === 'month' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    本月
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{stats.totalTasks}</div>
                  <div className="text-xs text-green-700">总任务数</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.activeTasks}</div>
                  <div className="text-xs text-blue-700">进行中</div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">¥{stats.totalSpent.toFixed(2)}</div>
                  <div className="text-xs text-orange-700">总投入</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.totalParticipants}</div>
                  <div className="text-xs text-purple-700">参与人数</div>
                </div>
              </div>
            </div>
          </div>

          {/* 派发的任务列表 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">派发的任务</h3>
              </div>
              <div className="divide-y max-h-64 overflow-y-auto">
                {dispatchedTasks.map((task) => (
                  <div key={task.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="text-sm font-medium text-gray-800">
                            {task.title}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.status === 'active' ? 'bg-green-100 text-green-600' :
                            task.status === 'review' ? 'bg-orange-100 text-orange-600' :
                            task.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {task.statusText}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          参与: {task.participants}/{task.maxParticipants} 人 · {task.time}
                        </div>
                        <div className="bg-gray-200 h-1 rounded">
                          <div 
                            className="bg-green-500 h-1 rounded" 
                            style={{width: `${(task.participants / task.maxParticipants) * 100}%`}}
                          ></div>
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
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">快捷操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-100 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                  ➕ 发布新任务
                </button>
                <button className="bg-blue-100 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                  📈 查看统计
                </button>
                <button className="bg-blue-100 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                  💰 财务管理
                </button>
                <button className="bg-blue-100 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                  👤 个人中心
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 审核任务页面 */}
      {activeTab === 'audit' && (
        <>
          <div className="mx-4 mt-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">待审核的订单</h3>
            <span className="text-sm text-gray-500">共 {pendingOrders.length} 个订单</span>
          </div>

          <div className="mx-4 mt-4">
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                  {/* 订单头部 */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{order.taskTitle}</h4>
                      <p className="text-sm text-gray-600">评论员: {order.commenterName}</p>
                      <p className="text-xs text-gray-500">提交时间: {order.submitTime}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-600">
                      待审核
                    </span>
                  </div>

                  {/* 提交内容 */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">提交内容:</h5>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                      {order.content}
                    </div>
                  </div>

                  {/* 图片附件 */}
                  {order.images.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">图片附件:</h5>
                      <div className="flex space-x-2">
                        {order.images.map((image, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            🖼️
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 审核按钮 */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOrderReview(order.id, 'approve')}
                      className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition-colors text-sm"
                    >
                      ✅ 通过审核
                    </button>
                    <button
                      onClick={() => handleOrderReview(order.id, 'reject')}
                      className="flex-1 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition-colors text-sm"
                    >
                      ❌ 驳回订单
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(activeTab === 'active' || activeTab === 'completed') && (
        <>
          {/* 排序选择 */}
          <div className="mx-4 mt-6 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">
              {activeTab === 'active' && '进行中的任务'}
              {activeTab === 'completed' && '已完成的任务'}
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="time">按时间排序</option>
              <option value="price">按价格排序</option>
              <option value="status">按状态排序</option>
            </select>
          </div>

          {/* 任务列表 */}
          <div className="mx-4 mt-4">
            <div className="space-y-4">
              {sortTasks(getTasksByStatus(activeTab)).map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
                  {/* 任务头部信息 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-800">{task.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${task.statusColor}`}>
                          {task.statusText}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>分类：{task.category} | 价格：¥{task.price}</div>
                        <div>发布时间：{task.publishTime}</div>
                        <div>截止时间：{task.deadline}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ¥{task.price.toFixed(2)}
                    </div>
                  </div>

                  {/* 任务描述 */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {task.description}
                    </div>
                  </div>

                  {/* 参与情况 */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">参与情况</span>
                      <span className="text-sm text-gray-800">
                        {task.participants}/{task.maxParticipants} 人
                      </span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded">
                      <div 
                        className="bg-green-500 h-2 rounded" 
                        style={{width: `${(task.participants / task.maxParticipants) * 100}%`}}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      已完成：{task.completed}/{task.participants} 人
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    {task.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleTaskAction(task.id, '暂停')}
                          className="flex-1 bg-orange-500 text-white py-2 rounded font-medium hover:bg-orange-600 transition-colors text-sm"
                        >
                          暂停任务
                        </button>
                        <button
                          onClick={() => handleTaskAction(task.id, '编辑')}
                          className="flex-1 bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors text-sm"
                        >
                          编辑任务
                        </button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <>
                        <button
                          onClick={() => handleTaskAction(task.id, '查看报告')}
                          className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition-colors text-sm"
                        >
                          查看报告
                        </button>
                        <button
                          onClick={() => handleTaskAction(task.id, '复制任务')}
                          className="flex-1 bg-gray-500 text-white py-2 rounded font-medium hover:bg-gray-600 transition-colors text-sm"
                        >
                          复制任务
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}