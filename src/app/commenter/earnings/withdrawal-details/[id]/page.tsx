'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { WithdrawalRecord } from '../../page';

interface WithdrawalDetailsPageProps {
  // 这里可以定义页面需要的props
}

// 模拟获取提现记录详情的函数
import { financeModelAdapter } from '@/data/commenteruser/finance_model_adapter';

const getWithdrawalDetails = async (withdrawalId: string): Promise<WithdrawalRecord | null> => {
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 在实际系统中，这里应该调用API获取单个提现记录
  // 由于当前是模拟环境，我们先获取所有提现记录，然后筛选
  const allWithdrawals = await financeModelAdapter.getUserWithdrawalRecords('');
  return allWithdrawals.find(w => w.id === withdrawalId) || null;
};

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取提现方式标签
const getWithdrawalMethodLabel = (method: string) => {
  switch (method) {
    case 'wechat':
      return '微信';
    case 'alipay':
      return '支付宝';
    case 'bank':
      return '银行卡';
    default:
      return '其他';
  }
};

// 获取提现状态信息
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved':
      return {
        label: '已完成',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    case 'pending':
      return {
        label: '处理中',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    case 'rejected':
    case 'failed':
      return {
        label: '已拒绝',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    default:
      return {
        label: '未知',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: null
      };
  }
};

const WithdrawalDetailsPage: React.FC<WithdrawalDetailsPageProps> = () => {
  const router = useRouter();
  const params = useParams();
  const [withdrawalDetails, setWithdrawalDetails] = React.useState<WithdrawalRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const withdrawalId = params.id as string;
  
  // 加载提现详情
  React.useEffect(() => {
    const loadWithdrawalDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const details = await getWithdrawalDetails(withdrawalId);
        if (!details) {
          throw new Error('提现记录不存在或已被删除');
        }
        setWithdrawalDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWithdrawalDetails();
  }, [withdrawalId]);
  
  // 返回上一页
  const handleBack = () => {
    router.push('/commenter/earnings');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button onClick={handleBack} className="mr-2">
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">提现详情</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !withdrawalDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button onClick={handleBack} className="mr-2">
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">提现详情</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">加载失败</h3>
            <p className="mt-2 text-sm text-gray-500">{error || '无法加载提现详情'}</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => router.push('/commenter/earnings')}
              >
                返回提现页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const methodLabel = getWithdrawalMethodLabel(withdrawalDetails.method);
  const statusInfo = getStatusInfo(withdrawalDetails.status);
  const formattedRequestedAt = formatDateTime(withdrawalDetails.requestedAt);
  const formattedProcessedAt = withdrawalDetails.processedAt ? formatDateTime(withdrawalDetails.processedAt) : '处理中...';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack} 
            className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="返回"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">提现详情</h1>
        </div>
        
        {/* 提现状态卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center justify-center">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${statusInfo.bgColor} ${statusInfo.color} mb-4`}>
              {statusInfo.icon || (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{methodLabel}提现</h2>
            <div className={`text-sm font-medium ${statusInfo.color} mb-4`}>
              {statusInfo.label}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ¥{withdrawalDetails.amount.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* 交易详情列表 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="divide-y">
            {/* 提现方式 */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">提现方式</div>
              <div className="text-sm font-medium text-gray-900">
                {methodLabel}
              </div>
            </div>
            
            {/* 提现账号 */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">提现方式</div>
              <div className="text-sm font-medium text-gray-900">
                {getWithdrawalMethodLabel(withdrawalDetails.method)}
              </div>
            </div>
            
            {/* 交易单号 */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">提现单号</div>
              <div className="text-sm font-medium text-gray-900">
                {withdrawalDetails.id}
              </div>
            </div>
            
            {/* 提现金额 */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">提现金额</div>
              <div className="text-sm font-medium text-gray-900">
                ¥{withdrawalDetails.amount.toFixed(2)}
              </div>
            </div>
            
            {/* 手续费 */}
            {withdrawalDetails.fee > 0 && (
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">手续费</div>
                <div className="text-sm font-medium text-gray-900">
                  ¥{withdrawalDetails.fee.toFixed(2)}
                </div>
              </div>
            )}
            
            {/* 申请时间 */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">申请时间</div>
              <div className="text-sm font-medium text-gray-900">
                {formattedRequestedAt}
              </div>
            </div>
            
            {/* 处理时间 */}
            {(withdrawalDetails.status === 'approved' || withdrawalDetails.status === 'rejected') && (
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">处理时间</div>
                <div className="text-sm font-medium text-gray-900">
                  {formattedProcessedAt}
                </div>
              </div>
            )}
            
            {/* 提现说明 */}
            {withdrawalDetails.description && (
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">提现说明</div>
                <div className="text-sm font-medium text-gray-900">
                  {withdrawalDetails.description}
                </div>
              </div>
            )}
            

          </div>
        </div>
        
        {/* 底部操作按钮 */}
        <div className="flex justify-center space-x-4">
          {withdrawalDetails.status === 'pending' && (
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消申请
            </button>
          )}
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => router.push('/commenter/earnings')}
          >
            返回提现页
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetailsPage;