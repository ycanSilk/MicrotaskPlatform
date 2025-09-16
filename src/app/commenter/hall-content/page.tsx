'use client';

import React, { useState, useEffect } from 'react';

export default function CommenterHallContentPage() {
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAutoOrderModal, setShowAutoOrderModal] = useState(false);
  const [autoOrderSettings, setAutoOrderSettings] = useState({
    enabled: false,
    minPrice: 3.0,
    maxPrice: 10.0,
    categories: ['美食', '数码', '美妆'],
    autoRefresh: true,
    refreshInterval: 30 // 秒
  });
  
  // 模拟任务数据
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: '美食探店推广',
      price: 3.50,
      category: '美食',
      remaining: '12/20',
      progress: 40,
      requirements: '评论 + 点赞 + 关注',
      rating: 2,
      badge: '热门',
      badgeColor: 'bg-red-500',
      publishTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      title: '科技产品评测',
      price: 6.80,
      category: '数码',
      remaining: '5/10',
      progress: 50,
      requirements: '深度评测 + 视频分享',
      rating: 3,
      badge: '高价',
      badgeColor: 'bg-green-500',
      publishTime: '2024-01-15 13:15'
    },
    {
      id: 3,
      title: '护肤心得分享',
      price: 2.80,
      category: '美妆',
      remaining: '8/15',
      progress: 60,
      requirements: '评论 + 点赞',
      rating: 1,
      badge: null,
      badgeColor: '',
      publishTime: '2024-01-15 12:45'
    },
    {
      id: 4,
      title: '旅游体验分享',
      price: 4.20,
      category: '旅游',
      remaining: '6/12',
      progress: 45,
      requirements: '图文分享 + 评论',
      rating: 2,
      badge: null,
      badgeColor: '',
      publishTime: '2024-01-15 11:30'
    },
    {
      id: 5,
      title: '热门电影评论',
      price: 3.60,
      category: '影视',
      remaining: '15/20',
      progress: 25,
      requirements: '观影评论 + 评分',
      rating: 1,
      badge: '新',
      badgeColor: 'bg-orange-500',
      publishTime: '2024-01-15 16:00'
    }
  ]);
  
  // 排序功能
  const sortTasks = (tasks: any[], sortBy: string, sortOrder: string) => {
    const sorted = [...tasks].sort((a, b) => {
      if (sortBy === 'time') {
        const timeA = new Date(a.publishTime).getTime();
        const timeB = new Date(b.publishTime).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else if (sortBy === 'price') {
        return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      }
      return 0;
    });
    return sorted;
  };
  
  // 刷新任务
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟新任务数据（这里可以调用真实API）
    const newTasks = tasks.map(task => ({
      ...task,
      publishTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }));
    
    setTasks(newTasks);
    setIsRefreshing(false);
  };
  
  // 自动刷新功能
  useEffect(() => {
    if (autoOrderSettings.enabled && autoOrderSettings.autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, autoOrderSettings.refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoOrderSettings.enabled, autoOrderSettings.autoRefresh, autoOrderSettings.refreshInterval]);
  
  // 获取排序后的任务
  const sortedTasks = sortTasks(tasks, sortBy, sortOrder);
  return (
    <div className="pb-32">
      {/* 排序功能按钮 */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">任务排序</h3>
          <button 
            onClick={() => setShowAutoOrderModal(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            ⚙️ 自动接单
          </button>
        </div>
        
        <div className="flex space-x-2">
          {/* 按时间排序 */}
          <button
            onClick={() => {
              if (sortBy === 'time') {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              } else {
                setSortBy('time');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
              sortBy === 'time' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span>🕰️</span>
            <span>发布时间</span>
            {sortBy === 'time' && (
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
          
          {/* 按价格排序 */}
          <button
            onClick={() => {
              if (sortBy === 'price') {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              } else {
                setSortBy('price');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
              sortBy === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span>💰</span>
            <span>单价</span>
            {sortBy === 'price' && (
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
          
          {/* 自动刷新状态显示 */}
          {autoOrderSettings.enabled && autoOrderSettings.autoRefresh && (
            <div className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-600 rounded-lg text-sm">
              <span className="animate-spin">🔄</span>
              <span>自动刷新</span>
            </div>
          )}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-800">全部任务 ({sortedTasks.length})</span>
          <div className="text-xs text-gray-500">
            最后更新: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {sortedTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800">{task.title}</h3>
              <div className="flex items-center space-x-1">
                {task.badge && (
                  <span className={`${task.badgeColor} text-white text-xs px-2 py-1 rounded`}>
                    {task.badge}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-bold text-orange-500">¥{task.price.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                🕰️ {task.publishTime}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-3">剩余 {task.remaining}</div>
            <div className="text-sm text-gray-600 mb-4">
              要求：{task.requirements}
            </div>
            
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              抢单
            </button>
          </div>
        ))}
      </div>
      
      {/* 任务提示 */}
      <div className="mx-4 mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">接单小贴士</h4>
            <p className="text-sm text-blue-600">
              新任务每日上午10点和下午3点更新，高价值任务数量有限，建议及时关注并抢单。
            </p>
          </div>
        </div>
      </div>
      
      {/* 固定在底部的刷新按钮 */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t px-4 py-3 shadow-lg">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
            isRefreshing 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className={isRefreshing ? 'animate-spin' : ''}>
              {isRefreshing ? '🔄' : '🔄'}
            </span>
            <span>{isRefreshing ? '刷新中...' : '刷新代抢订单'}</span>
          </div>
        </button>
      </div>
      
      {/* 自动接单设置模态框 */}
      {showAutoOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">自动接单设置</h3>
                <button 
                  onClick={() => setShowAutoOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* 开启/关闭自动接单 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">启用自动接单</div>
                  <div className="text-sm text-gray-500">自动抢符合条件的任务</div>
                </div>
                <button
                  onClick={() => setAutoOrderSettings(prev => ({...prev, enabled: !prev.enabled}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    autoOrderSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                    autoOrderSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {autoOrderSettings.enabled && (
                <>
                  {/* 价格范围设置 */}
                  <div>
                    <div className="font-medium text-gray-800 mb-3">价格范围</div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">最低价格（元）</label>
                        <input
                          type="number"
                          step="0.1"
                          value={autoOrderSettings.minPrice}
                          onChange={(e) => setAutoOrderSettings(prev => ({...prev, minPrice: parseFloat(e.target.value) || 0}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">最高价格（元）</label>
                        <input
                          type="number"
                          step="0.1"
                          value={autoOrderSettings.maxPrice}
                          onChange={(e) => setAutoOrderSettings(prev => ({...prev, maxPrice: parseFloat(e.target.value) || 0}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 分类选择 */}
                  <div>
                    <div className="font-medium text-gray-800 mb-3">任务分类</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['美食', '数码', '美妆', '旅游', '影视', '运动'].map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            const updatedCategories = autoOrderSettings.categories.includes(category)
                              ? autoOrderSettings.categories.filter(c => c !== category)
                              : [...autoOrderSettings.categories, category];
                            setAutoOrderSettings(prev => ({...prev, categories: updatedCategories}));
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            autoOrderSettings.categories.includes(category)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 自动刷新设置 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-800">自动刷新</div>
                        <div className="text-sm text-gray-500">定时刷新任务列表</div>
                      </div>
                      <button
                        onClick={() => setAutoOrderSettings(prev => ({...prev, autoRefresh: !prev.autoRefresh}))}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          autoOrderSettings.autoRefresh ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                          autoOrderSettings.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    {autoOrderSettings.autoRefresh && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">刷新间隔（秒）</label>
                        <select
                          value={autoOrderSettings.refreshInterval}
                          onChange={(e) => setAutoOrderSettings(prev => ({...prev, refreshInterval: parseInt(e.target.value)}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={10}>10秒</option>
                          <option value={30}>30秒</option>
                          <option value={60}>1分钟</option>
                          <option value={120}>2分钟</option>
                          <option value={300}>5分钟</option>
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={() => setShowAutoOrderModal(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}