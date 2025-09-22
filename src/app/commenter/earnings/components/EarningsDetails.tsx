import React, { useState } from 'react';
import type { EarningRecord, WithdrawalRecord } from '../page';
import { useRouter } from 'next/navigation';

interface EarningsDetailsProps {
  currentEarnings: EarningRecord[];
  currentWithdrawals: WithdrawalRecord[];
}

type EarningsViewMode = 'all' | 'task' | 'commission';

const EarningsDetails: React.FC<EarningsDetailsProps> = ({
  currentEarnings,
  currentWithdrawals
}) => {
  const [viewMode, setViewMode] = useState<EarningsViewMode>('all');
  const router = useRouter();

  // 静态收益记录数据 - 包含更多佣金收益示例
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

  // 静态提现手续费记录数据
  const mockWithdrawals: WithdrawalRecord[] = [
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

  // 使用传入的数据，如果为空则使用静态数据
  const earningsToDisplay = currentEarnings.length > 0 ? currentEarnings : mockEarnings;
  const withdrawalsToDisplay = currentWithdrawals.length > 0 ? currentWithdrawals : mockWithdrawals;

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

  // 跳转到收益详情页
  const handleViewEarningDetails = (earningId: string) => {
    router.push(`/commenter/earnings/details/${earningId}`);
  };

  // 计算各类收益的总和
  const calculateTotalEarnings = (type: EarningsViewMode) => {
    if (type === 'all') {
      return earningsToDisplay.reduce((sum, earning) => sum + earning.amount, 0);
    } else if (type === 'task') {
      return earningsToDisplay
        .filter(e => e.type !== 'commission')
        .reduce((sum, earning) => sum + earning.amount, 0);
    } else if (type === 'commission') {
      return earningsToDisplay
        .filter(e => e.type === 'commission' || (e.commissionInfo && e.commissionInfo.hasCommission))
        .reduce((sum, earning) => sum + earning.amount, 0);
    }
    return 0;
  };

  return (
    <div className="mx-4 mt-6">
      {/* 收益类型切换 */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-800">收益明细</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
            >
              全部收益
            </button>
            <button
              onClick={() => setViewMode('task')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'task' ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'}`}
            >
              任务收益
            </button>
            <button
              onClick={() => setViewMode('commission')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${viewMode === 'commission' ? 'bg-yellow-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-yellow-50'}`}
            >
              佣金收益
            </button>
          </div>
        </div>
        
        {/* 收益总览 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {viewMode === 'all' ? '总收益' : viewMode === 'task' ? '任务总收益' : '佣金总收益'}
            </div>
            <div className="text-lg font-bold text-green-600">
              ¥{calculateTotalEarnings(viewMode).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 收益记录列表 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y">
          {filteredEarnings.length > 0 ? (
            filteredEarnings.map((earning) => {
              const taskTypeInfo = getTaskTypeInfo(earning.type);
              const formattedDate = formatDateTime(earning.createdAt);
              const hasCommission = earning.commissionInfo && earning.commissionInfo.hasCommission;
              
              return (
                <div 
                  key={earning.id} 
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewEarningDetails(earning.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 flex items-center justify-between mb-1">
                      <span>{earning.taskName}</span>
                      {hasCommission && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                          含佣金
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">{formattedDate}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${taskTypeInfo.color}`}>
                        {taskTypeInfo.label}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-green-600">+¥{earning.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{earning.status === 'completed' ? '已到账' : '处理中'}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              {viewMode === 'all' ? '暂无收益记录' : 
               viewMode === 'task' ? '暂无任务收益记录' : '暂无佣金收益记录'}
            </div>
          )}
          
          {/* 显示提现手续费记录 - 仅在全部收益视图中显示 */}
          {viewMode === 'all' && withdrawalsToDisplay.filter(w => w.status === 'approved' && w.fee > 0).length > 0 && (
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-600 mb-2">提现手续费</h4>
              {withdrawalsToDisplay
                .filter(w => w.status === 'approved' && w.fee > 0)
                .map((withdrawal) => {
                  const date = formatDateTime(withdrawal.requestedAt);
                  
                  return (
                    <div key={`fee-${withdrawal.id}`} className="p-2 flex justify-between items-center text-sm">
                      <div className="text-gray-600">提现手续费 ({date})</div>
                      <div className="text-red-500">-¥{withdrawal.fee.toFixed(2)}</div>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsDetails;