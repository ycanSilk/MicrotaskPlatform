'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { EarningRecord, WithdrawalRecord } from '../page';
import { FinanceModelAdapter } from '@/data/commenteruser/finance_model_adapter';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import type { User } from '@/types';

interface EarningsDetailsProps {
  // 页面组件无需props，直接从API获取数据
}

type EarningsViewMode = 'all' | 'task' | 'commission';

const EarningsDetails: React.FC<EarningsDetailsProps> = () => {
  const router = useRouter();
  const [currentEarnings, setCurrentEarnings] = useState<EarningRecord[]>([]);
  const [currentWithdrawals, setCurrentWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [viewMode, setViewMode] = useState<EarningsViewMode>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取用户信息
        const commenterUser = CommenterAuthStorage.getCurrentUser();
        if (!commenterUser) {
          setError('请先登录');
          setIsLoading(false);
          return;
        }
        setUser(commenterUser);
        
        const financeAdapter = FinanceModelAdapter.getInstance();
        const userId = commenterUser.id;
        
        // 获取用户收益记录
        const userEarnings = await financeAdapter.getUserEarningsRecords(userId);
        if (userEarnings && userEarnings.length > 0) {
          setCurrentEarnings(userEarnings);
        }

        // 获取用户提现记录
        const userWithdrawals = await financeAdapter.getUserWithdrawalRecords(userId);
        if (userWithdrawals && userWithdrawals.length > 0) {
          setCurrentWithdrawals(userWithdrawals);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
        // 使用模拟数据
        setCurrentEarnings(getMockEarnings());
        setCurrentWithdrawals(getMockWithdrawals());
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // 静态收益记录数据 - 包含更多佣金收益示例
  const getMockEarnings = (): EarningRecord[] => {
    return [
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
  };

  // 静态提现手续费记录数据
  const getMockWithdrawals = (): WithdrawalRecord[] => {
    return [
      {
        id: 'mock-wd-1',
        userId: 'user1',
        amount: 50.00,
        fee: 1.00,
        method: 'wechat',
        status: 'approved',
        requestedAt: '2024-03-10T15:30:00Z',
        processedAt: '2024-03-11T10:15:00Z',
        description: '微信提现',
        totalAmount: 49.00
      },
      {
        id: 'mock-wd-2',
        userId: 'user1',
        amount: 30.00,
        fee: 0.60,
        method: 'alipay',
        status: 'approved',
        requestedAt: '2024-03-05T14:20:00Z',
        processedAt: '2024-03-06T09:45:00Z',
        description: '支付宝提现',
        totalAmount: 29.40
      }
    ];
  };

  // 使用传入的数据，如果为空则使用静态数据
  const earningsToDisplay = currentEarnings.length > 0 ? currentEarnings : getMockEarnings();
  const withdrawalsToDisplay = currentWithdrawals.length > 0 ? currentWithdrawals : getMockWithdrawals();

  // 根据查看模式过滤收益记录
  const filteredEarnings = earningsToDisplay.filter(earning => {
    if (viewMode === 'all') return true;
    if (viewMode === 'task') return earning.type !== 'commission';
    if (viewMode === 'commission') {
      return earning.type === 'commission' || 
             (earning.commissionInfo && earning.commissionInfo.hasCommission);
    }
    return true;
  });

  // 获取任务类型标签信息
  const getTaskTypeInfo = (type?: string) => {
    switch (type) {
      case 'comment':
        return { label: '评论任务', color: 'bg-blue-100 text-blue-800' };
      case 'video':
        return { label: '视频推荐', color: 'bg-green-100 text-green-800' };
      case 'account_rental':
        return { label: '租号任务', color: 'bg-purple-100 text-purple-800' };
      case 'commission':
        return { label: '佣金收入', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: '普通任务', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 处理导航到其他选项卡
  const navigateToTab = (tab: string) => {
    router.push(`/commenter/earnings/${tab}` as any);
  };

  // 跳转到收益详情页
  const navigateToEarningDetails = (id: string) => {
    // 这里应该跳转到收益详情页，假设路径是/commenter/earnings/earning-details/{id}
    router.push(`/commenter/earnings/earning-details/${id}` as any);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-4">
      {/* 选项卡导航 */}
      <div className="flex border-b mb-6 mt-2">
        <button 
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigateToTab('overview')}
        >
          收益概览
        </button>
        <button 
          className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
          onClick={() => navigateToTab('details')}
        >
          收益明细
        </button>
        <button 
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigateToTab('withdraw')}
        >
          提现管理
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* 收益明细筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('all')}
          >
            全部
          </button>
          <button
            className={`px-4 py-2 rounded-md ${viewMode === 'task' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('task')}
          >
            任务收益
          </button>
          <button
            className={`px-4 py-2 rounded-md ${viewMode === 'commission' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('commission')}
          >
            佣金收入
          </button>
        </div>
      </div>

      {/* 收益记录列表 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-800">收益记录</h3>
        </div>
        <div className="p-4">
          {filteredEarnings.length > 0 ? (
            <div className="space-y-4">
              {filteredEarnings.map((earning) => {
                const taskTypeInfo = getTaskTypeInfo(earning.type);
                
                return (
                  <div
                    key={earning.id}
                    className="p-3 border border-gray-200 rounded-md hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigateToEarningDetails(earning.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className={`font-medium px-2 py-0.5 rounded-full ${taskTypeInfo.color}`}>
                          {taskTypeInfo.label}
                        </span>
                        <span className="ml-2 text-gray-600">{earning.taskName}</span>
                      </div>
                      <span className="font-bold text-green-600">
                        +{earning.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{earning.description}</span>
                      <span>{formatDateTime(earning.createdAt)}</span>
                    </div>
                    
                    {/* 显示佣金信息（如果有）*/}
                    {earning.commissionInfo && earning.commissionInfo.hasCommission && (
                      <div className="mt-2 flex justify-between text-gray-600">
                        <span>含佣金: ¥{earning.commissionInfo.commissionAmount.toFixed(2)}</span>
                        <span>佣金率: {earning.commissionInfo.commissionRate * 100}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📝</div>
              <div className="text-gray-500">暂无收益记录</div>
            </div>
          )}
        </div>
      </div>

      {/* 提现手续费记录 */}
      {withdrawalsToDisplay.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm mt-6 mb-8">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">提现记录</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {withdrawalsToDisplay.map((withdrawal) => (
                <div key={withdrawal.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-600">{withdrawal.description || '提现'}</div>
                    <span className="font-bold text-red-600">
                      -{withdrawal.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>手续费: ¥{withdrawal.fee.toFixed(2)}</span>
                    <span>{formatDateTime(withdrawal.requestedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDetails;