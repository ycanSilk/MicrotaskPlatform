'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CommissionRecord } from '../../../../types/invite';

const CommissionDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const commissionId = params.id as string;
  const [commissionDetail, setCommissionDetail] = useState<CommissionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取佣金详情数据
    const fetchCommissionDetail = async () => {
      try {
        setLoading(true);
        // 由于是静态数据，这里我们创建一个模拟的佣金详情记录
        // 实际项目中应该从API获取
        const mockDetail: CommissionRecord = {
          id: commissionId || '2001',
          memberId: 'user' + (Math.floor(Math.random() * 1000) + 100),
          memberName: '李四' + Math.floor(Math.random() * 100),
          memberAvatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/40/40`,
          type: Math.random() > 0.6 ? 'register' : Math.random() > 0.3 ? 'team' : 'task',
          taskName: Math.random() > 0.3 ? '完成产品评价任务' : '填写市场调研问卷',
          taskId: Math.random() > 0.5 ? 'task123' : 'task456',
          commission: Math.random() * 50 + 5,
          commissionRate: Math.random() * 0.1 + 0.03,
          taskEarning: Math.random() > 0.3 ? Math.random() * 200 + 50 : undefined,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          description: Math.random() > 0.5 ? '来自推荐用户完成的优质任务奖励' : ''
        };
        setCommissionDetail(mockDetail);
      } catch (error) {
        console.error('Failed to fetch commission detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionDetail();
  }, [commissionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <div className="mt-4 text-gray-600 text-center">加载中...</div>
        </div>
      </div>
    );
  }

  if (!commissionDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <div className="text-gray-400 text-5xl mb-4">💰</div>
          <div className="text-gray-500 text-lg mb-2">佣金记录不存在</div>
          <div className="text-gray-400 text-sm mb-6">该佣金记录可能已被删除或不存在</div>
          <button 
            onClick={() => router.push('/commenter/invite')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            返回邀请页面
          </button>
        </div>
      </div>
    );
  }

  const getTypeLabel = () => {
    switch (commissionDetail.type) {
      case 'register':
        return '注册奖励';
      case 'team':
        return '团队奖励';
      case 'task':
        return '任务佣金';
      default:
        return '佣金';
    }
  };

  const getTypeColor = () => {
    switch (commissionDetail.type) {
      case 'register':
        return 'bg-green-100 text-green-600';
      case 'team':
        return 'bg-purple-100 text-purple-600';
      case 'task':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getAmountColor = () => {
    switch (commissionDetail.type) {
      case 'register':
        return 'text-green-600';
      case 'team':
        return 'text-purple-600';
      case 'task':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/commenter/invite')}
                className="text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">佣金详情</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* 佣金基本信息 */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">佣金记录 #{commissionDetail.id}</h2>
          </div>
          <div className="p-6">
            {/* 佣金金额卡片 */}
            <div className="text-center mb-8">
              <div className={`text-4xl font-bold ${getAmountColor()}`}>+¥{commissionDetail.commission.toFixed(2)}</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getTypeColor()}`}>
                {getTypeLabel()}
              </div>
              <div className="text-gray-500 mt-2">
                获得时间: {new Date(commissionDetail.date).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 被推荐人信息 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-3">被推荐人信息</h4>
                <div className="flex items-center mb-4">
                  <img 
                    src={commissionDetail.memberAvatar} 
                    alt={commissionDetail.memberName} 
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{commissionDetail.memberName}</div>
                    <div className="text-xs text-gray-500">ID: {commissionDetail.memberId}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">佣金类型</span>
                    <span className="text-sm font-medium text-gray-900">{getTypeLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">状态</span>
                    <span className="text-sm font-medium text-green-600">已到账</span>
                  </div>
                </div>
              </div>

              {/* 佣金计算详情 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-3">佣金计算详情</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">佣金金额</span>
                    <span className="text-sm font-medium text-gray-900">¥{commissionDetail.commission.toFixed(2)}</span>
                  </div>
                  {commissionDetail.type === 'task' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">任务收益</span>
                        <span className="text-sm font-medium text-gray-900">¥{(commissionDetail.taskEarning || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">佣金比例</span>
                        <span className="text-sm font-medium text-gray-900">{(commissionDetail.commissionRate * 100).toFixed(1)}%</span>
                      </div>
                      {commissionDetail.taskEarning && (
                        <div className="pt-2 mt-2 border-t border-green-100">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>计算公式</span>
                            <span>¥{commissionDetail.taskEarning.toFixed(2)} × {(commissionDetail.commissionRate * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {commissionDetail.type === 'register' && (
                    <div className="pt-2 mt-2 border-t border-green-100">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>说明</span>
                        <span>新用户注册奖励</span>
                      </div>
                    </div>
                  )}
                  {commissionDetail.type === 'team' && (
                    <div className="pt-2 mt-2 border-t border-green-100">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>说明</span>
                        <span>团队业绩奖励</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 任务信息 */}
            {commissionDetail.type === 'task' && commissionDetail.taskName && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-800 mb-3">关联任务信息</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">任务名称</span>
                    <span className="text-sm font-medium text-gray-900">{commissionDetail.taskName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">任务ID</span>
                    <span className="text-sm font-medium text-gray-900">{commissionDetail.taskId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 备注信息 */}
            {commissionDetail.description && (
              <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-3">备注信息</h4>
                <p className="text-sm text-gray-700">{commissionDetail.description}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => router.push('/commenter/invite')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors mr-3"
              >
                返回列表
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                查看更多佣金记录
              </button>
            </div>
          </div>
        </div>

        {/* 佣金说明 */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">佣金说明</h2>
          </div>
          <div className="p-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>所有佣金将在任务完成并审核通过后自动发放</li>
              <li>不同类型的任务可能有不同的佣金比例</li>
              <li>邀请新用户注册可获得固定注册奖励</li>
              <li>邀请的用户完成任务，您将获得相应比例的佣金</li>
              <li>团队奖励根据您团队的整体业绩计算</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommissionDetailsPage;