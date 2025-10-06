'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface TransactionDetail {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  time: string;
  status: string;
  account: string;
  businessType: string;
  orderNumber: string;
  paymentMethod?: string;
  remark?: string;
  icon?: string;
}

export default function BalanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params?.id as string || '1';
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟获取交易详情数据
  useEffect(() => {
    // 模拟API请求延迟
    setTimeout(() => {
      // 根据ID模拟不同的交易详情
      const mockDetails: Record<string, TransactionDetail> = {
        '1': {
          id: '1',
          type: 'income',
          amount: 580,
          description: '任务报酬结算',
          date: '2023-06-12',
          time: '14:30:25',
          status: '已完成',
          account: '平台账户',
          businessType: '任务收入',
          orderNumber: 'MT20230612143025123456',
          remark: '订单#20230612001报酬',
          icon: '💼'
        },
        '2': {
          id: '2',
          type: 'expense',
          amount: 100,
          description: '提现到银行卡',
          date: '2023-06-11',
          time: '16:45:12',
          status: '已完成',
          account: '招商银行(8876)',
          businessType: '提现',
          orderNumber: 'TX20230611164512654321',
          paymentMethod: '招商银行储蓄卡',
          icon: '💳'
        },
        '3': {
          id: '3',
          type: 'income',
          amount: 320,
          description: '任务报酬结算',
          date: '2023-06-10',
          time: '10:15:33',
          status: '已完成',
          account: '平台账户',
          businessType: '任务收入',
          orderNumber: 'MT20230610101533987654',
          remark: '订单#20230610005报酬',
          icon: '💼'
        }
      };

      // 获取对应ID的交易详情，如果没有则使用默认数据
      setTransactionDetail(mockDetails[transactionId] || mockDetails['1']);
      setLoading(false);
    }, 800);
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!transactionDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">未找到交易记录</div>
      </div>
    );
  }

  // 格式化金额显示
  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    return `${type === 'income' ? '+' : '-'}` + 
           `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-center h-14">
          <button 
            onClick={() => router.back()}
            className="absolute left-4 text-gray-500"
          >
            🔙
          </button>
          <div className="text-base font-medium text-gray-800">交易详情</div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="bg-white mt-4">
        {/* 交易金额和状态 */}
        <div className="p-6 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${transactionDetail.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
            {transactionDetail.icon || (transactionDetail.type === 'income' ? '💰' : '💸')}
          </div>
          
          <div className={`text-4xl font-bold mb-2 ${transactionDetail.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
            {formatAmount(transactionDetail.amount, transactionDetail.type)}
          </div>
          
          <div className="text-gray-600 mb-2">{transactionDetail.description}</div>
          
          <div className="text-sm text-gray-500">
            {transactionDetail.date} {transactionDetail.time}
          </div>
        </div>

        {/* 交易信息详情 */}
        <div className="border-t border-gray-100 pt-2">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">交易信息</div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">交易类型</div>
              <div className="text-sm text-gray-800">
                {transactionDetail.type === 'income' ? '收入' : '支出'}
              </div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">业务类型</div>
              <div className="text-sm text-gray-800">{transactionDetail.businessType}</div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">交易状态</div>
              <div className="text-sm text-green-500">{transactionDetail.status}</div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">交易账户</div>
              <div className="text-sm text-gray-800">{transactionDetail.account}</div>
            </div>
          </div>
          
          {transactionDetail.paymentMethod && (
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">支付方式</div>
                <div className="text-sm text-gray-800">{transactionDetail.paymentMethod}</div>
              </div>
            </div>
          )}
        </div>

        {/* 订单信息 */}
        <div className="border-t border-gray-100 pt-2 mt-4">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">订单信息</div>
          </div>
          
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">交易编号</div>
              <div className="text-sm text-gray-800 break-all max-w-[60%] text-right">
                {transactionDetail.orderNumber}
              </div>
            </div>
          </div>
          
          {transactionDetail.remark && (
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">交易备注</div>
                <div className="text-sm text-gray-800 break-all max-w-[60%] text-right">
                  {transactionDetail.remark}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-6 px-5 pb-8">
        <button 
          onClick={() => router.back()}
          className="w-full py-3 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
        >
          返回
        </button>
      </div>
    </div>
  );
}