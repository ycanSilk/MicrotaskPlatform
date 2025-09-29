'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 定义数据类型
interface Task {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string; // 现在直接使用JSON文件中的状态值
  statusText: string; // 用于显示中文状态
  statusColor: string;
  participants: number;
  maxParticipants: number;
  completed: number;
  inProgress: number; // 添加进行中的数量
  pending: number; // 添加待抢单的数量
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
  status: string; // 添加状态字段
  orderNumber?: string; // 添加可选的订单号字段
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
  pendingReview?: number; // 添加待审核的数量
  price: number; // 添加单价字段
  orderNumber: string; // 添加订单号字段
  taskType: string; // 添加任务类型字段
  taskRequirements: string; // 添加任务需求字段
}

interface Stats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalSpent: number;
  totalInProgressSubOrders: number; // 进行中的子订单总数量
  totalCompletedSubOrders: number; // 已完成的子订单数量
  totalPendingReviewSubOrders: number; // 待审核的子订单数量
  totalPendingSubOrders: number; // 待抢单的子订单数量
  averageOrderValue: number; // 平均客单价
}

export default function PublisherDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'status' | 'price'
  const [statsTimeRange, setStatsTimeRange] = useState('all'); // 'today' | 'yesterday' | 'week' | 'month' | 'all'
  const [refreshFlag, setRefreshFlag] = useState(0); // 用于触发数据刷新的状态变量
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalSpent: 0,
    totalInProgressSubOrders: 0, // 进行中的子订单总数量
    totalCompletedSubOrders: 0, // 已完成的子订单数量
    totalPendingReviewSubOrders: 0, // 待审核的子订单数量
    totalPendingSubOrders: 0, // 待抢单的子订单数量
    averageOrderValue: 0 // 平均客单价
  });
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [dispatchedTasks, setDispatchedTasks] = useState<DispatchedTask[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]); // 进行中的任务
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]); // 已完成的任务
  
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
            const token = localStorage.getItem('publisher_auth_token');
            if (token) {
              authToken = token;
              console.log('获取到发布者认证token:', token);
            } else {
              console.log('未找到发布者认证token');
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
        
        // 获取仪表板数据
        const response = await fetch(`/api/publisher/dashboard?timeRange=${statsTimeRange}`, {
          headers,
          // 添加缓存控制选项
          cache: 'no-store',
          next: { revalidate: 0 }
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
          
          // 调试：检查活动任务和已完成任务的状态值
          console.log('活动任务详情:', result.data.activeTasks);
          result.data.activeTasks.forEach((task: any, index: number) => {
            console.log(`活动任务[${index}] ID: ${task.id}, 状态: ${task.status}, 标题: ${task.title}`);
          });
          
          console.log('已完成任务详情:', result.data.completedTasks);
          result.data.completedTasks.forEach((task: any, index: number) => {
            console.log(`已完成任务[${index}] ID: ${task.id}, 状态: ${task.status}, 标题: ${task.title}`);
          });
          
          setStats(result.data.stats);
          setMyTasks([...result.data.activeTasks, ...result.data.completedTasks]);
          setPendingOrders(result.data.pendingOrders);
          setDispatchedTasks(result.data.dispatchedTasks);
          
          // 设置进行中和已完成的任务
          setActiveTasks(result.data.activeTasks);
          setCompletedTasks(result.data.completedTasks);
          
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
  }, [statsTimeRange, activeTab, refreshFlag]); // 添加refreshFlag到依赖数组

  // 根据时间范围获取统计数据
  const getStatsByTimeRange = (range: string) => {
    // 这个函数现在主要用于初始化，实际数据从API获取
    return stats;
  };

  const getTasksByStatus = (status: string) => {
    if (status === 'active') {
      return activeTasks;
    } else if (status === 'completed') {
      return completedTasks;
    }
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
    console.log(`[仪表盘调试] 开始处理任务操作 - 任务ID: ${taskId}, 操作: ${action}`);
    
    if (action === '查看详情') {
      console.log(`[仪表盘调试] 准备查看任务详情 - 当前活动标签: ${activeTab}`);
      
      // 详细记录任务ID信息
      console.log(`[仪表盘调试] 任务ID类型: ${typeof taskId}`);
      console.log(`[仪表盘调试] 任务ID值: ${taskId}`);
      console.log(`[仪表盘调试] 任务ID长度: ${taskId.length}`);
      console.log(`[仪表盘调试] 任务ID是否为空: ${!taskId}`);
      
      // 确保taskId是有效的字符串
      if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        console.error(`[仪表盘调试] 无效的任务ID:`, { taskId, type: typeof taskId });
        alert(`无法查看任务详情：任务ID无效`);
        return;
      }
      
      // 构建目标URL
      const encodedTaskId = encodeURIComponent(taskId);
      const url = `/publisher/dashboard/task-detail?id=${encodedTaskId}`;
      
      console.log(`[仪表盘调试] 构建的目标URL: ${url}`);
      console.log(`[仪表盘调试] 编码后的任务ID: ${encodedTaskId}`);
      
      try {
        // 记录导航前的状态
        console.log(`[仪表盘调试] 开始导航到任务详情页`);
        console.log(`[仪表盘调试] 当前路由路径: ${typeof window !== 'undefined' ? window.location.pathname : '服务器端渲染'}`);
        
        // 执行导航
        // Using type assertion to fix Next.js 14 router push type issue
        router.push(url as unknown as never);
        
        console.log(`[仪表盘调试] 导航操作已成功触发`);
        
        // 查找当前点击的任务详情进行记录
        const currentTask = activeTab === 'active' 
          ? activeTasks.find(task => task.id === taskId) 
          : myTasks.find(task => task.id === taskId);
        
        if (currentTask) {
          console.log(`[仪表盘调试] 导航的任务详情:`, {
            id: currentTask.id,
            title: currentTask.title,
            status: currentTask.status,
            statusText: currentTask.statusText
          });
        } else {
          console.warn(`[仪表盘调试] 未在当前任务列表中找到ID为${taskId}的任务`);
        }
        
      } catch (error) {
        console.error(`[仪表盘调试] 导航到任务详情页时出错:`, error);
        alert(`导航到任务详情页失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.log(`[仪表盘调试] 执行非查看详情操作: ${action}`);
      alert(`对任务 ${taskId} 执行 ${action} 操作`);
    }
    
    console.log(`[仪表盘调试] 任务操作处理完成 - 任务ID: ${taskId}, 操作: ${action}`);
  };

  const handleOrderReview = async (orderId: string, action: 'approve' | 'reject') => {
    console.log(`开始处理订单审核: orderId=${orderId}, action=${action}`);
    
    // 弹出确认提示
    const actionText = action === 'approve' ? '通过审核' : '驳回订单';
    const confirmed = window.confirm(`确定要${actionText}这个订单吗？`);
    
    // 如果用户点击取消，则不执行操作
    if (!confirmed) {
      console.log(`用户取消了${actionText}操作`);
      return;
    }
    
    try {
      console.log(`用户确认${actionText}操作，开始发送API请求`);
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
        
        // 触发数据重新加载
        setRefreshFlag(prev => prev + 1);
      } else {
        console.error('审核操作失败:', result.message);
        alert(`操作失败: ${result.message}`);
      }
    } catch (error) {
      console.error('审核订单失败:', error);
      alert('审核订单时发生错误');
    }
  };

  // 图片查看功能 - 增强支持放大查看
  const openImageViewer = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setImageViewerOpen(true);
    setScale(1); // 重置缩放比例
    setPosition({ x: 0, y: 0 }); // 重置位置
    setIsDragging(false); // 重置拖拽状态
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setCurrentImage('');
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // 图片放大相关状态
  const [scale, setScale] = useState(1); // 缩放比例
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 图片位置
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖拽
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }); // 拖拽开始位置

  // 处理鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // 滚轮向下为缩小，向上为放大
    setScale(prevScale => {
      const newScale = Math.max(0.1, Math.min(5, prevScale + delta)); // 限制缩放范围0.1-5倍
      return newScale;
    });
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 处理拖拽移动
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 放大图片
  const zoomIn = () => {
    setScale(prevScale => Math.min(5, prevScale + 0.1));
  };

  // 缩小图片
  const zoomOut = () => {
    setScale(prevScale => Math.max(0.1, prevScale - 0.1));
  };

  // 重置图片
  const resetImage = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
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
                  <div className="text-lg font-bold text-purple-600">¥{stats.averageOrderValue.toFixed(2)}</div>
                  <div className="text-xs text-purple-700">平均客单价</div>
                </div>
              </div>
            </div>
          </div>

          {/* 新增的子订单统计数据 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">子订单统计</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.totalInProgressSubOrders}</div>
                  <div className="text-xs text-blue-700">进行中</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{stats.totalCompletedSubOrders}</div>
                  <div className="text-xs text-green-700">已完成</div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">{stats.totalPendingReviewSubOrders}</div>
                  <div className="text-xs text-orange-700">待审核</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-600">{stats.totalPendingSubOrders || 0}</div>
                  <div className="text-xs text-yellow-700">待领取</div>
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
                {dispatchedTasks.slice(0, 10).map((task, index) => (
                    <div key={`dispatched-${task.id}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="text-sm font-medium text-gray-800">
                            任务需求：{task.taskRequirements}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.status === 'main_progress' ? 'bg-green-100 text-green-600' :
                            task.status === 'main_completed' ? 'bg-green-100 text-green-600' :
                            'bg-green-100 text-green-600' // 默认状态也设为进行中
                          }`}>
                            {task.statusText}
                          </span>
                        </div>
                        {/* 新增主任务订单号显示 */}
                        <div className="text-xs text-gray-500 mb-1">
                          订单号: {task.orderNumber || 'N/A'}
                        </div>
                        {/* 新增任务类型信息展示 */}
                        <div className="text-xs text-gray-500 mb-1">
                          任务类型: {(() => {
                            const taskTypeMap: Record<string, string> = {
                              'comment_middle': '评论任务',
                              'account_rental': '租号任务',
                              'video_send': '视频推送任务'
                            };
                            return taskTypeMap[task.taskType] || task.taskType;
                          })()}
                        </div>
                        {/* 修改发布时间显示，换行并添加标识 */}
                        <div className="text-xs text-gray-600 mb-1">
                          发布时间：
                          {new Date(task.time).toLocaleString('zh-CN')}
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-gray-600">
                            完成: {task.completed} | 进行中: {task.inProgress} | 待领取: {task.pending} | 待审核: {task.pendingReview || 0} | 总计: {task.maxParticipants} 条
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm">
                            <span className="text-gray-600">订单单价:</span>
                            <span className="font-medium text-gray-800"> ¥{typeof task.price === 'number' ? task.price.toFixed(2) : '0.00'}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">总金额:</span>
                            <span className="font-medium text-gray-800"> 
                              ¥{typeof task.price === 'number' && typeof task.maxParticipants === 'number' ? (task.price * task.maxParticipants).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                        {/* 在进度条上添加百分比数值显示 */}
                        <div className="relative bg-green-200 h-5 rounded">
                          <div 
                            className="bg-green-500 h-5 rounded" 
                            style={{width: `${task.maxParticipants > 0 ? (task.participants / task.maxParticipants) * 100 : 0}%`}}
                          ></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-800">
                            {task.maxParticipants > 0 ? Math.round((task.participants / task.maxParticipants) * 100) : 0}%
                          </div>
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

      {/* 审核任务页面 */}
      {activeTab === 'audit' && (
        <div className="mx-4 mt-6 space-y-4">
          {/* 标题和统计信息 */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">待审核的订单</h3>
            <span className="text-sm text-gray-500">共 {pendingOrders.length} 个订单</span>
          </div>
          
          {/* 子订单列表 - 直接展示订单详情内容 */}
          {pendingOrders.map((order, index) => (
            <div key={`pending-${order.id}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-sm font-medium text-gray-800">
                  任务需求：{order.taskTitle}
                </div>
                <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-600">
                  待审核
                </span>
              </div>
              
              {/* 订单号显示 - 显示"订单号"字段而非"id"字段 */}
              <div className="text-xs text-gray-500 mb-1">
                订单号: {order.orderNumber || order.id}
              </div>
              
              {/* 领取用户信息展示 */}
              <div className="text-xs text-gray-500 mb-1">
                领取用户: {order.commenterName}
              </div>
              
              {/* 提交时间显示 */}
              <div className="text-xs text-gray-600 mb-2">
                提交时间：
                {new Date(order.submitTime).toLocaleString('zh-CN')}
              </div>

              {/* 提交内容 */}
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-700 mb-1">提交内容:</h5>
                <div className="bg-white p-3 rounded text-sm text-gray-700 border border-gray-200">
                  {order.content}
                </div>
              </div>

              {/* 图片附件 - 恢复上传截图的显示功能 */}
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-700 mb-1">上传截图:</h5>
                {order.images && order.images.length > 0 ? (
                  <div className="flex space-x-2 flex-wrap">
                    {order.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden shadow-sm"
                        onClick={() => openImageViewer(image)}
                      >
                        <img 
                          src={image} 
                          alt={`上传截图 ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // 防止无限循环
                            target.src = '/images/20250916161008.png';
                            target.alt = `图片加载失败 ${index + 1}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 border border-gray-200">
                    暂无上传截图
                  </div>
                )}
              </div>

              {/* 审核按钮 */}
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => handleOrderReview(order.id, 'approve')}
                  className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  disabled={order.status === 'completed' || order.status === 'approved'}
                >
                  ✅ 通过审核
                </button>
                <button
                  onClick={() => handleOrderReview(order.id, 'reject')}
                  className={`flex-1 py-2 rounded font-medium transition-colors text-sm ${order.status === 'completed' || order.status === 'approved' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  disabled={order.status === 'completed' || order.status === 'approved'}
                >
                  ❌ 驳回订单
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'active' || activeTab === 'completed') && (
        <div className="mx-4 mt-6 space-y-4">
          {/* 排序选择和查看全部历史订单按钮 */}
          <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                {activeTab === 'active' && '进行中的任务'}
                {activeTab === 'completed' && '已完成的任务'}
              </h3>
              <div className="flex items-center">
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
            </div>
          
          {/* 订单列表 - 直接展示订单详情内容 */}
          {sortTasks(getTasksByStatus(activeTab)).map((task, index) => (
            <div key={`task-${task.id}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-sm font-medium text-gray-800">
                      任务需求：{task.description}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${task.statusColor}`}>
                      {task.statusText}
                    </span>
                  </div>
                  {/* 主任务订单号显示 */}
                  <div className="text-xs text-gray-500 mb-1 flex items-center">
                    订单号: {task.id}
                    <button 
                      className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(task.id).then(() => {
                          // 创建临时提示元素
                          const tooltip = document.createElement('div');
                          tooltip.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
                          tooltip.innerText = '订单号已复制';
                          document.body.appendChild(tooltip);
                          // 2秒后移除提示
                          setTimeout(() => {
                            document.body.removeChild(tooltip);
                          }, 2000);
                        }).catch(err => {
                          console.error('复制失败:', err);
                        });
                      }}
                    >
                      复制
                    </button>
                  </div>
                  {/* 任务类型信息展示 */}
                  <div className="text-xs text-gray-500 mb-1">
                    任务类型: {task.category || '评论任务'}
                  </div>
                  {/* 修改发布时间显示，换行并添加标识 */}
                  <div className="text-xs text-gray-600 mb-1">
                    发布时间：
                    {new Date(task.publishTime).toLocaleString('zh-CN')}
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-600">
                      完成: {task.completed} | 进行中: {task.inProgress} | 待领取: {task.pending || 0} | 总计: {task.maxParticipants} 条
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm">
                      <span className="text-gray-600">订单单价:</span>
                      <span className="font-medium text-gray-800"> ¥{task.price.toFixed(2)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">总金额:</span>
                      <span className="font-medium text-gray-800"> 
                        ¥{(task.price * task.maxParticipants).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {/* 在进度条上添加百分比数值显示 */}
                  <div className="relative bg-green-200 h-5 rounded">
                    <div 
                      className="bg-green-500 h-5 rounded" 
                      style={{width: `${task.maxParticipants > 0 ? (task.participants / task.maxParticipants) * 100 : 0}%`}}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-800">
                      {task.maxParticipants > 0 ? Math.round((task.participants / task.maxParticipants) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 - 宽度设置为100% */}
              <div className="mt-3">
                <button
                  onClick={() => handleTaskAction(task.id, '查看详情')}
                  className="w-full py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors text-sm"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 图片查看器模态框 - 支持放大查看 */}
      {imageViewerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageViewer}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            {/* 关闭按钮 */}
            <button
              onClick={closeImageViewer}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
              style={{ right: 'calc(50% - 200px)' }}
            >
              ✕
            </button>
            
            {/* 缩放控制按钮 */}
            <div className="absolute top-0 left-0 flex space-x-2 p-2 z-10 bg-black bg-opacity-50 rounded">
              <button 
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
                title="放大"
              >
                🔍+
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
                title="缩小"
              >
                🔍-
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); resetImage(); }}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
                title="重置"
              >
                🔄
              </button>
            </div>
            
            {/* 缩放比例显示 */}
            <div className="absolute top-0 right-0 p-2 text-white font-medium bg-black bg-opacity-50 rounded">
              {Math.round(scale * 100)}%
            </div>
            
            {/* 可缩放拖拽的图片 */}
            <div 
              className="flex items-center justify-center"
              style={{ overflow: 'hidden', height: '80vh' }}
            >
              <img 
                src={currentImage} 
                alt="查看图片" 
                className="transition-transform duration-100 cursor-grab active:cursor-grabbing"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  maxHeight: 'none',
                  maxWidth: 'none'
                }}
                onWheel={handleWheel}
                onMouseDown={handleDragStart}
                onClick={(e) => e.stopPropagation()}
                onLoad={(e) => {
                  // 图片加载完成后的处理
                  const img = e.currentTarget;
                  // 可以在这里添加一些图片加载后的逻辑
                }}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.src = '/images/20250916161008.png'; // 加载失败时显示的默认图片
                  img.alt = '图片加载失败';
                }}
              />
            </div>
            
            {/* 使用提示 */}
            <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm p-2 bg-black bg-opacity-50">
              提示：使用鼠标滚轮缩放，拖拽移动图片，或点击按钮控制
            </div>
          </div>
        </div>
      )}
    </div>
  );
}