'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserOutlined, LockOutlined, BarChartOutlined, TrophyOutlined, CreditCardOutlined, FileTextOutlined, SettingOutlined, CheckCircleOutlined, QuestionCircleOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';

export default function CommenterProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const router = useRouter();

  // 退出登录处理
  const handleLogout = () => {
    // 清除本地存储的用户信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
    // 跳转到评论员登录页面
    router.push('/auth/login/commenterlogin');
  };

  return (
    <div className="pb-20">

      {/* 用户信息卡片 */}
      <div className="mx-4 mt-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <UserOutlined className="text-2xl" />
            </div>
            <div>
              <div className="text-xl font-bold">抖音达人小王</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded">Lv.3 评论员</span>
                <span>ID: COM001</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-blue-100">合作任务</div>
            </div>
            <div>
              <div className="text-2xl font-bold">91%</div>
              <div className="text-sm text-blue-100">成功率</div>
            </div>
            <div>
              <div className="text-2xl font-bold">¥2847.60</div>
              <div className="text-sm text-blue-100">总收益</div>
            </div>
          </div>
        </div>
      </div>

      {/* 等级进度 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">等级进度</span>
            <span className="text-sm text-gray-500">还需44个任务升级到Lv.4</span>
          </div>
          <div className="bg-gray-200 h-2 rounded">
            <div className="bg-blue-500 h-2 rounded" style={{width: '68%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Lv.3</span>
            <span>68%</span>
            <span>Lv.4</span>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="mx-4 mt-6 space-y-1">
        <div className="bg-white rounded-lg shadow-sm">
          <button 
            onClick={() => setActiveSection('profile')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <UserOutlined className="text-xl" />
                <span className="font-medium">个人资料</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('security')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <LockOutlined className="text-xl" />
                <span className="font-medium">账号安全</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>

          <button 
            onClick={() => setActiveSection('stats')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <BarChartOutlined className="text-xl" />
                <span className="font-medium">数据统计</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>

          <button 
            onClick={() => setActiveSection('privileges')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <TrophyOutlined className="text-xl" />
                <span className="font-medium">等级特权</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => router.push('/commenter/bank-cards')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <CreditCardOutlined className="text-xl" />
                <span className="font-medium">我的银行卡</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>

          <button 
            onClick={() => setActiveSection('history')}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center space-x-3">
                <FileTextOutlined className="text-xl" />
                <span className="font-medium">任务记录</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>

          <button 
            onClick={() => setActiveSection('settings')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-3">
                <SettingOutlined className="text-xl" />
                <span className="font-medium">设置</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* 详细信息展示 */}
      {activeSection === 'stats' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">详细统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">234</div>
                <div className="text-xs text-gray-500">总完成任务</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">213</div>
                <div className="text-xs text-gray-500">通过审核</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">15</div>
                <div className="text-xs text-gray-500">待审核</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">6</div>
                <div className="text-xs text-gray-500">未通过</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-800 mb-3">任务类型分布</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">美食探店</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 h-2 rounded">
                      <div className="bg-blue-500 h-2 rounded" style={{width: '70%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">89</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">数码评测</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 h-2 rounded">
                      <div className="bg-green-500 h-2 rounded" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">56</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">美妆护肤</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 h-2 rounded">
                      <div className="bg-pink-500 h-2 rounded" style={{width: '30%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">38</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">影视娱乐</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 h-2 rounded">
                      <div className="bg-purple-500 h-2 rounded" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">31</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'privileges' && (
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Lv.3 评论员特权</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <CheckCircleOutlined className="text-green-500" />
                <div>
                  <div className="font-medium text-green-700">优先接单权</div>
                  <div className="text-xs text-green-600">可优先抢到高价值任务</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <CheckCircleOutlined className="text-green-500" />
                <div>
                  <div className="font-medium text-green-700">任务奖励加成</div>
                  <div className="text-xs text-green-600">所有任务奖励增加10%</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <CheckCircleOutlined className="text-green-500" />
                <div>
                  <div className="font-medium text-green-700">专属客服</div>
                  <div className="text-xs text-green-600">享受VIP客服通道</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <LockOutlined className="text-gray-400" />
                <div>
                  <div className="font-medium text-gray-600">免费提现</div>
                  <div className="text-xs text-gray-500">升级到Lv.4解锁</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <LockOutlined className="text-gray-400" />
                <div>
                  <div className="font-medium text-gray-600">月度奖金</div>
                  <div className="text-xs text-gray-500">升级到Lv.4解锁</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 帮助与客服 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <button className="w-full flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
                <QuestionCircleOutlined className="text-xl" />
                <span className="font-medium">帮助中心</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
                <MessageOutlined className="text-xl" />
                <span className="font-medium">联系客服</span>
              </div>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">在线</span>
          </button>

          <button className="w-full flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
                <PhoneOutlined className="text-xl" />
                <span className="font-medium">意见反馈</span>
              </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* 退出登录 */}
      <div className="mx-4 mt-6">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium">
          退出登录
        </button>
      </div>
    </div>
  );
}