import React from 'react';
import type { CommenterAccount, DailyEarning } from '../page';

interface EarningsOverviewProps {
  currentUserAccount: CommenterAccount | null;
  dailyEarnings: DailyEarning[];
  stats: {
    todayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
  };
  setActiveTab: (tab: 'overview' | 'details' | 'withdraw') => void;
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({
  currentUserAccount,
  dailyEarnings,
  stats,
  setActiveTab
}) => {
  // 辅助函数：计算佣金收益 (假设佣金占30%)
  const calculateCommissionEarnings = (totalEarnings: number): number => {
    return totalEarnings * 0.3;
  }

  // 辅助函数：计算任务收益 (假设任务收益占70%)
  const calculateTaskEarnings = (totalEarnings: number): number => {
    return totalEarnings * 0.7;
  }

  // 格式化日期（月/日）
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // 生成模拟的7天数据（如果没有传入数据）
  const getEarningsData = () => {
    if (dailyEarnings && dailyEarnings.length > 0) {
      return dailyEarnings;
    }
    
    // 生成最近7天的模拟数据
    const mockData: DailyEarning[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      mockData.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 100) + 10 // 10-109的随机金额
      });
    }
    
    return mockData;
  };

  // 计算Y轴刻度 - 固定使用0,50,100,200,500,1000
  const calculateYAxisTicks = () => {
    return [1000, 500, 200, 100, 50, 0];
  };

  const earningsData = getEarningsData();
  const yAxisTicks = calculateYAxisTicks();

  return (
    <>
      {/* 今日收益 */}
      <div className="mx-4 mt-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
          <div className="text-center">
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', marginBottom: '12px' }}>今日收益</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#FFE066', marginBottom: '8px' }}>总收益：¥{stats.todayEarnings.toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', marginBottom: '4px' }}>佣金收益：¥{calculateCommissionEarnings(stats.todayEarnings).toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600' }}>任务收益：¥{calculateTaskEarnings(stats.todayEarnings).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 历史收益 */}
      <div className="mx-4 mt-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#DD6B20', marginBottom: '4px' }}>昨日</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#DD6B20', marginBottom: '4px' }}>总收益：¥{stats.todayEarnings.toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#ED8936' }}>佣金收益：¥{calculateCommissionEarnings(stats.todayEarnings).toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#C05621' }}>任务收益：¥{calculateTaskEarnings(stats.todayEarnings).toFixed(2)}</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#2F855A', marginBottom: '4px' }}>本周</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#2F855A', marginBottom: '4px' }}>总收益：¥{stats.weeklyEarnings.toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#48BB78' }}>佣金收益：¥{calculateCommissionEarnings(stats.weeklyEarnings).toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#276749' }}>任务收益：¥{calculateTaskEarnings(stats.weeklyEarnings).toFixed(2)}</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#2B6CB0', marginBottom: '4px' }}>本月</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#2B6CB0', marginBottom: '4px' }}>总收益：¥{stats.monthlyEarnings.toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#4299E1' }}>佣金收益：¥{calculateCommissionEarnings(stats.monthlyEarnings).toFixed(2)}</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: '600', color: '#2C5282' }}>任务收益：¥{calculateTaskEarnings(stats.monthlyEarnings).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 可提现金额 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#4A5568' }}>可提现余额</div>
            <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#2F855A' }}>¥{currentUserAccount?.availableBalance?.toFixed(2) || '0.00'}</div>
          </div>
          <button 
            className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition-colors"
            onClick={() => setActiveTab('withdraw')}
          >
            立即提现
          </button>
        </div>
      </div>

      {/* 收益统计 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#1A202C', marginBottom: '16px' }}>收益统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#2B6CB0' }}>¥{currentUserAccount?.totalEarnings?.toFixed(2) || '0.00'}</div>
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#4A5568' }}>累计收益</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#DD6B20' }}>{currentUserAccount?.completedTasks || 0}</div>
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#4A5568' }}>完成任务</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#2F855A' }}>¥{currentUserAccount ? calculateCommissionEarnings(currentUserAccount.totalEarnings || 0).toFixed(2) : '0.00'}</div>
              <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#4A5568' }}>累计佣金</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7天收益趋势 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', fontWeight: 'bold', color: '#1A202C', marginBottom: '16px' }}>近7天收益趋势</h3>
          <div className="h-80">
            {/* 改进的柱状图展示 */}
            <div className="h-full relative">
              {/* Y轴刻度线和标签 */}
              <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between">
                {yAxisTicks.map((tick, index) => (
                  <div key={index} className="relative">
                    <div className="h-px bg-gray-200 absolute right-0 left-12"></div>
                    <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#718096' }}>¥{tick}</div>
                  </div>
                ))}
              </div>
                
              {/* 柱状图主体 */}
              <div className="ml-16 h-full flex justify-between items-end px-2">
                {earningsData.map((item, index) => {
                  // 按照实际数值与最大Y轴刻度(1000)的比例计算高度
                    const heightPercentage = Math.min((item.amount / 1000) * 100, 100);
                  const formattedDate = formatDateShort(item.date);
                      
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      {/* 柱状图 */}
                      <div 
                        className="bg-blue-500 transition-all duration-300 hover:bg-blue-600 relative"
                        style={{ height: `${Math.max(heightPercentage, 5)}%`, minHeight: '10px', width: '80%' }}
                      >
                        {/* 金额标注 */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#1A202C', fontWeight: 'bold' }}>¥{item.amount.toFixed(2)}</div>
                        </div>
                      </div>
                      {/* 日期标签 */}
                      <div style={{ fontSize: '12px', fontFamily: 'SimHei, sans-serif', color: '#4A5568', marginTop: '4px' }}>{formattedDate}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default EarningsOverview;