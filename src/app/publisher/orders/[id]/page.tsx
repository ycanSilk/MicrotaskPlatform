"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, Clock, Download, MessageSquare, Users, DollarSign, Calendar, FileText, Award, Share2, ThumbsUp } from 'lucide-react';
import { Order, SubOrder } from '../page';

// 订单详情页面组件
const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'suborders' | 'history'>('overview');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // 模拟获取订单详情数据
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // 在实际应用中，这里会调用API获取数据
        // const response = await fetch(`/api/publisher/orders/${orderId}`);
        // if (!response.ok) throw new Error('Failed to fetch order detail');
        // const data = await response.json();
        // setOrder(data);

        // 模拟数据
        const mockOrder: Order = {
          id: orderId,
          orderNumber: `ORD-${2023}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          title: `详细任务 ${Math.floor(Math.random() * 100)}`,
          description: `这是一个详细的任务描述，包含了具体的任务要求、执行标准、验收条件等信息。\n\n任务要求：\n1. 完成指定内容的评论/点赞/分享\n2. 按照规定格式提交截图证明\n3. 确保内容符合平台规范\n4. 在截止日期前完成任务\n\n注意事项：\n- 提交的内容必须真实有效\n- 截图必须清晰可见任务完成状态\n- 禁止使用作弊手段完成任务`,
          status: ['pending', 'processing', 'reviewing', 'completed', 'rejected', 'cancelled'][Math.floor(Math.random() * 6)] as Order['status'],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          budget: 100 + Math.floor(Math.random() * 900),
          assignedTo: Math.random() > 0.3 ? `用户${Math.floor(Math.random() * 100)}` : undefined,
          completionTime: Math.random() > 0.5 ? new Date().toISOString() : undefined,
          type: ['comment', 'like', 'share', 'other'][Math.floor(Math.random() * 4)] as Order['type'],
          subOrders: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, subIndex) => ({
            id: `suborder-${Date.now()}-${subIndex}`,
            orderId: orderId,
            userId: `user-${subIndex + 1}`,
            userName: `用户${subIndex + 1}`,
            status: ['pending', 'processing', 'reviewing', 'completed', 'rejected'][subIndex % 5] as SubOrder['status'],
            submitTime: subIndex < 8 ? new Date().toISOString() : undefined,
            reviewTime: subIndex < 6 ? new Date().toISOString() : undefined,
            reward: 10 + Math.floor(Math.random() * 90),
            content: subIndex % 2 === 0 ? '这是用户提交的详细内容示例。内容必须符合平台规范，真实有效。' : undefined,
            screenshots: subIndex % 3 === 0 ? ['https://picsum.photos/400/300?random=' + subIndex, 'https://picsum.photos/400/301?random=' + subIndex] : undefined,
          })),
        };

        setOrder(mockOrder);
      } catch (err) {
        setError('获取订单详情失败，请稍后重试。');
        console.error('Failed to fetch order detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  // 处理返回按钮点击
  const handleBack = () => {
    router.push('/publisher/orders');
  };

  // 处理审核操作
  const handleReview = (subOrderId: string, approve: boolean) => {
    // 在实际应用中，这里会调用API更新子订单状态
    alert(`${approve ? '通过' : '拒绝'}子订单 ${subOrderId}`);
  };

  // 处理导出订单
  const handleExport = () => {
    // 导出订单的逻辑
    alert('导出订单详情功能将在后续实现');
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取状态对应的中文名称和样式
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; className: string; icon: React.ReactNode }> = {
      pending: { text: '待处理', className: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      processing: { text: '进行中', className: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
      reviewing: { text: '审核中', className: 'bg-purple-100 text-purple-800', icon: <Clock className="h-4 w-4" /> },
      completed: { text: '已完成', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
      rejected: { text: '已拒绝', className: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
      cancelled: { text: '已取消', className: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-4 w-4" /> }
    };
    return statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-4 w-4" /> };
  };

  // 获取任务类型对应的图标和文本
  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { text: string; icon: React.ReactNode; className: string }> = {
      comment: { text: '评论任务', icon: <MessageSquare className="h-5 w-5" />, className: 'text-blue-500' },
      like: { text: '点赞任务', icon: <ThumbsUp className="h-5 w-5" />, className: 'text-red-500' },
      share: { text: '分享任务', icon: <Share2 className="h-5 w-5" />, className: 'text-green-500' },
      other: { text: '其他任务', icon: <FileText className="h-5 w-5" />, className: 'text-gray-500' }
    };
    return typeMap[type] || { text: '未知类型', icon: <FileText className="h-5 w-5" />, className: 'text-gray-500' };
  };

  // 计算子订单统计信息
  const getSubOrderStats = () => {
    if (!order) return { total: 0, pending: 0, processing: 0, reviewing: 0, completed: 0, rejected: 0 };
    
    const stats = {
      total: order.subOrders.length,
      pending: 0,
      processing: 0,
      reviewing: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0
    };

    order.subOrders.forEach(subOrder => {
      stats[subOrder.status]++;
    });

    return stats;
  };

  // 计算完成进度
  const getCompletionRate = () => {
    const stats = getSubOrderStats();
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-md w-24"></div>
            <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded-md"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded-md"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回订单列表
          </button>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-gray-700 text-lg font-medium">{error || '订单不存在或已被删除'}</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回订单列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getSubOrderStats();
  const completionRate = getCompletionRate();
  const typeInfo = getTypeInfo(order.type);
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回订单列表
          </button>

          {/* 订单头部信息 */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${statusInfo.className}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.text}</span>
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.className}`}>
                    {typeInfo.icon}
                    <span className="ml-1">{typeInfo.text}</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{order.title}</h1>
                <p className="text-sm text-gray-500">订单号: {order.orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  导出订单
                </button>
              </div>
            </div>

            {/* 任务描述 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">任务描述</h2>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-line">
                {order.description}
              </div>
            </div>

            {/* 订单进度 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">完成进度</h2>
                <span className="text-sm font-medium text-blue-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-500 mb-1">总预算</div>
                <div className="text-2xl font-bold text-gray-900">¥{order.budget.toFixed(2)}</div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="text-sm font-medium text-green-500 mb-1">子订单总数</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-500 mb-1">待审核</div>
                <div className="text-2xl font-bold text-gray-900">{stats.reviewing}</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <div className="text-sm font-medium text-indigo-500 mb-1">已完成</div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              </div>
            </div>
          </div>

          {/* 基本信息卡片 */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">创建时间</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">更新时间</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(order.updatedAt)}</div>
              </div>
              {order.completionTime && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">完成时间</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(order.completionTime)}</div>
                </div>
              )}
              {order.assignedTo && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">负责人</div>
                  <div className="text-sm font-medium text-gray-900">{order.assignedTo}</div>
                </div>
              )}
            </div>
          </div>

          {/* 标签页 */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  概览
                </button>
                <button
                  onClick={() => setActiveTab('suborders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'suborders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  子订单 ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  操作历史
                </button>
              </nav>
            </div>
            
            {/* 标签页内容 */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">任务概览</h3>
                  
                  {/* 子订单状态分布 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">子订单状态分布</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">待处理</div>
                          <div className="text-sm font-medium text-gray-900">{stats.pending}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-yellow-500 h-1.5 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">进行中</div>
                          <div className="text-sm font-medium text-gray-900">{stats.processing}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.processing / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">审核中</div>
                          <div className="text-sm font-medium text-gray-900">{stats.reviewing}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.reviewing / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">已完成</div>
                          <div className="text-sm font-medium text-gray-900">{stats.completed}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">已拒绝</div>
                          <div className="text-sm font-medium text-gray-900">{stats.rejected}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-red-500 h-1.5 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 任务信息摘要 */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="flex items-center text-sm font-medium text-blue-800 mb-3">
                      <FileText className="h-4 w-4 mr-2" />
                      任务摘要
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">• 订单类型：{typeInfo.text}</p>
                      <p className="text-gray-700">• 当前状态：{statusInfo.text}</p>
                      <p className="text-gray-700">• 预算总额：¥{order.budget.toFixed(2)}</p>
                      <p className="text-gray-700">• 子订单数量：{stats.total}</p>
                      <p className="text-gray-700">• 完成率：{completionRate}%</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'suborders' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">子订单列表</h3>
                  
                  {order.subOrders.length > 0 ? (
                    <div className="space-y-4">
                      {order.subOrders.map((subOrder) => {
                        const subOrderStatusInfo = getStatusInfo(subOrder.status);
                        return (
                          <div key={subOrder.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-400 mr-2" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{subOrder.userName}</div>
                                  <div className="text-xs text-gray-500">用户ID: {subOrder.userId}</div>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subOrderStatusInfo.className}`}>
                                  {subOrderStatusInfo.icon}
                                  <span className="ml-1">{subOrderStatusInfo.text}</span>
                                </span>
                              </div>
                            </div>
                            
                            {/* 子订单详情 */}
                            <div className="space-y-3 mb-4">
                              {subOrder.content && (
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">提交内容</div>
                                  <div className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                                    {subOrder.content}
                                  </div>
                                </div>
                              )}
                              
                              {subOrder.screenshots && subOrder.screenshots.length > 0 && (
                                <div>
                                  <div className="text-xs text-gray-500 mb-2">提交截图</div>
                                  <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {subOrder.screenshots.map((screenshot, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={screenshot}
                                          alt={`Screenshot ${index + 1}`}
                                          className="w-32 h-24 object-cover rounded-md cursor-pointer hover:opacity-90 border border-gray-200"
                                          onClick={() => setSelectedScreenshot(screenshot)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">奖励金额</div>
                                  <div className="font-medium text-gray-900">¥{subOrder.reward.toFixed(2)}</div>
                                </div>
                                {subOrder.submitTime && (
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">提交时间</div>
                                    <div className="text-gray-700">{formatDate(subOrder.submitTime)}</div>
                                  </div>
                                )}
                                {subOrder.reviewTime && (
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">审核时间</div>
                                    <div className="text-gray-700">{formatDate(subOrder.reviewTime)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* 操作按钮 */}
                            {subOrder.status === 'reviewing' && (
                              <div className="flex justify-end space-x-3">
                                <button
                                  onClick={() => handleReview(subOrder.id, false)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  拒绝
                                </button>
                                <button
                                  onClick={() => handleReview(subOrder.id, true)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  通过
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <Users className="h-10 w-10 mb-2 opacity-50" />
                      <p>暂无子订单</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">操作历史</h3>
                  
                  <div className="space-y-3">
                    {/* 模拟操作历史数据 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">创建订单</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        <div className="mt-1 text-sm text-gray-700">用户创建了订单 {order.orderNumber}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">分配任务</div>
                        <div className="text-sm text-gray-500">{formatDate(new Date(Date.now() - 3600000).toISOString())}</div>
                        <div className="mt-1 text-sm text-gray-700">向 {stats.total} 个用户分配了子任务</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">更新订单</div>
                        <div className="text-sm text-gray-500">{formatDate(order.updatedAt)}</div>
                        <div className="mt-1 text-sm text-gray-700">更新了订单状态为 {statusInfo.text}</div>
                      </div>
                    </div>
                    
                    {stats.completed > 0 && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">完成子任务</div>
                          <div className="text-sm text-gray-500">{formatDate(new Date(Date.now() - 7200000).toISOString())}</div>
                          <div className="mt-1 text-sm text-gray-700">已完成 {stats.completed} 个子任务的审核</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;