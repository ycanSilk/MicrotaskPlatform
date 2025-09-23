'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import { FinanceModelAdapter } from '@/data/commenteruser/finance_model_adapter';

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
  taskName: string;
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

export interface WithdrawalConfig {
  minAmount: number;
  fee: number;
  allowedDays: number[];
  maxAmount: number;
}

// 创建FinanceModelAdapter实例
const financeAdapter = FinanceModelAdapter.getInstance();

// API配置常量
const API_CONFIG = {
  baseURL: '/api/commenter',
  endpoints: {
    userAccount: '/finance/account',
    earnings: '/finance/earnings',
    withdrawals: '/finance/withdrawals',
    withdrawalRequest: '/finance/withdrawals/request'
  }
};

// 辅助函数：计算佣金收益 (假设佣金占30%)
const calculateCommissionEarnings = (totalEarnings: number): number => {
  return totalEarnings * 0.3;
};

// 辅助函数：计算任务收益 (假设任务收益占70%)
const calculateTaskEarnings = (totalEarnings: number): number => {
  return totalEarnings * 0.7;
};

// 辅助函数：获取今日是否可提现
const canWithdrawToday = (): boolean => {
  // 由于在UI渲染中不能使用async/await，我们使用默认配置
  // 实际应用中，应该在组件初始化时获取并缓存这些配置
  const today = new Date().getDay();
  // 默认配置：周四可提现
  return today === 4;
};

// 辅助函数：获取提现配置 (同步版本，用于UI渲染)
const getWithdrawalConfig = (): WithdrawalConfig => {
  // 由于在UI渲染中不能使用async/await，我们使用默认配置
  // 实际应用中，应该在组件初始化时获取并缓存这些配置
  return {
    minAmount: 100,
    fee: 2,
    allowedDays: [4], // 周四
    maxAmount: 10000
  };
};

// 辅助函数：获取提现配置 (异步版本，用于业务逻辑)
const getWithdrawalConfigAsync = async (): Promise<WithdrawalConfig> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.userAccount}/config`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('获取提现配置失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取提现配置错误:', error);
    // 返回默认配置
    return getWithdrawalConfig();
  }
};

// 辅助函数：验证提现金额
const validateWithdrawalAmount = async (amount: number, availableBalance: number): Promise<{ isValid: boolean; message?: string }> => {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, message: '请输入有效的提现金额' };
  }

  try {
    const config = await getWithdrawalConfigAsync();
    
    if (amount < config.minAmount) {
      return { isValid: false, message: `提现金额不能低于${config.minAmount}元` };
    }

    if (amount > config.maxAmount) {
      return { isValid: false, message: `提现金额不能超过${config.maxAmount}元` };
    }

    if (amount > availableBalance) {
      return { isValid: false, message: '余额不足' };
    }

    // 使用同步版本的canWithdrawToday进行验证
    const canWithdraw = canWithdrawToday();
    if (!canWithdraw) {
      const allowedDaysText = config.allowedDays.map(day => {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[day];
      }).join('、');
      return { isValid: false, message: `仅${allowedDaysText}可提现` };
    }

    return { isValid: true };
  } catch (error) {
    console.error('验证提现金额错误:', error);
    return { isValid: false, message: '验证提现金额失败' };
  }
};

// 调试日志函数
const debugLog = (stage: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n=====================================\n[收益页面 - ${stage}] ${message}\n=====================================`);
    if (data !== undefined) {
      console.log('[收益页面 - 详细数据]:', data);
    }
  }
};

