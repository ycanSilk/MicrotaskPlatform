'use client';

import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

// 模拟数据
const mockStats = {
  totalEarnings: 856.5,
  friendsCount: 23,
  todayCommission: 28.5,
  monthlyCommission: 186.4,
};

export const InviteOverview = () => {
  return (
    <div className="px-4 pt-4">
      <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">邀请好友赚佣金</h1>
          <p className="text-sm opacity-90 mb-6">好友每次收益，你都有提成</p>
          
          {/* 收益统计 */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(mockStats.totalEarnings)}</div>
              <div className="text-xs opacity-80">累计佣金</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{mockStats.friendsCount}</div>
              <div className="text-xs opacity-80">邀请好友</div>
            </div>
          </div>
          
          {/* 今日数据 */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>今日佣金</span>
              <span className="font-medium">{formatCurrency(mockStats.todayCommission)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>本月佣金</span>
              <span className="font-medium">{formatCurrency(mockStats.monthlyCommission)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};