'use client';

import { Card, Button } from '@/components/ui';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { getRoleHomePath } from '@/auth/common';

// 角色选择卡片组件
const RoleCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  href, 
  features 
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  href: string;
  features: string[];
}) => {
  return (
    <Link href={href as any}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${color}`}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
          <div className="space-y-1 mb-4">
            {features.map((feature, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button className="w-full group-hover:bg-primary-600 transition-colors">
            立即进入
          </Button>
        </div>
      </Card>
    </Link>
  );
};

// 统计数据组件
const StatsSection = () => {
  const [stats] = useState({
    totalUsers: 15234,
    todayTasks: 1268,
    totalRevenue: 2456789,
    activeUsers: 856
  });

  return (
    <Card className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">平台数据</h2>
        <p className="text-sm text-gray-600">实时更新的平台运营数据</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">总用户数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.todayTasks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">今日任务</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            ¥{(stats.totalRevenue / 10000).toFixed(1)}万
          </div>
          <div className="text-xs text-gray-600">平台收益</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {stats.activeUsers}
          </div>
          <div className="text-xs text-gray-600">在线用户</div>
        </div>
      </div>
    </Card>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 抖音派单系统
        </h1>
        <p className="text-gray-600 mb-6">
          H5移动端优先的评论任务平台
        </p>
        <div className="space-y-3">
          <a 
            href="/auth/login"
            className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            登录系统
          </a>
        </div>
      </div>
       {/* 底部说明 */}
        <div className="text-center text-xs text-gray-500 mb-4">
          <p>© 2024 抖音派单系统 版本 v2.0.0</p>
          <p className="mt-1">专业·安全·高效</p>
        </div>
    </div>


       
   

  );
}
      