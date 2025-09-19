'use client';

import React, { useState, useEffect } from 'react';

export default function PublisherFinancePage() {
  const [activeTab, setActiveTab] = useState('recharge');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balance, setBalance] = useState({
    total: 0,
    frozen: 0,
    available: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('alipay');
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  // 充值档位
  const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];

  // 获取财务数据
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      // 从localStorage获取token
      const token = localStorage.getItem('publisher_auth_token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const response = await fetch('/api/publisher/finance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setBalance(data.data.balance);
        setTransactions(data.data.transactions || []);
      } else {
        alert('获取数据失败：' + data.message);
      }
    } catch (error) {
      console.error('获取财务数据失败:', error);
      alert('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理充值
  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      alert('请输入有效的充值金额');
      return;
    }

    try {
      // 从localStorage获取token
      const token = localStorage.getItem('publisher_auth_token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const response = await fetch('/api/publisher/finance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(rechargeAmount),
          paymentMethod: selectedPaymentMethod
        })
      });

      const data = await response.json();
      if (data.success) {
        setRechargeSuccess(true);
        // 重新获取数据以更新余额
        await fetchFinanceData();
        alert(data.message);
        setRechargeAmount('');
      } else {
        alert('充值失败：' + data.message);
      }
    } catch (error) {
      console.error('充值失败:', error);
      alert('充值失败，请稍后重试');
    }
  };

  // 处理提现
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

  // 初始加载数据
  useEffect(() => {
    fetchFinanceData();
  }, [rechargeSuccess]);

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
            <div className="text-3xl font-bold mb-4">
              {loading ? '加载中...' : `¥${balance.total.toFixed(2)}`}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div>可用余额</div>
                <div className="font-bold">
                  {loading ? '加载中...' : `¥${balance.available.toFixed(2)}`}
                </div>
              </div>
              <div>
                <div>冻结金额</div>
                <div className="font-bold">
                  {loading ? '加载中...' : `¥${balance.frozen.toFixed(2)}`}
                </div>
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
                    <input 
                      type="radio" 
                      name="payMethod" 
                      className="mr-2" 
                      checked={selectedPaymentMethod === 'alipay'} 
                      onChange={() => setSelectedPaymentMethod('alipay')}
                    />
                    <span className="text-sm">💙 支付宝</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="payMethod" 
                      className="mr-2" 
                      checked={selectedPaymentMethod === 'paypal'} 
                      onChange={() => setSelectedPaymentMethod('paypal')}
                    />
                    <span className="text-sm">💳 PayPal</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="payMethod" 
                      className="mr-2" 
                      checked={selectedPaymentMethod === 'usdt'} 
                      onChange={() => setSelectedPaymentMethod('usdt')}
                    />
                    <span className="text-sm">🪙 USDT</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleRecharge}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {loading ? '处理中...' : '立即充值'}
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
                {loading ? (
                  <div className="p-8 text-center text-gray-500">加载中...</div>
                ) : transactions.length > 0 ? (
                  transactions.map((record) => (
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
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">暂无交易记录</div>
                )}
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