export default function CommenterEarningsPage() {
  const router = useRouter();
  const { user: hookUser, isLoading: userIsLoading, isLoggedIn: hookIsLoggedIn } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 在组件挂载时立即检查CommenterAuthStorage中的用户信息
  useEffect(() => {
    const checkAuthStatus = () => {
      const commenterUser = CommenterAuthStorage.getCurrentUser();
      if (commenterUser && (!user || !isLoggedIn)) {
        debugLog("初始化", "组件挂载时检测到CommenterAuthStorage中有用户信息，更新页面状态");
        setUser(commenterUser);
        setIsLoggedIn(true);
      }
    };
    
    // 立即执行检查
    checkAuthStatus();
  }, []);

  // 监听useUser hook的状态变化，确保与实际认证状态同步
  useEffect(() => {
    if (hookUser && hookIsLoggedIn && (!user || !isLoggedIn)) {
      debugLog("状态同步", "useUser hook状态已更新，同步到页面状态");
      setUser(hookUser);
      setIsLoggedIn(hookIsLoggedIn);
    } else if (!hookUser && !hookIsLoggedIn) {
      // 当hook状态为未登录时，检查CommenterAuthStorage
      const commenterUser = CommenterAuthStorage.getCurrentUser();
      if (commenterUser) {
        debugLog("状态同步", "useUser hook状态为未登录，但CommenterAuthStorage有用户信息，更新页面状态");
        setUser(commenterUser);
        setIsLoggedIn(true);
      }
    }
  }, [hookUser, hookIsLoggedIn, user, isLoggedIn]);
  
  // 直接从CommenterAuthStorage获取评论员用户信息
  const getCommenterUser = () => {
    try {
      debugLog('用户获取', '开始从CommenterAuthStorage获取用户');
      const commenterUser = CommenterAuthStorage.getCurrentUser();
      debugLog('用户获取', '从CommenterAuthStorage获取用户结果', {
        hasUser: !!commenterUser,
        userId: commenterUser?.id,
        userName: commenterUser?.username
      });
      
      return commenterUser;
    } catch (error) {
      debugLog('用户获取', '获取评论员用户失败', error);
      return null;
    }
  };
  
  // 定期检查CommenterAuthStorage中的用户状态
  useEffect(() => {
    const checkAuthStorage = () => {
      const commenterUser = getCommenterUser();
      if (commenterUser && (!user || !isLoggedIn)) {
        debugLog('状态同步', '检测到CommenterAuthStorage有用户但组件状态未更新，更新状态');
        setUser(commenterUser);
        setIsLoggedIn(true);
      }
    };
    
    // 初始检查
    checkAuthStorage();
    
    // 设置一个短的延迟来再次检查，确保状态更新
    const timer = setTimeout(checkAuthStorage, 100);
    
    return () => clearTimeout(timer);
  }, [user, isLoggedIn]);

  // 初始化数据检查
  useEffect(() => {
    const initializeData = async () => {
      try {
        debugLog('数据加载', '开始检查用户状态', {
          isLoggedIn,
          user: user ? { id: user.id, username: user.username } : null
        });
        setIsLoading(true);
        setError(null);

        // 验证用户 - 优先使用useUser hook的结果
        if (!isLoggedIn || !user) {
          debugLog('数据加载', 'useUser hook显示未登录状态', { isLoggedIn, user });
          // 如果useUser hook显示未登录，尝试直接从CommenterAuthStorage获取
          const commenterUser = getCommenterUser();
          if (!commenterUser) {
            debugLog('数据加载', 'CommenterAuthStorage也未找到用户，设置未登录错误');
            setError('请先登录');
            setIsLoading(false);
            return;
          }
          
          debugLog('数据加载', '发现CommenterAuthStorage有用户，更新状态', {
            commenterUserId: commenterUser.id
          });
          setUser(commenterUser);
          setIsLoggedIn(true);
        }

        debugLog('数据加载', '用户状态检查完成');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '加载数据失败';
        setError(errorMessage);
        debugLog('数据加载', '加载失败', error);
      } finally {
        setIsLoading(false);
        debugLog('数据加载', '初始化数据完成，加载状态已更新', { isLoading: false });
      }
    };

    initializeData();
  }, [user, isLoggedIn]); // 添加依赖项，当用户状态变化时重新检查

  // 加载状态显示
  if (userIsLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }
  
  // 未登录状态显示
  if (!isLoggedIn || !user) {
    debugLog('页面渲染', '检测到未登录或状态不完整，执行额外检查', {
      isLoggedIn,
      hasUser: !!user,
    });
    // 尝试直接从CommenterAuthStorage获取用户，以解决状态同步问题
    const commenterUser = getCommenterUser();
    debugLog('页面渲染', '额外检查结果', {
      hasCommenterUser: !!commenterUser,
      commenterUserId: commenterUser?.id
    });
    
    debugLog('页面渲染', '确认用户未登录，显示登录提示');
    // 真正未登录或有错误时才显示登录提示
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-xl font-bold mb-4">{error || '请先登录'}</h2>
        <button 
          onClick={() => router.push('/auth/login/commenterlogin')}
          className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
        >
          前往登录
        </button>
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

  return (
    <div className="pb-20">
      {/* 收益类型切换 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button 
          onClick={() => router.push('/commenter/earnings/overview')}
          className={`py-3 px-4 rounded font-medium transition-colors bg-blue-500 text-white shadow-md`}
        >
          概览
        </button>
        <button 
          onClick={() => router.push('/commenter/earnings/details')}
          className={`py-3 px-4 rounded font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-blue-50`}
        >
          明细
        </button>
        <button 
          onClick={() => router.push('/commenter/earnings/withdraw')}
          className={`py-3 px-4 rounded font-medium transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-blue-50`}
        >
          提现
        </button>
      </div>
    </div>
  );
}