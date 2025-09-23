'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { EarningRecord } from '../../page';

interface EarningDetailsProps {
  params: {
    id: string;
  };
}

const EarningDetailsPage: React.FC<EarningDetailsProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [earningDetails, setEarningDetails] = useState<EarningRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟获取收益详情的API调用
  useEffect(() => {
    const fetchEarningDetails = async () => {
      setIsLoading(true);
      try {
        // 在实际项目中，这里应该是一个真实的API调用
        // 这里我们使用模拟数据
        const mockEarnings: EarningRecord[] = [
          {
            id: 'mock-1',
            userId: 'user1',
            taskId: 'task1',
            taskName: '抖音评论任务 - 产品体验反馈',
            amount: 12.50,
            description: '完成产品体验评论任务',
            createdAt: '2024-03-15T10:23:45Z',
            status: 'completed',
            type: 'comment',
            commissionInfo: {
              hasCommission: true,
              commissionRate: 0.1,
              commissionAmount: 1.25,
              commissionRecipient: 'system'
            }
          },
          {
            id: 'mock-2',
            userId: 'user1',
            taskId: 'task2',
            taskName: '视频推荐分享 - 科技产品评测',
            amount: 8.75,
            description: '分享科技产品评测视频',
            createdAt: '2024-03-15T09:15:30Z',
            status: 'completed',
            type: 'video'
          },
          {
            id: 'mock-3',
            userId: 'user1',
            taskId: 'task3',
            taskName: '账号租赁 - 短视频内容互动',
            amount: 20.00,
            description: '账号租赁用于短视频互动',
            createdAt: '2024-03-14T16:45:12Z',
            status: 'completed',
            type: 'account_rental'
          },
          {
            id: 'mock-4',
            userId: 'user1',
            taskId: 'task4',
            taskName: '应用体验反馈 - 生活服务类APP',
            amount: 15.00,
            description: '完成应用体验反馈任务',
            createdAt: '2024-03-14T14:20:50Z',
            status: 'completed',
            type: 'comment',
            commissionInfo: {
              hasCommission: false,
              commissionRate: 0,
              commissionAmount: 0,
              commissionRecipient: ''
            }
          },
          {
            id: 'mock-5',
            userId: 'user1',
            taskId: 'task5',
            taskName: '品牌调研问卷 - 电子产品偏好',
            amount: 10.00,
            description: '完成品牌调研问卷',
            createdAt: '2024-03-13T11:30:22Z',
            status: 'completed',
            type: 'comment'
          },
          {
            id: 'mock-6',
            userId: 'user1',
            taskId: 'task6',
            taskName: '新功能测试任务 - 社交应用',
            amount: 25.00,
            description: '测试社交应用新功能',
            createdAt: '2024-03-13T09:10:15Z',
            status: 'processing',
            type: 'video'
          },
          {
            id: 'mock-7',
            userId: 'user1',
            taskId: 'task7',
            taskName: '邀请好友注册奖励',
            amount: 5.00,
            description: '邀请好友成功注册并完成首单',
            createdAt: '2024-03-12T11:30:20Z',
            status: 'completed',
            type: 'commission',
            commissionInfo: {
              hasCommission: true,
              commissionRate: 1.0,
              commissionAmount: 5.00,
              commissionRecipient: 'referral'
            }
          },
          {
            id: 'mock-8',
            userId: 'user1',
            taskId: 'task8',
            taskName: '内容创作激励 - 优质评论奖励',
            amount: 3.50,
            description: '发布优质评论获得额外奖励',
            createdAt: '2024-03-12T09:45:15Z',
            status: 'completed',
            type: 'commission',
            commissionInfo: {
              hasCommission: true,
              commissionRate: 1.0,
              commissionAmount: 3.50,
              commissionRecipient: 'content_bonus'
            }
          }
        ];

        // 查找匹配的收益记录
        const foundEarning = mockEarnings.find(earning => earning.id === id);
        setEarningDetails(foundEarning || null);
      } catch (error) {
        console.error('获取收益详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningDetails();
  }, [id]);

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 获取任务类型标签信息
  const getTaskTypeLabel = (type?: string) => {
    switch (type) {
      case 'comment':
        return '评论任务';
      case 'video':
        return '视频推荐';
      case 'account_rental':
        return '租号任务';
      case 'commission':
        return '佣金收入';
      default:
        return '普通任务';
    }
  };

  // 获取状态显示文本
  const getStatusText = (status?: string) => {
    if (!status) return '未知';
    switch (status) {
      case 'completed':
        return '已到账';
      case 'processing':
        return '处理中';
      case 'pending':
        return '待处理';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  // 获取状态显示样式
  const getStatusStyle = (status?: string) => {
    if (!status) return 'text-gray-600 bg-gray-50';
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // 处理返回按钮点击
  const handleBack = () => {
    // 优先返回上一页，如果没有历史记录则跳转到收益页面的明细选项卡
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/commenter/earnings?tab=details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!earningDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">⚠️</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">收益记录不存在</h3>
              <p className="text-gray-500 mb-6">无法找到此收益记录的详细信息</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-gray-900">收益详情</h2>
          <div className="w-8"></div> {/* 占位元素，保持标题居中 */}
        </div>

        {/* 收益金额卡片 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">收益金额</p>
              <div className="text-4xl font-bold text-green-600">¥{earningDetails.amount.toFixed(2)}</div>
            </div>
            
            {/* 状态标签 */}
            <div className="mt-4 flex justify-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(earningDetails.status)}`}>
                {getStatusText(earningDetails.status)}
              </span>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">交易详情</h3>
            
            {/* 交易信息列表 */}
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">交易类型</span>
                <span className="text-sm font-medium text-gray-900">{getTaskTypeLabel(earningDetails.type)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">任务名称</span>
                <span className="text-sm font-medium text-gray-900">{earningDetails.taskName}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">任务编号</span>
                <span className="text-sm font-medium text-gray-900">{earningDetails.taskId}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">描述</span>
                <span className="text-sm font-medium text-gray-900">{earningDetails.description}</span>
              </div>
              
              {/* 佣金信息（如果有） */}
              {earningDetails.commissionInfo && earningDetails.commissionInfo.hasCommission && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">佣金信息</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {earningDetails.commissionInfo.commissionAmount.toFixed(2)} ({earningDetails.commissionInfo.commissionRate * 100}%)
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">交易时间</span>
                <span className="text-sm font-medium text-gray-900">{formatDateTime(earningDetails.createdAt)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">交易单号</span>
                <span className="text-sm font-medium text-gray-900">{earningDetails.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningDetailsPage;