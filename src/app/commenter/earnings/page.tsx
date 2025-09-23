'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import { FinanceModelAdapter } from '@/data/commenteruser/finance_model_adapter';
import EarningsOverview from './components/EarningsOverview';
import EarningsDetails from './components/EarningsDetails';
import WithdrawalPage from './components/WithdrawalPage';

// 定义类型接口
export interface DailyEarning {
  date: string;
  amount: number;
}

// 从FinanceModelAdapter导入的数据类型接口
export interface CommenterAccount {
  userId: string;
  availableBalance: number;
  frozenBalance?: number;
  totalEarnings?: number;
  completedTasks?: number;
  lastUpdated?: string;
  todayEarnings?: number;
  yesterdayEarnings?: number;
  weeklyEarnings?: number;
  monthlyEarnings?: number;
  dailyEarnings?: DailyEarning[];
  inviteCode?: string;
  referrerId?: string;
  createdAt?: string;
}
export interface EarningRecord {
  id: string;
  userId: string;
  taskId: string;
  taskName?: string;
  amount: number;
  description: string;
  createdAt: string;
  status?: string;
  type?: string;
  commissionInfo?: {
    hasCommission: boolean;
    commissionRate: number;
    commissionAmount: number;
    commissionRecipient: string;
  };
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  description?: string;
  totalAmount?: number;
}

// 统计数据类型定义
export interface Stats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

export default function CommenterEarningsPage() {
  const router = useRouter();
  const { user: hookUser, isLoading: userIsLoading, isLoggedIn: hookIsLoggedIn } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserAccount, setCurrentUserAccount] = useState<CommenterAccount | null>(null);
  const [currentEarnings, setCurrentEarnings] = useState<EarningRecord[]>([]);
  const [currentWithdrawals, setCurrentWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [dailyEarnings, setDailyEarnings] = useState<DailyEarning[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'withdraw'>('overview');
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'wechat' | 'alipay' | 'bank'>('wechat');
  const [withdrawalLoading, setWithdrawalLoading] = useState<boolean>(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<boolean>(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取用户信息
        const commenterUser = CommenterAuthStorage.getCurrentUser();
        if (!commenterUser) {
          setError('请先登录');
          setIsLoading(false);
          return;
        }
        setUser(commenterUser);
        setIsLoggedIn(true);
        
        const financeAdapter = FinanceModelAdapter.getInstance();
        const userId = commenterUser.id;
        
        // 获取用户账户信息
        const accountInfo = await financeAdapter.getUserAccount(userId);
        if (accountInfo) {
          setCurrentUserAccount(accountInfo);
          setStats({
            todayEarnings: accountInfo.todayEarnings || 0,
            weeklyEarnings: accountInfo.weeklyEarnings || 0,
            monthlyEarnings: accountInfo.monthlyEarnings || 0
          });
          if (accountInfo.dailyEarnings) {
            setDailyEarnings(accountInfo.dailyEarnings);
          }
        }

        // 获取用户收益记录
        const userEarnings = await financeAdapter.getUserEarningsRecords(userId);
        if (userEarnings && userEarnings.length > 0) {
          setCurrentEarnings(userEarnings);
        }

        // 获取用户提现记录
        const userWithdrawals = await financeAdapter.getUserWithdrawalRecords(userId);
        if (userWithdrawals && userWithdrawals.length > 0) {
          setCurrentWithdrawals(userWithdrawals);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
        console.error('初始化数据错误:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // 处理选项卡切换
  const handleTabChange = (tab: 'overview' | 'details' | 'withdraw') => {
    setActiveTab(tab);
    router.push(`/commenter/earnings/${tab}`);
  };

  // 处理提现功能
  const handleWithdrawal = async () => {
    setWithdrawalLoading(true);
    setWithdrawalError(null);
    try {
      // 模拟提现API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 验证金额
      const amount = parseFloat(withdrawalAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('请输入有效的提现金额');
      }
      
      if (currentUserAccount && amount > currentUserAccount.availableBalance) {
        throw new Error('提现金额超过可提现余额');
      }
      
      // 模拟提现成功
      setWithdrawalSuccess(true);
      setWithdrawalAmount('');
      
      // 更新账户余额
      if (currentUserAccount) {
        setCurrentUserAccount(prev => prev ? {
          ...prev,
          availableBalance: prev.availableBalance - amount
        } : null);
      }
    } catch (err) {
      setWithdrawalError(err instanceof Error ? err.message : '提现失败，请稍后重试');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // 格式化日期（月/日）
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-20">
        {/* 收益类型切换 */}
        <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleTabChange('overview')}
            className={`py-3 px-4 rounded font-medium transition-colors bg-blue-500 text-white shadow-md`}
          >
            概览
          </button>
          <button 
            onClick={() => handleTabChange('details')}
            className={`py-3 px-4 rounded font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-blue-50`}
          >
            明细
          </button>
          <button 
            onClick={() => handleTabChange('withdraw')}
            className={`py-3 px-4 rounded font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-blue-50`}
          >
            提现
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mx-4 bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* 根据activeTab渲染不同组件 */}
      {activeTab === 'overview' && (
        <EarningsOverview 
          currentUserAccount={currentUserAccount}
          dailyEarnings={dailyEarnings}
          stats={stats}
          setActiveTab={setActiveTab}
        />
      )}
      
      {activeTab === 'details' && (
        <EarningsDetails 
          currentUserAccount={currentUserAccount}
          earnings={currentEarnings}
          stats={stats}
        />
      )}
      
      {activeTab === 'withdraw' && (
        <WithdrawalPage 
          currentUserAccount={currentUserAccount}
          currentWithdrawals={currentWithdrawals}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          withdrawalMethod={withdrawalMethod}
          setWithdrawalMethod={setWithdrawalMethod}
          handleWithdrawal={handleWithdrawal}
          withdrawalLoading={withdrawalLoading}
          withdrawalSuccess={withdrawalSuccess}
          withdrawalError={withdrawalError}
        />
      )}
    </div>
  );
}