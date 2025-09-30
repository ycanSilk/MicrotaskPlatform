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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

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
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
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

      {/* 交易详情弹窗 */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-800">交易详情</div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-center mb-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedTransaction.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                  {selectedTransaction.icon || (selectedTransaction.type === 'income' ? '💰' : '💸')}
                </div>
              </div>
              
              <div className="text-center mb-5">
                <div className={`text-3xl font-bold ${selectedTransaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'}
                  ¥{selectedTransaction.amount.toFixed(2)}
                </div>
                <div className="text-gray-600 mt-2">{selectedTransaction.description}</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">交易时间</div>
                  <div className="text-sm text-gray-800">{selectedTransaction.date}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">交易类型</div>
                  <div className="text-sm text-gray-800">
                    {selectedTransaction.type === 'income' ? '收入' : '支出'}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">交易状态</div>
                  <div className="text-sm text-green-500">已完成</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">交易编号</div>
                  <div className="text-sm text-gray-800">
                    {selectedTransaction.id.padStart(16, '0')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-5 pb-5">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}