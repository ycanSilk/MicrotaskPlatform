'use client';

import { useState } from 'react';
import { Card, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  role: 'commenter' | 'publisher';
  joinDate: string;
  totalEarnings: number;
  todayEarnings: number;
  status: 'active' | 'inactive';
}

// 模拟数据
const mockFriends: Friend[] = [
  {
    id: '1',
    name: '张小美',
    role: 'commenter',
    joinDate: '2024-01-15T10:00:00.000Z',
    totalEarnings: 45.6,
    todayEarnings: 8.5,
    status: 'active',
  },
  {
    id: '2',
    name: '李大壮',  
    role: 'publisher',
    joinDate: '2024-01-12T14:30:00.000Z',
    totalEarnings: 128.3,
    todayEarnings: 0,
    status: 'inactive',
  },
  {
    id: '3',
    name: '王小明',
    role: 'commenter', 
    joinDate: '2024-01-18T09:15:00.000Z',
    totalEarnings: 28.9,
    todayEarnings: 3.2,
    status: 'active',
  },
];

export const FriendsList = () => {
  const [friends] = useState<Friend[]>(mockFriends);
  const [filter, setFilter] = useState<'all' | 'commenter' | 'publisher'>('all');

  const filteredFriends = friends.filter(friend => 
    filter === 'all' || friend.role === filter
  );

  const getRoleText = (role: string) => {
    return role === 'commenter' ? '评论员' : '派单员';
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'commenter' ? 'success' : 'primary';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 筛选标签 */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">我的好友</h2>
          <span className="text-sm text-gray-500">共{friends.length}人</span>
        </div>
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'commenter', label: '评论员' },
            { key: 'publisher', label: '派单员' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === item.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 好友列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {filteredFriends.length > 0 ? (
          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center space-x-3">
                  {/* 头像 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {friend.name.charAt(0)}
                  </div>
                  
                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {friend.name}
                      </span>
                      <Badge 
                        variant={getRoleBadgeVariant(friend.role)}
                        size="sm"
                      >
                        {getRoleText(friend.role)}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${
                        friend.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(friend.joinDate)} 加入 · 为你赚取 {formatCurrency(friend.totalEarnings)}
                    </div>
                  </div>
                  
                  {/* 今日佣金 */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-primary-500">
                      {friend.todayEarnings > 0 ? formatCurrency(friend.todayEarnings) : '-'}
                    </div>
                    <div className="text-xs text-gray-500">今日佣金</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-gray-500 mb-2">暂无好友</div>
              <div className="text-sm text-gray-400">快去邀请好友加入吧</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};