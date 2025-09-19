'use client';

import React, { useState, useEffect } from 'react';
import { CommenterAuthStorage } from '@/auth/commenter/auth';

export default function CommenterHallContentPage() {
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [grabbingTasks, setGrabbingTasks] = useState(new Set()); // 正在抢单的任务ID
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // 排序功能
  const sortTasks = (tasks: any[], sortBy: string, sortOrder: string) => {
    const sorted = [...tasks].sort((a, b) => {
      if (sortBy === 'time') {
        const timeA = new Date(a.publishTime).getTime();
        const timeB = new Date(b.publishTime).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else if (sortBy === 'price') {
        const priceA = typeof a.price === 'number' ? a.price : 0;
        const priceB = typeof b.price === 'number' ? b.price : 0;
        return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
      }
      return 0;
    });
    return sorted;
  };
  
  // 从API获取待领取订单
  const fetchAvailableTasks = async () => {
    try {
      const user = CommenterAuthStorage.getCurrentUser();
      if (!user) {
        // 如果未登录，显示空列表并提示登录
        console.log('未登录，无法获取订单');
        setTasks([]);
        setLastUpdated(new Date());
        if (!window.sessionStorage.getItem('loginHintShown')) {
          alert('请先登录以获取待领取订单');
          window.sessionStorage.setItem('loginHintShown', 'true');
        }
        return;
      }

      // 检查用户角色是否为评论员
      if (user.role !== 'commenter') {
        // 如果不是评论员角色，显示空列表并提示
        console.log('非评论员角色，无法获取订单');
        setTasks([]);
        setLastUpdated(new Date());
        // 仅提示一次，避免重复弹窗
        if (!window.sessionStorage.getItem('roleHintShown')) {
          alert('您不是评论员角色，无法获取待领取订单');
          window.sessionStorage.setItem('roleHintShown', 'true');
        }
        return;
      }

      // 获取认证信息以获取token
      const auth = CommenterAuthStorage.getAuth();
      if (!auth || !auth.token) {
        console.error('无法获取认证token');
        alert('认证信息无效，请重新登录');
        return;
      }

      console.log('调用API获取订单，使用token:', auth.token.substring(0, 20) + '...');
      
      const response = await fetch('/api/commenter/available-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });

      console.log('API响应状态:', response.status);
      
      const data = await response.json();
      console.log('API响应数据:', data);
      
      if (data.success) {
        // 为每个任务添加一些额外的显示信息
        const formattedTasks = data.data.map((task: any) => ({
          ...task,
          badge: typeof task.price === 'number' && task.price >= 5 ? '高价' : typeof task.progress === 'number' && task.progress < 30 ? '新' : null,
          badgeColor: typeof task.price === 'number' && task.price >= 5 ? 'bg-green-500' : typeof task.progress === 'number' && task.progress < 30 ? 'bg-orange-500' : ''
        }));
        setTasks(formattedTasks);
        setLastUpdated(new Date());
      } else {
        let errorMessage = data.message || '获取订单失败';
        // 根据不同的错误状态码提供更具体的提示
        if (response.status === 401) {
          errorMessage = '您没有权限访问此功能，请以评论员身份登录';
        }
        alert(`获取订单失败：${errorMessage}`);
      }
    } catch (error) {
      console.error('获取订单错误:', error);
      alert('获取订单时发生错误，请检查网络连接或稍后再试');
    }
  };

  // 刷新任务
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAvailableTasks();
    setIsRefreshing(false);
  };

  // 抢单功能
  const handleGrabTask = async (taskId: string) => {
    if (grabbingTasks.has(taskId)) return;

    try {
      const user = CommenterAuthStorage.getCurrentUser();
      if (!user) {
        alert('请先登录');
        return;
      }

      // 检查用户角色是否为评论员
      if (user.role !== 'commenter') {
        alert('您不是评论员角色，无法抢单');
        return;
      }

      // 获取认证信息以获取token
      const auth = CommenterAuthStorage.getAuth();
      if (!auth || !auth.token) {
        console.error('无法获取认证token');
        alert('认证信息无效，请重新登录');
        return;
      }

      setGrabbingTasks(prev => new Set(prev).add(taskId));

      console.log('调用抢单API，使用token:', auth.token.substring(0, 20) + '...');
      
      const response = await fetch('/api/commenter/available-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ taskId, userId: user.id })
      });

      console.log('抢单API响应状态:', response.status);
      
      const data = await response.json();
      console.log('抢单API响应数据:', data);
      
      if (data.success) {
        alert(data.message);
        // 抢单成功后立即刷新列表
        await fetchAvailableTasks();

        // 移除3分钟后检查是否需要释放订单的功能
        
      } else {
        let errorMessage = data.message || '抢单失败';
        // 根据不同的错误状态码提供更具体的提示
        if (response.status === 401) {
          errorMessage = '您没有权限抢单，请以评论员身份登录';
        }
        alert(`抢单失败：${errorMessage}`);
      }
    } catch (error) {
      console.error('抢单错误:', error);
      alert('抢单时发生错误，请检查网络连接或稍后再试');
    } finally {
      setGrabbingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // 移除定期检查超时订单的功能
  useEffect(() => {
    // 初始加载订单
    fetchAvailableTasks();
  }, []);
  
  // 获取排序后的任务
  const sortedTasks = sortTasks(tasks, sortBy, sortOrder);
  
  return (
    <div className="pb-32">
      {/* 排序功能按钮 */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">任务排序</h3>
          {/* 删除自动接单按钮 */}
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
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${sortBy === 'time' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
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
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${sortBy === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <span>💰</span>
            <span>单价</span>
            {sortBy === 'price' && (
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
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

        {sortedTasks.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="font-medium text-gray-800 mb-2">暂无待领取订单</h3>
            <p className="text-gray-500 text-sm mb-4">请稍后刷新或关注新发布的任务</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              立即刷新
            </button>
          </div>
        ) : (
          sortedTasks.map((task) => (
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
              <div className="text-lg font-bold text-orange-500">¥{typeof task.price === 'number' ? task.price.toFixed(2) : '0.00'}</div>
              <div className="text-xs text-gray-500">
                🕰️ {new Date(task.publishTime).toLocaleString()}
              </div>
            </div>
            
      
            <div className="text-sm text-gray-600 mb-4">
              要求：{task.requirements}
            </div>
            
            <button 
              className={`w-full py-3 rounded-lg font-medium transition-colors ${grabbingTasks.has(task.id) ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              onClick={() => handleGrabTask(task.id)}
              disabled={grabbingTasks.has(task.id)}
            >
              {grabbingTasks.has(task.id) ? '抢单中...' : '抢单'}
            </button>
            </div>
          ))
        )}
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
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${isRefreshing ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'}`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className={isRefreshing ? 'animate-spin' : ''}>
              {isRefreshing ? '🔄' : '🔄'}
            </span>
            <span>{isRefreshing ? '刷新中...' : '刷新代抢订单'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}