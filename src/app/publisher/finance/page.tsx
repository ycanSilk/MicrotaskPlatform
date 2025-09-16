'use client';

import React, { useState } from 'react';

export default function PublisherFinancePage() {
  const [activeTab, setActiveTab] = useState('recharge');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // 模拟用户余额数据
  const balance = {
    total: 2345.60,
    frozen: 156.80,
    available: 2188.80
  };

  // 充值档位
  const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];

  // 交易记录
  const transactions = [
    {
      id: 1,
      type: 'recharge',
      amount: 1000.00,
      status: 'success',
      method: '微信支付',
      time: '2024-01-15 14:30',
      orderId: 'RC20240115001'
    },
    {
      id: 2,
      type: 'expense',
      amount: -45.60,
      status: 'success',
      method: '任务支付',
      time: '2024-01-15 10:20',
      orderId: 'EX20240115001'
    },
    {
      id: 3,
      type: 'withdraw',
      amount: -500.00,
      status: 'pending',
      method: '银行卡',
      time: '2024-01-14 16:45',
      orderId: 'WD20240114001'
    },
    {
      id: 4,
      type: 'expense',
      amount: -38.90,
      status: 'success',
      method: '任务支付',
      time: '2024-01-14 09:15',
      orderId: 'EX20240114001'
    },
    {
      id: 5,
      type: 'recharge',
      amount: 500.00,
      status: 'success',
      method: '支付宝',
      time: '2024-01-13 20:30',
      orderId: 'RC20240113001'
    }
  ];

  const handleRecharge = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      alert('请输入有效的充值金额');
      return;
    }
    alert(`充值 ¥${rechargeAmount} 成功！`);
    setRechargeAmount('');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('请输入有效的提现金额');
      return;
    }
    if (parseFloat(withdrawAmount) > balance.available) {
      alert('提现金额不能超过可用余额');
      return;
    }
    alert(`申请提现 ¥${withdrawAmount} 成功！`);
    setWithdrawAmount('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge': return '💰';
      case 'withdraw': return '🏦';
      case 'expense': return '📤';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'recharge': return 'text-green-600';
      case 'withdraw': return 'text-blue-600';
      case 'expense': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return '成功';
      case 'pending': return '处理中';
      case 'failed': return '失败';
      default: return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="pb-20">
      {/* 功能选择 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('recharge')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'recharge' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          充值
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'withdraw' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          提现
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'records' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          记录
        </button>
      </div>

      {/* 余额显示 */}
      <div className="mx-4 mt-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="text-center">
            <div className="text-sm mb-2">账户余额</div>
            <div className="text-3xl font-bold mb-4">¥{balance.total.toFixed(2)}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div>可用余额</div>
                <div className="font-bold">¥{balance.available.toFixed(2)}</div>
              </div>
              <div>
                <div>冻结金额</div>
                <div className="font-bold">¥{balance.frozen.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'recharge' && (
        <>
          {/* 充值金额输入 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">充值金额</h3>
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    placeholder="请输入充值金额"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  最低充值：¥10.00 | 单次最高：¥50,000.00
                </div>
              </div>

              {/* 快捷充值 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">快捷选择</h4>
                <div className="grid grid-cols-3 gap-2">
                  {rechargeOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setRechargeAmount(amount.toString())}
                      className="py-2 px-3 border border-gray-300 rounded text-sm hover:bg-green-50 hover:border-green-300"
                    >
                      ¥{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* 支付方式 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">支付方式</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="payMethod" className="mr-2" defaultChecked />
                    <span className="text-sm">💰 微信支付</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payMethod" className="mr-2" />
                    <span className="text-sm">💙 支付宝</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payMethod" className="mr-2" />
                    <span className="text-sm">🏦 银行卡</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleRecharge}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                立即充值
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'withdraw' && (
        <>
          {/* 提现申请 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">申请提现</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提现金额
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    placeholder="请输入提现金额"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  可提现余额：¥{balance.available.toFixed(2)} | 最低提现：¥50.00
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提现账户
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="withdrawMethod" className="mr-2" defaultChecked />
                    <span className="text-sm">🏦 农业银行 ****1234</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="withdrawMethod" className="mr-2" />
                    <span className="text-sm">💙 支付宝账户</span>
                  </label>
                  <button className="text-sm text-green-500 ml-6">+ 添加新账户</button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-yellow-800">
                  <div className="font-medium mb-1">提现说明：</div>
                  <ul className="text-xs space-y-1">
                    <li>• 提现手续费：2元/笔（提现金额≥1000元免手续费）</li>
                    <li>• 工作日申请，2小时内到账</li>
                    <li>• 周末申请，下个工作日到账</li>
                    <li>• 单日最多可申请提现5次</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                申请提现
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'records' && (
        <>
          {/* 交易记录 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">交易记录</h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {transactions.map((record) => (
                  <div key={record.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getTransactionIcon(record.type)}</span>
                        <div>
                          <div className="font-medium text-gray-800">{record.method}</div>
                          <div className="text-xs text-gray-500">{record.time}</div>
                          <div className="text-xs text-gray-400">订单号：{record.orderId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getTransactionColor(record.type)}`}>
                          {record.amount > 0 ? '+' : ''}¥{Math.abs(record.amount).toFixed(2)}
                        </div>
                        <div className={`text-xs ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 查看更多 */}
              <div className="p-4 border-t bg-gray-50">
                <button className="w-full text-green-500 text-sm hover:text-green-600">
                  查看全部交易记录
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}