'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TransactionItem {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  icon?: string;
}

export default function BalancePage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(1298);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // 模拟获取交易数据
  useEffect(() => {
    // 模拟数据加载
    const mockTransactions: TransactionItem[] = [
      {
        id: '1',
        type: 'income',
        amount: 580,
        description: '任务报酬结算',
        date: '今天 14:30',
        icon: '💼'
      },
      {
        id: '2',
        type: 'expense',
        amount: 100,
        description: '提现到银行卡',
        date: '昨天 16:45',
        icon: '💳'
      },
      {
        id: '3',
        type: 'income',
        amount: 320,
        description: '任务报酬结算',
        date: '06月10日',
        icon: '💼'
      },
      {
        id: '4',
        type: 'expense',
        amount: 50,
        description: '提现到银行卡',
        date: '06月08日',
        icon: '💳'
      },
      {
        id: '5',
        type: 'income',
        amount: 498,
        description: '任务报酬结算',
        date: '06月05日',
        icon: '💼'
      }
    ];

    // 延迟加载数据以模拟真实API调用
    setTimeout(() => {
      setTransactions(mockTransactions);
    }, 600);
  }, []);

  // 查看交易详情
  const viewTransactionDetail = (transaction: TransactionItem) => {
    // 跳转到transactions详情页面
    router.push(`/publisher/transactions/${transaction.id}`);
  };

  // 充值处理
  const handleRecharge = () => {
    // @ts-ignore
    alert('即将跳转到充值页面');
  };

  // 提现处理
  const handleWithdraw = () => {
    // @ts-ignore
    alert('即将跳转到提现页面');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* 余额显示区域 */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-500 text-white px-6 py-8">
        <div className="text-2xl mb-1 text-center">账户余额</div>
        <div className="text-2xl font-bold   text-center">
          <span>¥</span>
          {balance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        
      </div>
      <div className="flex space-x-4 p-4">
          <button 
            onClick={handleRecharge}
            className="bg-blue-500 text-white hover:bg-blue-700 text-sm py-2 px-6 rounded-lg flex-1 font-medium"
          >
            充值
          </button>
          <button 
            onClick={handleWithdraw}
            className="bg-blue-500 text-white hover:bg-blue-700  text-sm py-2 px-6 rounded-lg flex-1 font-medium"
          >
            提现
          </button>
        </div>
      {/* 收支明细标题 */}
      <div className="bg-white mt-4 p-4 border-b border-gray-600">
        <div className="text-base font-medium text-gray-800">收支明细</div>
      </div>

      {/* 交易列表 */}
      <div className="bg-white mt-2">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div 
              key={transaction.id}
              onClick={() => viewTransactionDetail(transaction)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                  {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
                </div>
                <div className="ml-3">
                  <div className="text-gray-800">{transaction.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{transaction.date}</div>
                </div>
              </div>
              <div className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                ¥{transaction.amount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">
            暂无交易记录
          </div>
        )}
      </div>
    </div>
  );
}