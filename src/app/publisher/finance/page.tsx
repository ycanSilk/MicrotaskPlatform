'use client';

import React, { useState, useEffect } from 'react';
import AlertModal from '../../../components/ui/AlertModal';

// 定义类型接口
export interface BalanceData {
  balance: number;
}

export default function PublisherFinancePage() {
  const [activeTab, setActiveTab] = useState('recharge');
  const [rechargeAmount, setRechargeAmount] = useState('');
  // 初始化余额数据，确保符合BalanceData类型
  const [balance, setBalance] = useState<BalanceData>({
    balance: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('alipay');
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  // 通用提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });
  // 提示框确认后的回调函数
  const [alertCallback, setAlertCallback] = useState<(() => void) | null>(null);

  // 充值档位
  const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];

  // 显示通用提示框
  const showAlert = (title: string, message: string, icon: string, onConfirmCallback?: () => void) => {
    setAlertConfig({ title, message, icon });
    setAlertCallback(onConfirmCallback || null);
    setShowAlertModal(true);
  };

  // 处理提示框关闭
  const handleAlertClose = () => {
    setShowAlertModal(false);
    // 如果有回调函数，则执行它
    if (alertCallback) {
      setTimeout(() => {
        alertCallback();
        setAlertCallback(null);
      }, 300); // 等待动画完成
    }
  };

  // 从token中获取用户信息
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem('publisher_auth_token');
      console.log('尝试从localStorage获取token:', token ? '已获取到token' : '未获取到token');
      
      if (!token) {
        console.log('getUserInfoFromToken: 未找到token');
        return null;
      }
      
      const decodedToken = JSON.parse(atob(token));
      console.log('getUserInfoFromToken: 解析token成功', decodedToken);
      
      // 验证token是否过期
      if (decodedToken.exp && decodedToken.exp < Date.now()) {
        console.log('getUserInfoFromToken: token已过期');
        localStorage.removeItem('publisher_auth_token');
        return null;
      }
      
      return decodedToken;
    } catch (error) {
      console.error('解析token失败:', error);
      return null;
    }
  };

  // 检查是否已登录
  useEffect(() => {
    const userInfo = getUserInfoFromToken();
    if (!userInfo && process.env.NODE_ENV !== 'development') {
      // 在非开发环境下，如果没有登录信息，提示用户登录
      showAlert('提示', '请先登录', '💡');
    } else if (userInfo && process.env.NODE_ENV === 'development') {
      console.log(`当前登录用户: ${userInfo.username || '未知用户'} (ID: ${userInfo.userId || '未知ID'})`);
    }
  }, []);

  // 获取财务数据
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      console.log('开始获取财务数据');
      
      // 从token中获取用户信息
      const userInfo = getUserInfoFromToken();
      console.log('fetchFinanceData: 获取用户信息结果', userInfo);
      
      // 如果没有用户信息，提示登录
      if (!userInfo) {
        console.log('fetchFinanceData: 没有用户信息，提示登录');
        showAlert('提示', '请先登录', '💡');
        return;
      }
      
      // 从localStorage获取token
      const token = localStorage.getItem('publisher_auth_token');
      console.log('fetchFinanceData: 获取到token', token ? '是' : '否');
      
      if (!token) {
        console.log('fetchFinanceData: 未获取到token，提示登录');
        showAlert('提示', '请先登录', '💡');
        return;
      }

      console.log('fetchFinanceData: 准备发送API请求到 /api/publisher/finance');
      const response = await fetch('/api/publisher/finance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      console.log('fetchFinanceData: API请求完成，状态码:', response.status);
      const data = await response.json();
      console.log('fetchFinanceData: API返回数据', data);
      
      if (data.success && data.data) {
        console.log('fetchFinanceData: 数据获取成功，开始处理余额数据');
        console.log('fetchFinanceData: 原始余额数据结构:', data.data);
        
        // 直接获取并使用后端返回的余额数据
        const newBalance: BalanceData = {
          balance: data.data.balance?.total || 0
        };
        
        console.log('fetchFinanceData: 使用后端返回的余额数据:', newBalance);
        setBalance(newBalance);
        setTransactions(Array.isArray(data.data.transactions) ? data.data.transactions : []);
        
        // 显示当前登录用户信息
        console.log(`当前登录用户: ${userInfo.username || '未知用户'} (ID: ${userInfo.userId || '未知ID'})`);
      } else {
        console.log('fetchFinanceData: 获取数据失败', data.message || '未知错误');
        showAlert('获取数据失败', data.message || '未知错误', '❌');
      }
    } catch (error) {
      console.error('获取财务数据失败:', error);
      showAlert('网络错误', '获取数据失败，请稍后重试', '❌');
    } finally {
      console.log('fetchFinanceData: 请求完成，设置loading为false');
      setLoading(false);
    }
  };

  // 处理充值
  const handleRecharge = async () => {
    console.log('开始处理充值请求', { rechargeAmount, selectedPaymentMethod });
    
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      console.log('充值金额无效');
      showAlert('输入错误', '请输入有效的充值金额', '⚠️');
      return;
    }

    try {
      // 从token中获取用户信息
      const userInfo = getUserInfoFromToken();
      console.log('handleRecharge: 用户信息', userInfo);
      
      if (!userInfo) {
        console.log('handleRecharge: 未登录');
        showAlert('提示', '请先登录', '💡');
        return;
      }

      // 从localStorage获取token
      const token = localStorage.getItem('publisher_auth_token');
      console.log('handleRecharge: 获取到token', token ? '是' : '否');
      
      if (!token) {
        console.log('handleRecharge: 未获取到token');
        showAlert('提示', '请先登录', '💡');
        return;
      }

      console.log('handleRecharge: 准备发送充值请求', { amount: parseFloat(rechargeAmount), paymentMethod: selectedPaymentMethod });
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

      console.log('handleRecharge: 充值请求完成，状态码:', response.status);
      const data = await response.json();
      console.log('handleRecharge: 充值响应数据', data);
      
      if (data.success) {
        console.log('handleRecharge: 充值成功');
        // 充值成功后只显示提示，不立即刷新数据
        // 用户点击确认后再刷新数据并重置状态
        showAlert('充值成功', data.message, '✅', () => {
          // 用户点击确认后的回调函数
          setRechargeSuccess(true);
          fetchFinanceData();
          setRechargeAmount('');
        });
      } else {
        console.log('handleRecharge: 充值失败', data.message);
        showAlert('充值失败', data.message, '❌');
      }
    } catch (error) {
      console.error('充值失败:', error);
      showAlert('网络错误', '充值失败，请稍后重试', '❌');
    }
  };



  // 初始加载数据
  useEffect(() => {
    fetchFinanceData();
  }, []);

  // 余额字段说明：
  // 1. balance: 主要的余额字段，前端页面直接使用这个字段显示余额
  // 2. currentBalance: 冗余字段，当前实现中与balance保持一致
  // 3. availableBalance: 冗余字段，当前实现中与balance保持一致
  // 这三个字段在当前版本中存储相同的值，是为了未来可能的扩展需求，比如实现余额冻结功能

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
      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveTab('recharge')}
          className={`py-3 px-4 rounded font-medium transition-colors ${
            activeTab === 'recharge' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50'
          }`}
        >
          充值
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
            <div className="text-4xl font-bold">
              {loading ? '加载中...' : `¥${balance.balance.toFixed(2)}`}
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
                      className={`py-2 px-3 border rounded text-sm transition-all duration-300 ${rechargeAmount === amount.toString() ? 'bg-blue-500 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'}`}
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
              <div className="p-4 border-t bg-blue-500 hover:bg-blue-700 mt-4">
                <a href="/publisher/transactions" className="block w-full text-center text-white text-sm transition-colors ">
                  查看全部交易记录
                </a>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={handleAlertClose}
      />
    </div>
  );
}