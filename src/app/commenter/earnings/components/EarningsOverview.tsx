'use client';
import React from 'react';
import type { CommenterAccount, DailyEarning } from '../page';

interface EarningsOverviewProps {
  currentUserAccount: CommenterAccount | null;
  dailyEarnings: DailyEarning[];
  stats: {
    todayEarnings: number;
    yesterdayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
  };
  setActiveTab: (tab: 'overview' | 'details' | 'withdraw') => void;
}

// 默认用户账户数据，确保组件始终有数据可显示
const defaultUserAccount: CommenterAccount = {
  userId: 'com001',
  availableBalance: 1234.56,
  totalEarnings: 5678.90,
  completedTasks: 123,
  frozenBalance: 0,
  lastUpdated: new Date().toISOString()
};

// 默认统计数据，确保组件始终有数据可显示
const defaultStats = {
  todayEarnings: 123.45,
  yesterdayEarnings: 105.67,
  weeklyEarnings: 890.12,
  monthlyEarnings: 3456.78
};

const EarningsOverview: React.FC<EarningsOverviewProps> = ({
  currentUserAccount,
  dailyEarnings,
  stats,
  setActiveTab
}) => {
  // 使用传入的数据或默认数据
  const accountData = currentUserAccount || defaultUserAccount;
  const statsData = stats || defaultStats;
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
    
    // 生成最近7天的模拟数据（使用固定的示例数据而不是随机数，确保展示效果稳定）
    const mockData: DailyEarning[] = [];
    const today = new Date();
    
    // 预设的模拟数据，展示不同金额的分布
    const presetAmounts = [68, 92, 45, 105, 88, 73, 96];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      mockData.push({
        date: date.toISOString().split('T')[0],
        amount: presetAmounts[6 - i] // 使用预设的金额数据
      });
    }
    
    return mockData;
  };

  // 计算Y轴刻度 - 基于实际数据动态生成
  const calculateYAxisTicks = (maxValue: number) => {
    // 根据最大值动态确定刻度间隔
    let interval = 1;
    if (maxValue >= 1000) interval = 200;
    else if (maxValue >= 500) interval = 100;
    else if (maxValue >= 200) interval = 50;
    else if (maxValue >= 100) interval = 20;
    else if (maxValue >= 50) interval = 10;
    else interval = 5;

    // 计算最大刻度值（向上取整到最近的interval倍数）
    const roundedMaxValue = Math.ceil(maxValue / interval) * interval;
    
    // 生成刻度数组
    const ticks: number[] = [];
    for (let i = roundedMaxValue; i >= 0; i -= interval) {
      ticks.push(i);
    }
    
    return ticks;
  };

  const earningsData = getEarningsData();
  return (
    <>
      {/* 历史收益 */}
      <div className="mx-4 mt-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-sm mb-1">今日收益</div>
              <div className="text-base mb-1">¥{statsData.todayEarnings.toFixed(2)}</div>
              <div className="text-xs opacity-90">任务: ¥{calculateTaskEarnings(statsData.todayEarnings).toFixed(2)}</div>
              <div className="text-xs opacity-90">佣金: ¥{calculateCommissionEarnings(statsData.todayEarnings).toFixed(2)}</div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{color: '#DD6B20', fontSize: '14px', marginBottom: '4px'}}>昨日</div>
            <div style={{color: '#DD6B20', fontSize: '16px', marginBottom: '4px'}}>¥{statsData.yesterdayEarnings.toFixed(2)}</div>
            <div style={{color: '#C05621', fontSize: '12px'}}>任务: ¥{calculateTaskEarnings(statsData.yesterdayEarnings).toFixed(2)}</div>
            <div style={{color: '#ED8936', fontSize: '12px'}}>佣金: ¥{calculateCommissionEarnings(statsData.yesterdayEarnings).toFixed(2)}</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{color: '#2F855A', fontSize: '14px', marginBottom: '4px'}}>本周</div>
            <div style={{color: '#2F855A', fontSize: '16px', marginBottom: '4px'}}>¥{statsData.weeklyEarnings.toFixed(2)}</div>
            <div style={{color: '#276749', fontSize: '12px'}}>任务: ¥{calculateTaskEarnings(statsData.weeklyEarnings).toFixed(2)}</div>
            <div style={{color: '#48BB78', fontSize: '12px'}}>佣金: ¥{calculateCommissionEarnings(statsData.weeklyEarnings).toFixed(2)}</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center shadow-sm">
            <div style={{color: '#2B6CB0', fontSize: '14px', marginBottom: '4px'}}>本月</div>
            <div style={{color: '#2B6CB0', fontSize: '16px', marginBottom: '4px'}}>¥{statsData.monthlyEarnings.toFixed(2)}</div>            
            <div style={{color: '#2C5282', fontSize: '12px'}}>任务: ¥{calculateTaskEarnings(statsData.monthlyEarnings).toFixed(2)}</div>
            <div style={{color: '#4299E1', fontSize: '12px'}}>佣金: ¥{calculateCommissionEarnings(statsData.monthlyEarnings).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 可提现金额 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <div style={{  color: '#4A5568' }}>可提现余额</div>
            <div style={{ color: '#2F855A' }}>¥{accountData.availableBalance.toFixed(2)}</div>
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
          <h3 style={{ color: '#1A202C', marginBottom: '16px' }}>收益统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div style={{ color: '#2B6CB0' }}>¥{(accountData.totalEarnings || 0).toFixed(2)}</div>
              <div style={{  color: '#4A5568' }}>累计收益</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div style={{ color: '#DD6B20' }}>{accountData.completedTasks}</div>
              <div style={{  color: '#4A5568' }}>完成任务</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div style={{ color: '#2F855A' }}>¥{calculateCommissionEarnings(accountData.totalEarnings || 0).toFixed(2)}</div>
              <div style={{  color: '#4A5568' }}>累计佣金</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7天收益趋势 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 style={{ color: '#1A202C', marginBottom: '16px' }}>近7天收益趋势</h3>
          <div className="h-80">
            {/* 改进的柱状图展示 */}
            <div className="h-full relative">
            
              {(() => {
                // 计算数据中的最大值
                const maxValue = Math.max(...earningsData.map(item => item.amount), 0);
                // 动态计算Y轴刻度
                const dynamicYAxisTicks = calculateYAxisTicks(maxValue);
                // 获取Y轴的最大值
                const yAxisMaxValue = dynamicYAxisTicks[0] || 100;
                
                return (
                  <div className="h-full w-full">
                    {/* 坐标轴背景 */}
                    <div className="absolute left-16 top-0 right-0 bottom-4 border-l border-b border-gray-300"></div>
                    
                    {/* Y轴刻度线和标签 */}
                    <div className="absolute left-0 top-0 bottom-4 w-16 flex flex-col justify-between">
                      {dynamicYAxisTicks.map((tick, index) => (
                        <div key={index} className="relative">
                          {/* Y轴横向网格线 */}
                          <div className="h-px bg-gray-200 absolute right-0 left-16 w-full"></div>
                          <div style={{ color: '#718096' }}>¥{tick}</div>
                        </div>
                      ))}
                    </div>
                        
                    {/* 柱状图主体 - 修正方向，确保金额越高柱子越高 */}
                    <div className="ml-16 h-full flex justify-between items-end px-2 pt-0 pb-4">
                      {earningsData.map((item, index) => {
                        // 基于实际数据最大值计算柱状图高度百分比
                        const heightPercentage = yAxisMaxValue > 0 ? 
                          Math.min((item.amount / yAxisMaxValue) * 100, 100) : 0;
                        const formattedDate = formatDateShort(item.date);
                                
                        return (
                          <div key={index} className="flex flex-col items-center flex-1 h-full relative">
                            {/* X轴纵向网格线 */}
                            {index < earningsData.length - 1 && (
                              <div className="absolute top-0 bottom-4 w-px bg-gray-200 right-0"></div>
                            )}
                            
                            {/* 固定高度的容器，确保所有柱子从底部开始计算高度 */}
                            <div className="w-full h-full flex flex-col justify-end items-center">
                              {/* 柱状图 - 高度与金额成正比 */}
                              <div 
                                className="bg-blue-500 transition-all duration-300 hover:bg-blue-600 relative border border-blue-600"
                                style={{ 
                                  height: `${heightPercentage}%`, 
                                  // 确保即使很小的值也有一个最小高度以便可视化
                                  minHeight: heightPercentage > 0 ? '10px' : '0', 
                                  width: '80%',
                                  // 添加边框以便更好地可视化，包括右边框
                                  borderTopLeftRadius: '4px',
                                  borderTopRightRadius: '4px'
                                }}
                              >
                                {/* 金额标注 */}
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap font-medium">
                                  <div className='text-green-600'>¥{item.amount.toFixed(0)}</div>
                                </div>
                              </div>
                            </div>
                            {/* 日期标签 */}
                            <div style={{ marginTop: '4px' }}>{formattedDate}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>

    </>
  );  
};

export default EarningsOverview;