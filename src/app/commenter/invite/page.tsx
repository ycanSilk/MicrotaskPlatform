'use client';

import React, { useState } from 'react';

export default function CommenterInvitePage() {
  const [activeTab, setActiveTab] = useState('invite');
  const [copied, setCopied] = useState(false);
  
  // 模拟用户数据
  const myInviteCode = 'CM001';
  const inviteLink = `https://douyin-task.com/register?invite=${myInviteCode}`;
  
  // 复制邀请码/链接功能
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      alert(`${type}已复制到剪贴板`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };
  
  // 模拟团队成员数据
  const teamMembers = [
    {
      id: 1,
      nickname: '小王',
      avatar: '👨',
      joinDate: '2024-01-10',
      status: '活跃',
      statusColor: 'text-green-600',
      completedTasks: 23,
      totalEarnings: 127.50,
      myCommission: 6.38,
      level: 'Lv.2 评论员'
    },
    {
      id: 2,
      nickname: '小李',
      avatar: '👩',
      joinDate: '2024-01-12',
      status: '活跃',
      statusColor: 'text-green-600',
      completedTasks: 15,
      totalEarnings: 89.20,
      myCommission: 4.46,
      level: 'Lv.1 评论员'
    },
    {
      id: 3,
      nickname: '小张',
      avatar: '🧑',
      joinDate: '2024-01-14',
      status: '新手',
      statusColor: 'text-orange-600',
      completedTasks: 3,
      totalEarnings: 15.60,
      myCommission: 0.78,
      level: '新手评论员'
    },
    {
      id: 4,
      nickname: '小刘',
      avatar: '👩‍💼',
      joinDate: '2024-01-08',
      status: '活跃',
      statusColor: 'text-green-600',
      completedTasks: 45,
      totalEarnings: 234.80,
      myCommission: 11.74,
      level: 'Lv.3 评论员'
    },
    {
      id: 5,
      nickname: '小陈',
      avatar: '👨‍💻',
      joinDate: '2024-01-15',
      status: '休眠',
      statusColor: 'text-gray-500',
      completedTasks: 1,
      totalEarnings: 3.50,
      myCommission: 0.18,
      level: '新手评论员'
    }
  ];
  
  // 模拟佣金明细数据
  const commissionHistory = [
    {
      id: 1,
      memberName: '小王',
      taskName: '美食探店推广',
      taskEarning: 3.50,
      commission: 0.18,
      date: '2024-01-15 14:30',
      type: 'task'
    },
    {
      id: 2,
      memberName: '小李',
      taskName: '护肤产品体验',
      taskEarning: 5.20,
      commission: 0.26,
      date: '2024-01-15 10:20',
      type: 'task'
    },
    {
      id: 3,
      memberName: '小刘',
      taskName: '科技产品评测',
      taskEarning: 6.80,
      commission: 0.34,
      date: '2024-01-15 09:15',
      type: 'task'
    },
    {
      id: 4,
      memberName: '小张',
      taskName: '旅游体验分享',
      taskEarning: 4.20,
      commission: 0.21,
      date: '2024-01-14 16:45',
      type: 'task'
    },
    {
      id: 5,
      memberName: '小王',
      taskName: '注册完成奖励',
      taskEarning: 0,
      commission: 5.00,
      date: '2024-01-10 09:15',
      type: 'register'
    },
    {
      id: 6,
      memberName: '小李',
      taskName: '注册完成奖励',
      taskEarning: 0,
      commission: 5.00,
      date: '2024-01-12 11:30',
      type: 'register'
    }
  ];
  
  // 计算统计数据
  const totalInvited = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === '活跃').length;
  const totalCommission = commissionHistory.reduce((sum, item) => sum + item.commission, 0);
  const todayCommission = commissionHistory
    .filter(item => item.date.startsWith('2024-01-15'))
    .reduce((sum, item) => sum + item.commission, 0);
  const monthCommission = commissionHistory
    .filter(item => item.date.startsWith('2024-01'))
    .reduce((sum, item) => sum + item.commission, 0);

  return (
    <div className="pb-20">

      {/* 邀请奖励说明 */}
      <div className="mx-4 mt-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-xl font-bold mb-2">邀请好友，赚取佣金</div>
            <div className="text-sm text-orange-100">
              邀请好友完成任务，永久获得其收益的5%佣金
            </div>
          </div>
        </div>
      </div>

      {/* 切换标签 */}
      <div className="mx-4 mt-6 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setActiveTab('invite')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'invite' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          邀请好友
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'team' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          我的团队
        </button>
        <button 
          onClick={() => setActiveTab('commission')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'commission' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          佣金收益
        </button>
      </div>

      {activeTab === 'invite' && (
        <>
          {/* 邀请统计 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">我的邀请数据</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{totalInvited}</div>
                  <div className="text-xs text-blue-700">累计邀请</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
                  <div className="text-xs text-green-700">活跃用户</div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">¥{totalCommission.toFixed(2)}</div>
                  <div className="text-xs text-orange-700">累计佣金</div>
                </div>
              </div>
            </div>
          </div>

          {/* 我的邀请码 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">我的专属邀请码</h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{myInviteCode}</div>
                  <div className="text-sm text-blue-700">好友输入此邀请码注册可获得专属奖励</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(myInviteCode, '邀请码')}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  {copied ? '已复制 ✓' : '复制邀请码'}
                </button>
              </div>
            </div>
          </div>

          {/* 邀请链接 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">邀请链接</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-600 break-all">{inviteLink}</div>
              </div>
              <button 
                onClick={() => copyToClipboard(inviteLink, '邀请链接')}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                复制邀请链接
              </button>
            </div>
          </div>

          {/* 快速分享 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">快速分享</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-green-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
                  <span>💬</span>
                  <span>微信好友</span>
                </button>
                
                <button className="bg-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors">
                  <span>👥</span>
                  <span>微信群</span>
                </button>
                
                <button className="bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
                  <span>📱</span>
                  <span>QQ好友</span>
                </button>
                
                <button className="bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors">
                  <span>📄</span>
                  <span>朋友圈</span>
                </button>
              </div>
            </div>
          </div>



          {/* 邀请成功率提示 */}
          <div className="mx-4 mt-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-500 text-xl">💪</span>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">提高邀请成功率</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• 向朋友详细介绍平台优势和赚钱机会</p>
                    <p>• 分享自己的成功经验和收益截图</p>
                    <p>• 主动帮助新手完成第一个任务</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 邀请奖励规则 */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">奖励规则</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>好友通过您的邀请注册并完成首个任务，您获得<strong className="text-green-600">¥5奖励</strong></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>好友每完成一个任务，您获得其收益的<strong className="text-orange-600">5%</strong>作为佣金</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>佣金每日结算，自动转入您的余额，无需手动操作</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>邀请的好友越活跃，您的收益越多，长期可持续收益</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">ℹ️</span>
                  <span>邀请奖励无上限，邀请越多收益越多</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'team' && (
        <div className="mx-4 mt-6">
          {/* 团队概览 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">团队概览</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">{totalInvited}</div>
                <div className="text-xs text-gray-500">团队总人数</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{activeMembers}</div>
                <div className="text-xs text-gray-500">活跃成员</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">{teamMembers.reduce((sum, m) => sum + m.completedTasks, 0)}</div>
                <div className="text-xs text-gray-500">总完成任务</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">¥{teamMembers.reduce((sum, m) => sum + m.totalEarnings, 0).toFixed(2)}</div>
                <div className="text-xs text-gray-500">团队总收益</div>
              </div>
            </div>
          </div>
          
          {/* 团队成员列表 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">我的团队成员 ({totalInvited}人)</h3>
            </div>
            <div className="divide-y">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4">
                  {/* 成员基本信息 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{member.nickname}</div>
                        <div className="text-xs text-gray-500">{member.joinDate} 加入 · {member.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${member.statusColor}`}>{member.status}</div>
                      <div className="text-xs text-gray-500">已完成{member.completedTasks}个任务</div>
                    </div>
                  </div>
                  
                  {/* 成员数据统计 */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-bold text-gray-800">¥{member.totalEarnings.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">总收益</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-green-600">¥{member.myCommission.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">我的佣金</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600">{member.completedTasks}</div>
                        <div className="text-xs text-gray-500">完成任务</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 佣金贡献比例 */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">佣金贡献</span>
                      <span className="text-xs text-blue-600">{((member.myCommission / totalCommission) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-gray-200 h-1 rounded">
                      <div 
                        className="bg-blue-500 h-1 rounded" 
                        style={{width: `${(member.myCommission / totalCommission) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commission' && (
        <div className="mx-4 mt-6">
          {/* 佣金统计 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">佣金统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">¥{totalCommission.toFixed(2)}</div>
                <div className="text-xs text-gray-500">累计佣金</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">¥{monthCommission.toFixed(2)}</div>
                <div className="text-xs text-gray-500">本月佣金</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">¥{commissionHistory.filter(item => item.date.startsWith('2024-01-14')).reduce((sum, item) => sum + item.commission, 0).toFixed(2)}</div>
                <div className="text-xs text-gray-500">昨日佣金</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">¥{todayCommission.toFixed(2)}</div>
                <div className="text-xs text-gray-500">今日佣金</div>
              </div>
            </div>
          </div>
          
          {/* 佣金来源分析 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">佣金来源分析</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">任务佣金</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">¥{commissionHistory.filter(item => item.type === 'task').reduce((sum, item) => sum + item.commission, 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{((commissionHistory.filter(item => item.type === 'task').reduce((sum, item) => sum + item.commission, 0) / totalCommission) * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">注册奖励</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">¥{commissionHistory.filter(item => item.type === 'register').reduce((sum, item) => sum + item.commission, 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{((commissionHistory.filter(item => item.type === 'register').reduce((sum, item) => sum + item.commission, 0) / totalCommission) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 佣金明细 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">佣金明细</h3>
                <span className="text-xs text-gray-500">最近{commissionHistory.length}条记录</span>
              </div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {commissionHistory.map((record) => (
                <div key={record.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">{record.memberName}</span>
                        {record.type === 'register' ? (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">注册奖励</span>
                        ) : (
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">任务佣金</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{record.taskName}</div>
                      <div className="text-xs text-gray-500">{record.date}</div>
                      {record.type === 'task' && (
                        <div className="text-xs text-gray-400 mt-1">
                          任务收益: ¥{record.taskEarning.toFixed(2)} × 5% = ¥{record.commission.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className={`font-bold ${
                        record.type === 'register' ? 'text-green-600' : 'text-blue-600'
                      }`}>+¥{record.commission.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {record.type === 'register' ? '奖励' : '5%佣金'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 查看更多 */}
            <div className="p-4 border-t bg-gray-50">
              <button className="w-full text-blue-500 text-sm hover:text-blue-600">
                查看全部佣金记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}