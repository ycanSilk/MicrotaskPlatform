'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 定义数据类型
interface Task {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  statusText: string;
  statusColor: string;
  participants: number;
  maxParticipants: number;
  completed: number;
  publishTime: string;
  deadline: string;
  description: string;
}

interface PendingOrder {
  id: string;
  taskTitle: string;
  commenterName: string;
  submitTime: string;
  content: string;
  images: string[];
}

interface DispatchedTask {
  id: string;
  title: string;
  status: string;
  statusText: string;
  participants: number;
  maxParticipants: number;
  time: string;
  completed: number;
  inProgress: number; // 添加进行中的数量
  pending: number; // 添加待抢单的数量
  price: number; // 添加单价字段
}

interface Stats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalSpent: number;
  totalParticipants: number;
}

export default function PublisherDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'status' | 'price'
  const [statsTimeRange, setStatsTimeRange] = useState('all'); // 'today' | 'yesterday' | 'week' | 'month' | 'all'
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalSpent: 0,
    totalParticipants: 0
  });
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [dispatchedTasks, setDispatchedTasks] = useState<DispatchedTask[]>([]);
  
  // 图片查看器状态
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // 获取仪表板数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log(`正在获取仪表板数据，时间范围: ${statsTimeRange}`);
        
        // 获取认证token
        let authToken = null;
        if (typeof window !== 'undefined') {
          try {
            const token = localStorage.getItem('auth_token');
            if (token) {
              authToken = token;
              console.log('获取到认证token:', token);
            } else {
              console.log('未找到认证token');
            }
          } catch (e) {
            console.log('获取认证token失败:', e);
          }
        }
        
        // 构建请求头
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
          console.log('设置Authorization头:', headers['Authorization']);
        }
        
        const response = await fetch(`/api/publisher/dashboard?timeRange=${statsTimeRange}`, {
          headers
        });
        const result = await response.json();
        console.log('API响应:', result);
        
        if (result.success) {
          console.log('统计数据:', result.data.stats);
          console.log('活动任务数量:', result.data.activeTasks.length);
          console.log('已完成任务数量:', result.data.completedTasks.length);
          console.log('待审核订单数量:', result.data.pendingOrders.length);
          console.log('派发任务数量:', result.data.dispatchedTasks.length);
          console.log('派发任务详情:', result.data.dispatchedTasks); // 添加这行来查看派发任务的详细信息
          
          // 检查派发任务中的价格信息
          result.data.dispatchedTasks.forEach((task: any, index: number) => {
            console.log(`派发任务[${index}] ID: ${task.id}, 价格: ${task.price}, 数量: ${task.maxParticipants}`);
          });
          
          setStats(result.data.stats);
          setMyTasks([...result.data.activeTasks, ...result.data.completedTasks]);
          setPendingOrders(result.data.pendingOrders);
          setDispatchedTasks(result.data.dispatchedTasks);
          console.log('数据更新完成');
        } else {
          console.error('API返回错误:', result.message);
        }
      } catch (error) {
        console.error('获取仪表板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [statsTimeRange]);

  // 根据时间范围获取统计数据
  const getStatsByTimeRange = (range: string) => {
    // 这个函数现在主要用于初始化，实际数据从API获取
    return stats;
  };

  const getTasksByStatus = (status: string) => {
    return myTasks.filter(task => task.status === status);
  };

  const sortTasks = (tasks: Task[]) => {
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

  const handleTaskAction = (taskId: string, action: string) => {
    console.log('handleTaskAction called with:', { taskId, action });
    if (action === '查看详情') {
      // 添加额外的调试信息
      console.log('Task ID type:', typeof taskId);
      console.log('Task ID value:', taskId);
      
      // 确保taskId是字符串且不为空
      if (!taskId || typeof taskId !== 'string') {
        console.error('Invalid taskId:', taskId);
        return;
      }
      
      const url = `/publisher/dashboard/task-detail?id=${encodeURIComponent(taskId)}`;
      try {
        // Using type assertion to fix Next.js 14 router push type issue
        router.push(url as unknown as never);
        console.log('Navigation initiated successfully');
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    } else {
      alert(`对任务 ${taskId} 执行 ${action} 操作`);
    }
  };

  const handleOrderReview = async (orderId: string, action: 'approve' | 'reject') => {
    console.log(`开始处理订单审核: orderId=${orderId}, action=${action}`);
    
    try {
      const response = await fetch('/api/publisher/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, action }),
      });
      
      console.log('API调用完成，状态码:', response.status);
      const result = await response.json();
      console.log('API返回结果:', result);
      
      if (result.success) {
        // 显示成功消息
        alert(result.message);
        console.log('审核操作成功');
        
        // 重新加载数据以反映状态更改
        console.log('开始重新加载仪表板数据');
        const dashboardResponse = await fetch(`/api/publisher/dashboard?timeRange=${statsTimeRange}`);
        const dashboardResult = await dashboardResponse.json();
        console.log('仪表板数据加载完成:', dashboardResult);
        
        if (dashboardResult.success) {
          setPendingOrders(dashboardResult.data.pendingOrders);
          setDispatchedTasks(dashboardResult.data.dispatchedTasks);
          console.log('状态已更新');
        }
      } else {
        console.error('审核操作失败:', result.message);
        alert(`操作失败: ${result.message}`);
      }
    } catch (error) {
      console.error('审核订单失败:', error);
      alert('审核订单时发生错误');
    }
  };

  // 图片查看功能
  const openImageViewer = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setCurrentImage('');
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="pb-20 flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

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
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">派发的任务</h3>
                  <button 
                    onClick={() => router.push('/publisher/tasks/history')}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    查看全部历史订单 →
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto p-4">
                {dispatchedTasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
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
                        <div className="text-xs text-gray-600 mb-3">
                          完成: {task.completed} | 进行中: {task.inProgress} | 待抢单: {task.pending} | 总计: {task.maxParticipants} 条 · {new Date(task.time).toLocaleString('zh-CN')}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm">
                            <span className="text-gray-600">子订单单价:</span>
                            <span className="font-medium text-gray-800"> ¥{typeof task.price === 'number' ? task.price.toFixed(2) : '0.00'}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">总金额:</span>
                            <span className="font-medium text-gray-800"> 
                              ¥{typeof task.price === 'number' && typeof task.maxParticipants === 'number' ? (task.price * task.maxParticipants).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-200 h-2 rounded">
                          <div 
                            className="bg-green-500 h-2 rounded" 
                            style={{width: `${task.maxParticipants > 0 ? (task.participants / task.maxParticipants) * 100 : 0}%`}}
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
                          <div 
                            key={index} 
                            className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden"
                            onClick={() => openImageViewer(image)}
                          >
                            <img 
                              src={image} 
                              alt={`附件图片 ${index + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/20250916161008.png';
                              }}
                            />
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
                      <button
                        onClick={() => handleTaskAction(task.id, '查看详情')}
                        className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition-colors text-sm"
                      >
                        查看详情
                      </button>
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
      
      {/* 图片查看器模态框 */}
      {imageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageViewer}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <img 
              src={currentImage} 
              alt="查看图片" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
