'use client';
import React from 'react';
import CommenterHallContentPage from '../hall-content/page';
import TopNavigationBar from '../components/TopNavigationBar';
import { CommenterAuthStorage } from '@/auth/commenter/auth';

export default function CommenterHallPage() {
  // 获取当前登录用户信息
  const currentUser = CommenterAuthStorage.getCurrentUser();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 使用固定的顶部导航栏 */}
      <TopNavigationBar user={currentUser} />
      
      {/* 主内容区域，添加padding-top避免被固定导航栏遮挡 */}
      <div className="pt-16">
        {/* 页面标题区域 */}
        <div className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <h1 className="text-lg font-bold text-gray-800">抢单大厅</h1>
          </div>
        </div>
        
        {/* 引入抢单内容页面 */}
        <CommenterHallContentPage />
      </div>
    </div>
  );
}


