"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, Clock, Download, MessageSquare, Users, DollarSign, Calendar, FileText, Award, Share2, ThumbsUp, Copy, Check } from 'lucide-react';

// 直接在文件中定义SubOrder接口
export interface SubOrder {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  status: 'pending' | 'processing' | 'reviewing' | 'completed' | 'rejected' | 'cancelled';
  submitTime?: string;
  reviewTime?: string;
  reward: number;
  content?: string;
  screenshots?: string[];
}

// 子订单详情页面组件
const SubOrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const subOrderId = params.suborderId as string;

  const [subOrder, setSubOrder] = useState<SubOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 模拟获取子订单详情数据
  useEffect(() => {
    const fetchSubOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // 在实际应用中，这里会调用API获取数据
        // const response = await fetch(`/api/publisher/orders/${orderId}/suborders/${subOrderId}`);
        // if (!response.ok) throw new Error('Failed to fetch suborder detail');
        // const data = await response.json();
        // setSubOrder(data);

        // 模拟数据
        const mockSubOrder: SubOrder = {
          id: subOrderId,
          orderId: orderId,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          userName: `用户${Math.floor(Math.random() * 100)}`,
          status: ['pending', 'processing', 'reviewing', 'completed', 'rejected'][Math.floor(Math.random() * 5)] as SubOrder['status'],
          submitTime: Math.random() > 0.2 ? new Date().toISOString() : undefined,
          reviewTime: Math.random() > 0.5 ? new Date().toISOString() : undefined,
          reward: 10 + Math.floor(Math.random() * 90),
          content: Math.random() > 0.3 ? `这是用户提交的详细内容。\n\n根据任务要求，我已经完成了所有内容并按照规定格式提交。\n\n1. 完成了指定的评论/点赞/分享操作\n2. 确保内容符合平台规范\n3. 提供了相关截图作为证明\n\n请查收并审核，谢谢！` : undefined,
          screenshots: Math.random() > 0.3 ? [
            'https://picsum.photos/800/600?random=' + subOrderId + '1',
            'https://picsum.photos/800/601?random=' + subOrderId + '2',
            'https://picsum.photos/800/602?random=' + subOrderId + '3'
          ] : undefined,
        };

        setSubOrder(mockSubOrder);
      } catch (err) {
        setError('获取子订单详情失败，请稍后重试。');
        console.error('Failed to fetch suborder detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && subOrderId) {
      fetchSubOrderDetail();
    }
  }, [orderId, subOrderId]);

  // 处理返回按钮点击
  const handleBack = () => {
    router.push(`/publisher/orders/${orderId}?tab=suborders`);
  };

  // 处理审核操作
  const handleReview = (approve: boolean) => {
    // 在实际应用中，这里会调用API更新子订单状态
    alert(`${approve ? '通过' : '拒绝'}子订单 ${subOrderId}`);
  };

  // 复制子订单ID
  const copySubOrderId = () => {
    navigator.clipboard.writeText(subOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      rejected: { text: '已拒绝', className: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> }
    };
    return statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-4 w-4" /> };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-md w-24"></div>
            <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded-md"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded-md"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回订单详情
          </button>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-gray-700 text-lg font-medium">{error || '子订单不存在或已被删除'}</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回订单详情
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(subOrder.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回订单详情
          </button>

          {/* 子订单头部信息 */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.text}</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">子订单详情</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>子订单ID: {subOrderId}</span>
                  <button 
                    onClick={copySubOrderId}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100"
                    aria-label="复制子订单ID"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </button>
                  <span className="mx-2">|</span>
                  <span>订单ID: {orderId}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  打印详情
                </button>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                用户信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">用户名称</div>
                  <div className="text-sm font-medium text-gray-900">{subOrder.userName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">用户ID</div>
                  <div className="text-sm font-medium text-gray-900">{subOrder.userId}</div>
                </div>
              </div>
            </div>

            {/* 提交内容 */}
            {subOrder.content && (
              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
                  提交内容
                </h2>
                <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-line border border-gray-200">
                  {subOrder.content}
                </div>
              </div>
            )}

            {/* 提交截图 */}
            {subOrder.screenshots && subOrder.screenshots.length > 0 && (
              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  提交截图
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subOrder.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          onClick={() => setSelectedScreenshot(screenshot)}
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1 cursor-pointer hover:bg-opacity-100 transition-colors">
                        <FileText className="h-4 w-4 text-gray-600" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScreenshot(screenshot);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 时间信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subOrder.submitTime && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">提交时间</div>
                  </div>
                  <div className="text-sm text-gray-700">{formatDate(subOrder.submitTime)}</div>
                </div>
              )}
              {subOrder.reviewTime && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">审核时间</div>
                  </div>
                  <div className="text-sm text-gray-700">{formatDate(subOrder.reviewTime)}</div>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="text-sm font-medium text-gray-900">奖励金额</div>
                </div>
                <div className="text-xl font-bold text-gray-900">¥{subOrder.reward.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* 操作区域 */}
          {subOrder.status === 'reviewing' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">审核操作</h2>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  请审核该子订单是否符合任务要求
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReview(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    拒绝
                  </button>
                  <button
                    onClick={() => handleReview(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    通过
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubOrderDetailPage;