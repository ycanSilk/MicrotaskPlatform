'use client';

import { Card } from '@/components/ui';

export const InviteRules = () => {
  const rules = [
    {
      step: '1',
      title: '好友注册送奖励',
      description: '邀请评论员注册送 ¥20，派单员注册送 ¥50',
      color: 'bg-green-100 text-green-600',
    },
    {
      step: '2', 
      title: '持续佣金收益',
      description: '好友每笔收益，你得 2-3% 提成，躺赚不停',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      step: '3',
      title: '佣金每日结算',
      description: '佣金每日结算，满 ¥10 可提现，秒到账',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="px-4 pb-4">
      <Card>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">佣金规则</h3>
          
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.step} className="flex items-start space-x-3">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${rule.color}
                `}>
                  {rule.step}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{rule.title}</div>
                  <div className="text-sm text-gray-600">{rule.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 额外说明 */}
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">💡</span>
              <div className="text-sm text-yellow-800">
                <strong>温馨提示：</strong>
                邀请的好友越活跃，你的收益越高。快分享给身边的朋友，一起赚钱吧！
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};