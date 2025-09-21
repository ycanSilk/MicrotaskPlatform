'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
// 导入数据文件
import commenterAccounts from '@/data/commenteruser/commenterAccount.json';
import earningsRecords from '@/data/commenteruser/earningsRecords.json';
import withdrawalRecords from '@/data/commenteruser/withdrawalRecords.json';

interface CommenterAccount {
  userId: string;
  availableBalance: number;
  frozenBalance: number;
  totalEarnings: number;
  completedTasks: number;
  lastUpdated: string;
}

interface EarningRecord {
  id: string;
  userId: string;
  taskId: string;
  taskName: string;
  amount: number;
  status: string;
  earnedTime: string;
  description: string;
}

interface WithdrawalRecord {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  totalAmount: number;
  method: string;
  status: string;
  requestTime: string;
  completeTime: string | null;
  description: string;
}

export default function CommenterEarningsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('wechat');
  const [currentUserAccount, setCurrentUserAccount] = useState<CommenterAccount | null>(null);
  const [currentEarnings, setCurrentEarnings] = useState<EarningRecord[]>([]);
  const [currentWithdrawals, setCurrentWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // 使用useUser hook获取当前登录用户信息
  const { user, isLoading, isLoggedIn } = useUser();
  
  // 获取当前用户的账户数据
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setCurrentUserAccount(null);
      setCurrentEarnings([]);
      setCurrentWithdrawals([]);
      return;
    }
    
    // 从数据文件中查找当前用户的账户信息
    const userAccount = commenterAccounts.accounts.find(account => account.userId === user.id);
    setCurrentUserAccount(userAccount || null);
    
    // 过滤当前用户的收益记录
    const userEarnings = earningsRecords.earnings
      .filter(earning => earning.userId === user.id)
      .sort((a, b) => new Date(b.earnedTime).getTime() - new Date(a.earnedTime).getTime());
    setCurrentEarnings(userEarnings);
    
    // 过滤当前用户的提现记录
    const userWithdrawals = withdrawalRecords.withdrawals
      .filter(withdrawal => withdrawal.userId === user.id)
      .sort((a, b) => new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime());
    setCurrentWithdrawals(userWithdrawals);
  }, [user, isLoggedIn]);
  
  // 计算今日收益
  const calculateTodayEarnings = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEarnings = currentEarnings.filter(earning => 
      earning.earnedTime.startsWith(today)
    ).reduce((sum, earning) => sum + earning.amount, 0);
    return todayEarnings;
  };
  
  // 计算昨日收益
  const calculateYesterdayEarnings = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayEarnings = currentEarnings.filter(earning => 
      earning.earnedTime.startsWith(yesterdayStr)
    ).reduce((sum, earning) => sum + earning.amount, 0);
    return yesterdayEarnings;
  };
  
  // 计算本周收益
  const calculateWeeklyEarnings = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyEarnings = currentEarnings.filter(earning => 
      new Date(earning.earnedTime) >= weekStart
    ).reduce((sum, earning) => sum + earning.amount, 0);
    return weeklyEarnings;
  };
  
  // 计算本月收益
  const calculateMonthlyEarnings = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyEarnings = currentEarnings.filter(earning => 
      new Date(earning.earnedTime) >= monthStart
    ).reduce((sum, earning) => sum + earning.amount, 0);
    return monthlyEarnings;
  };
  
  // 计算佣金收益 - 假设佣金是总收益的10%
  const calculateCommissionEarnings = (totalEarnings: number) => {
    return totalEarnings * 0.1;
  };
  
  // 计算任务收益 - 总收益减去佣金
  const calculateTaskEarnings = (totalEarnings: number) => {
    return totalEarnings - calculateCommissionEarnings(totalEarnings);
  };
  
  // 检查是否可以提现（是否是周四）
  const canWithdrawToday = () => {
    const today = new Date();
    // 4代表周四（0=周日, 1=周一, ..., 4=周四）
    return today.getDay() === 4;
  };
  
  // 处理提现申请
  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    
    // 检查是否已登录
    if (!isLoggedIn || !user) {
      setMessage('请先登录');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 检查是否是周四
    if (!canWithdrawToday()) {
      setMessage('提现功能仅在每周四开放，请在周四进行提现操作。');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 验证提现金额
    if (!amount || isNaN(amount)) {
      setMessage('请输入有效的提现金额');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 检查最低提现金额
    if (amount < 100) {
      setMessage('最低提现金额为100元');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 检查是否为100元的整数倍
    if (amount % 100 !== 0) {
      setMessage('提现金额必须为100元的整数倍');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 验证用户状态和余额
    if (!currentUserAccount || amount > currentUserAccount.availableBalance) {
      setMessage('余额不足，无法完成提现');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // 创建新的提现记录，状态设置为"pending"（待审核）
    const newWithdrawal = {
      id: `wd${Date.now()}`,
      userId: user.id,
      amount: amount,
      fee: 2.00,
      totalAmount: amount + 2.00,
      method: withdrawalMethod,
      status: 'pending',
      requestTime: new Date().toISOString(),
      completeTime: null,
      description: withdrawalMethod === 'wechat' ? '微信提现' : 
                   withdrawalMethod === 'alipay' ? '支付宝提现' : '银行卡提现'
    };
    
    // 在实际应用中，这里应该调用API保存提现记录
    // 这里我们仅做本地模拟处理
    setMessage(`提现申请已提交，金额：¥${amount}，等待管理员审核`);
    
    // 重置表单
    setWithdrawalAmount('');
    
    // 切换到提现记录标签
    setTimeout(() => {
      setMessage('');
      setActiveTab('withdraw');
    }, 2000);
  };

  // 加载状态显示
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }
  
  // 未登录状态显示
  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-xl font-bold mb-4">请先登录</h2>
        <button 
          onClick={() => router.push('/auth/login/commenterlogin')}
          className="bg-blue-500 text-white px-6 py-2 rounded font-medium"
        >
          前往登录
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">

      {/* 收益类型切换 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          概览
        </button>
        <button 
          onClick={() => setActiveTab('details')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'details' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          明细
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'withdraw' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          提现
        </button>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className="mx-4 mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          {message}
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {/* 今日收益 */}
          <div className="mx-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="text-center">
                <div className="text-base mb-3">今日收益</div>
                <div className="text-2xl font-bold text-yellow-200 mb-2">总收益：¥{calculateTodayEarnings().toFixed(2)}</div>
                <div className="text-xl font-semibold mb-1">佣金收益：¥{calculateCommissionEarnings(calculateTodayEarnings()).toFixed(2)}</div>
                <div className="text-xl font-semibold">任务收益：¥{calculateTaskEarnings(calculateTodayEarnings()).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* 历史收益 */}
          <div className="mx-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-orange-600 mb-1">昨日</div>
                <div className="text-xl font-bold text-orange-600 mb-1">总收益：¥{calculateYesterdayEarnings().toFixed(2)}</div>
                <div className="text-base font-semibold text-orange-500">佣金收益：¥{calculateCommissionEarnings(calculateYesterdayEarnings()).toFixed(2)}</div>
                <div className="text-base font-semibold text-orange-700">任务收益：¥{calculateTaskEarnings(calculateYesterdayEarnings()).toFixed(2)}</div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-green-600 mb-1">本周</div>
                <div className="text-xl font-bold text-green-600 mb-1">总收益：¥{calculateWeeklyEarnings().toFixed(2)}</div>
                <div className="text-base font-semibold text-green-500">佣金收益：¥{calculateCommissionEarnings(calculateWeeklyEarnings()).toFixed(2)}</div>
                <div className="text-base font-semibold text-green-700">任务收益：¥{calculateTaskEarnings(calculateWeeklyEarnings()).toFixed(2)}</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-blue-600 mb-1">本月</div>
                <div className="text-xl font-bold text-blue-600 mb-1">总收益：¥{calculateMonthlyEarnings().toFixed(2)}</div>
                <div className="text-base font-semibold text-blue-500">佣金收益：¥{calculateCommissionEarnings(calculateMonthlyEarnings()).toFixed(2)}</div>
                <div className="text-base font-semibold text-blue-700">任务收益：¥{calculateTaskEarnings(calculateMonthlyEarnings()).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* 可提现金额 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">可提现余额</div>
                <div className="text-2xl font-bold text-green-600">¥{currentUserAccount?.availableBalance?.toFixed(2) || '0.00'}</div>
              </div>
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded font-medium"
                onClick={() => setActiveTab('withdraw')}
              >
                立即提现
              </button>
            </div>
          </div>

          {/* 收益统计 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">收益统计</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">¥{currentUserAccount?.totalEarnings?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-gray-500">累计收益</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-lg font-bold text-orange-600">{currentUserAccount?.completedTasks || 0}</div>
                  <div className="text-xs text-gray-500">完成任务</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'details' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">收益明细</h3>
            </div>
            <div className="divide-y">
              {currentEarnings.map((earning) => {
                // 格式化日期时间
                const date = new Date(earning.earnedTime);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                return (
                  <div key={earning.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">{earning.taskName}</div>
                      <div className="text-xs text-gray-500">{formattedDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">+¥{earning.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{earning.status === 'completed' ? '已到账' : '处理中'}</div>
                    </div>
                  </div>
                );
              })}
              
              {/* 显示提现手续费记录 */}
              {currentWithdrawals.map((withdrawal) => {
                if (withdrawal.status === 'completed' && withdrawal.fee > 0) {
                  const date = new Date(withdrawal.requestTime);
                  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                  
                  return (
                    <div key={`fee-${withdrawal.id}`} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">提现手续费</div>
                        <div className="text-xs text-gray-500">{formattedDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">-¥{withdrawal.fee.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">已扣除</div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              
              {currentEarnings.length === 0 && currentWithdrawals.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  暂无收益记录
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">提现申请</h3>
            
            {/* 提现时间限制提示 */}
            {!canWithdrawToday() && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-orange-800">
                  <div className="font-medium mb-1">提现时间提示：</div>
                  <p className="text-xs">提现功能仅在每周四开放，请在周四进行提现操作。</p>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提现金额
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  placeholder="请输入提现金额（100元的整数倍）"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!canWithdrawToday()}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                可提现余额：¥{currentUserAccount?.availableBalance?.toFixed(2) || '0.00'} | 最低提现：¥100.00 | 提现金额必须为100元的整数倍
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提现方式
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="method" 
                    value="wechat"
                    checked={withdrawalMethod === 'wechat'}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="mr-2"
                    disabled={!canWithdrawToday()}
                  />
                  <span className="text-sm">微信钱包</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="method" 
                    value="alipay"
                    checked={withdrawalMethod === 'alipay'}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="mr-2"
                    disabled={!canWithdrawToday()}
                  />
                  <span className="text-sm">支付宝</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="method" 
                    value="bank"
                    checked={withdrawalMethod === 'bank'}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="mr-2"
                    disabled={!canWithdrawToday()}
                  />
                  <span className="text-sm">银行卡</span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-1">提现说明：</div>
                <ul className="text-xs space-y-1">
                  <li>• 提现手续费：2元/笔</li>
                  <li>• 仅允许在每周四发起提现申请</li>
                  <li>• 提现金额必须为100元的整数倍</li>
                  <li>• 申请提交后，系统将自动创建提现订单并进入待审核状态</li>
                  <li>• 管理员审核通过并完成线下转账后，订单状态将更新为完结</li>
                </ul>
              </div>
            </div>

            <button 
              className="w-full bg-green-500 text-white py-3 rounded font-medium"
              onClick={handleWithdrawal}
              disabled={!canWithdrawToday() || !currentUser || parseFloat(withdrawalAmount) < 100 || parseFloat(withdrawalAmount) > currentUser.availableBalance || parseFloat(withdrawalAmount) % 100 !== 0}
            >
              {canWithdrawToday() ? '申请提现' : '今日不可提现（仅周四可提现）'}
            </button>
          </div>

          {/* 提现记录 */}
          <div className="bg-white rounded-lg shadow-sm mt-4">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">提现记录</h3>
            </div>
            <div className="divide-y">
              {currentWithdrawals.map((withdrawal) => {
                const date = new Date(withdrawal.requestTime);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                return (
                  <div key={withdrawal.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">{withdrawal.description}</div>
                      <div className="text-xs text-gray-500">{formattedDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">¥{withdrawal.amount.toFixed(2)}</div>
                      <div className={`text-xs ${withdrawal.status === 'completed' ? 'text-green-600' : withdrawal.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {withdrawal.status === 'completed' ? '已完结' : withdrawal.status === 'pending' ? '待审核' : '已拒绝'}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {currentWithdrawals.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  暂无提现记录
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 查看明细 */}
      {activeTab === 'overview' && (
        <div className="mx-4 mt-4">
          <button 
            onClick={() => setActiveTab('details')}
            className="w-full bg-white border border-gray-300 text-gray-600 py-3 rounded text-center"
          >
            查看明细
          </button>
        </div>
      )}
    </div>
  );
}