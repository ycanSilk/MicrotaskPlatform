'use client';
import React, { useState } from 'react';
import WithdrawalPage from '../components/WithdrawalPage';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import { FinanceModelAdapter } from '@/data/commenteruser/finance_model_adapter';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';

// 创建FinanceModelAdapter实例
const financeAdapter = FinanceModelAdapter.getInstance();

// 定义类型接口
export interface WithdrawalRequest {
  amount: number;
  method: string;
  accountInfo: string;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  method?: string;
}

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
  dailyEarnings?: Array<{date: string, amount: number}>;
  inviteCode?: string;
  referrerId?: string;
  createdAt?: string;
}

const WithdrawPage = () => {
  const router = useRouter();
  const [currentUserAccount, setCurrentUserAccount] = useState<CommenterAccount | null>(null);
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化数据
  React.useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取当前用户
        const commenterUser = CommenterAuthStorage.getCurrentUser();
        if (!commenterUser) {
          router.push('/auth/login/commenterlogin');
          return;
        }

        // 获取用户账户信息
        const userAccount = await financeAdapter.getUserAccount(commenterUser.id);
        if (userAccount) {
          setCurrentUserAccount(userAccount);
        } else {
          // 设置默认账户数据
          setCurrentUserAccount({
            userId: commenterUser.id,
            availableBalance: 150.5,
            frozenBalance: 50,
            totalEarnings: 200.5
          });
        }

        // 获取提现记录
        const records = await financeAdapter.getUserWithdrawalRecords(commenterUser.id);
        if (records && records.length > 0) {
          setWithdrawalRecords(records);
        } else {
          // 设置默认提现记录
          setWithdrawalRecords([
            {
              id: '1',
              userId: commenterUser.id,
              amount: 100.0,
              status: 'approved',
              createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
              processedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
              method: '微信'
            }
          ]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '加载数据失败';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [router]);

  // 处理选项卡切换
  const setActiveTab = (tab: 'overview' | 'details' | 'withdraw') => {
    switch (tab) {
      case 'overview':
        router.push('/commenter/earnings/overview');
        break;
      case 'details':
        router.push('/commenter/earnings/details');
        break;
      case 'withdraw':
        router.push('/commenter/earnings/withdraw');
        break;
    }
  };

  // 处理提现请求
  const handleWithdrawal = async (amount: number, method: string, accountInfo: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取当前用户
      const commenterUser = CommenterAuthStorage.getCurrentUser();
      if (!commenterUser) {
        router.push('/auth/login/commenterlogin');
        return;
      }

      // 创建提现请求
      const withdrawalRequest = {
        userId: commenterUser.id,
        amount,
        method,
        accountInfo,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // 提交提现请求
      const result = await financeAdapter.submitWithdrawal(withdrawalRequest);
      if (result.success) {
        // 显示成功消息或处理结果
        alert('提现请求已提交，请等待审核');
        router.push('/commenter/earnings/details');
      } else {
        setError(result.message || '提现请求提交失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提现请求处理失败';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <h2 className="text-xl font-bold mb-2 text-red-600">错误</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  // 默认账户数据（用于模拟）
  const defaultAccount = currentUserAccount || {
    userId: 'mock-user-id',
    availableBalance: 150.5,
    frozenBalance: 50,
    totalEarnings: 200.5
  };

  return (
    <WithdrawalPage 
      currentUserAccount={defaultAccount}
      withdrawalRecords={withdrawalRecords}
      handleWithdrawal={handleWithdrawal}
      setActiveTab={setActiveTab}
    />
  );
};

export default WithdrawPage;