"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// 邀请页面组件
const InvitePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invite' | 'invited' | 'commission'>('invite');
  const [copied, setCopied] = useState<boolean>(false);

  // 模拟用户信息
  const userInfo = {
    id: 'user-123',
    name: '张三',
    avatar: '👨‍💼',
  };

  // 生成模拟邀请记录数据
  const generateMockInviteRecords = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `invite-${i + 1}`,
      inviteeName: `用户${i + 1}`,
      inviteeAvatar: ['👨‍💼', '👩‍💼', '🧑‍💼', '👨‍💻', '👩‍💻'][i % 5],
      inviteDate: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      joinDate: i < 3 ? new Date(Date.now() - i * 86400000 - 43200000).toISOString() : null,
      status: i < 2 ? 'active' : i < 3 ? 'joined' : 'pending',
      completedTasks: i < 2 ? Math.floor(Math.random() * 10) + 1 : 0,
      totalEarnings: i < 2 ? Math.random() * 500 + 100 : 0,
      myCommission: i < 2 ? Math.random() * 100 + 20 : 0,
    }));
  };

  // 生成模拟佣金记录数据
  const generateMockCommissionRecords = () => {
    const records = [];
    const types = ['task', 'register', 'team'];
    const names = ['任务一', '任务二', '任务三', '任务四', '任务五'];
    const members = ['用户1', '用户2', '用户3', '用户4', '用户5'];
    
    for (let i = 0; i < 12; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const taskName = type === 'task' ? names[Math.floor(Math.random() * names.length)] : '';
      const commissionRate = type === 'task' ? 0.1 : type === 'register' ? 1 : 0.05;
      const commission = type === 'task' ? Math.random() * 50 + 10 : type === 'register' ? 20 : Math.random() * 100 + 10;
      const taskEarning = type === 'task' ? commission / commissionRate : 0;
      
      records.push({
        id: `comm-${i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
        type,
        memberName: members[Math.floor(Math.random() * members.length)],
        taskName,
        commission,
        commissionRate,
        taskEarning,
        description: type === 'team' ? '来自团队成员的业绩分成' : '',
      });
    }
    
    return records;
  };

  // 直接使用模拟数据
  const mockInviteRecords = generateMockInviteRecords();
  const mockCommissionRecords = generateMockCommissionRecords();

  // 计算邀请统计数据
  const inviteStats = {
    totalInvited: mockInviteRecords.length,
    activeUsers: mockInviteRecords.filter(record => record.status === 'active').length,
    totalCommission: mockInviteRecords.reduce((sum, record) => sum + record.myCommission, 0),
  };

  // 计算佣金统计数据
  const totalCommission = mockCommissionRecords.reduce((sum, record) => sum + record.commission, 0);
  const monthCommission = mockCommissionRecords
    .filter(record => new Date(record.date).getMonth() === new Date().getMonth())
    .reduce((sum, record) => sum + record.commission, 0);
  const yesterdayCommission = mockCommissionRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return recordDate.toDateString() === yesterday.toDateString();
    })
    .reduce((sum, record) => sum + record.commission, 0);
  const todayCommission = mockCommissionRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      const today = new Date();
      return recordDate.toDateString() === today.toDateString();
    })
    .reduce((sum, record) => sum + record.commission, 0);

  const taskCommission = mockCommissionRecords
    .filter(record => record.type === 'task')
    .reduce((sum, record) => sum + record.commission, 0);
  const registerCommission = mockCommissionRecords
    .filter(record => record.type === 'register')
    .reduce((sum, record) => sum + record.commission, 0);
  const teamCommission = mockCommissionRecords
    .filter(record => record.type === 'team')
    .reduce((sum, record) => sum + record.commission, 0);

  const commissionStats = {
    total: totalCommission,
    month: monthCommission,
    yesterday: yesterdayCommission,
    today: todayCommission,
    breakdown: { task: taskCommission, register: registerCommission, team: teamCommission },
  };

  // 复制邀请链接
  const copyInviteLink = async () => {
    try {
      const inviteLink = `https://example.com/invite?ref=${userInfo?.id || 'default'}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('复制失败，请手动复制');
    }
  };

  // 分享到社交媒体
  const shareToSocialMedia = (platform: string) => {
    const inviteLink = `https://example.com/invite?ref=${userInfo?.id || 'default'}`;
    const shareText = `我正在使用微任务平台，邀请你一起加入！完成任务赚取佣金，还有邀请奖励哦！${inviteLink}`;
    
    switch (platform) {
      case 'wechat':
        alert('已复制邀请链接，请在微信中粘贴分享');
        navigator.clipboard.writeText(shareText);
        break;
      case 'weibo':
        // 实际项目中应该使用微博分享API
        alert('跳转至微博分享页面');
        break;
      case 'qq':
        // 实际项目中应该使用QQ分享API
        alert('跳转至QQ分享页面');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 标签页切换 - 修改为按钮样式 */}
      <div className="bg-white px-4 py-3 mb-4">
        <div className="flex gap-3">
          <button
            className={`flex-1 py-2 px-4 rounded-sm border border-gray-300 ${activeTab === 'invite' ? 'bg-blue-500 text-white font-medium' : 'bg-white text-gray-600'}`}
            onClick={() => setActiveTab('invite')}
          >
            邀请好友
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-sm border border-gray-300 ${activeTab === 'invited' ? 'bg-blue-500 text-white font-medium' : 'bg-white text-gray-600'}`}
            onClick={() => setActiveTab('invited')}
          >
            已邀请好友
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-sm border border-gray-300 ${activeTab === 'commission' ? 'bg-blue-500 text-white font-medium' : 'bg-white text-gray-600'}`}
            onClick={() => setActiveTab('commission')}
          >
            佣金收益
          </button>
        </div>
      </div>

      {/* 邀请好友标签页 */}
      {activeTab === 'invite' && (
        <div className="mx-4 space-y-6">
          {/* 我的邀请数据 - 调整布局 */}
          <div className="rounded-lg shadow-sm p-4 bg-white">
            <h3 className="font-bold text-gray-800 mb-4">我的邀请数据</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xl font-bold text-blue-600">{inviteStats.totalInvited}</div>
                <div className="text-xs text-gray-500">累计邀请</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xl font-bold text-green-600">{inviteStats.activeUsers}</div>
                <div className="text-xs text-gray-500">活跃用户</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xl font-bold text-orange-600">¥{inviteStats.totalCommission.toFixed(2)}</div>
                <div className="text-xs text-gray-500">累计佣金</div>
              </div>
            </div>
          </div>

          {/* 我的专属邀请码 - 调整布局 */}
          <div className="rounded-lg w-full shadow-sm p-4 bg-white">
            <h3 className="font-bold text-gray-800 mb-3">我的专属邀请码</h3>
            <div className="w-full items-center mb-4">
              <div className="bg-blue-100 text-center py-3 px-4 rounded-lg mb-4">
                <span className="text-2xl font-bold text-blue-600">{userInfo?.id.slice(-8).toUpperCase() || 'XXXXXXXXX'}</span>
              </div>
            </div>
            <div className="w-full items-center mb-4">
              <button 
                onClick={copyInviteLink}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full"
              >
                {copied ? '已复制' : '复制邀请码'}
              </button>
            </div>
            
            {/* 邀请链接 */}
            <div className="mt-4">
              <h3 className="font-bold text-gray-800 mb-3">邀请链接</h3>
              <div className=" items-center justify-between">
                <div className="text-sm bg-blue-100 px-4 py-4 text-center rounded-lg flex-1 truncate text-blue-600">
                  https://example.com/invite?ref={userInfo?.id || 'default'}
                </div>
                <div className='my-2  items-center'>
                   <button 
                      onClick={copyInviteLink}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full"
                      >
                      {copied ? '✓' : '复制邀请链接'}
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* 快速分享 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">快速分享</h3>
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => shareToSocialMedia('wechat')}
                className="flex flex-col items-center p-3 bg-blue-500 rounded hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl mb-1">💬</div>
                <div className="text-xs text-white">微信</div>
              </button>
              <button 
                onClick={() => shareToSocialMedia('weibo')}
                className="flex flex-col items-center p-3 bg-blue-500 rounded hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs text-white">微博</div>
              </button>
              <button 
                onClick={() => shareToSocialMedia('qq')}
                className="flex flex-col items-center p-3 bg-blue-500 rounded hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl mb-1">💻</div>
                <div className="text-xs text-white">QQ</div>
              </button>
              <button 
                onClick={() => shareToSocialMedia('other')}
                className="flex flex-col items-center p-3 bg-blue-500 rounded hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl mb-1">📤</div>
                <div className="text-xs text-white">更多</div>
              </button>
            </div>
          </div>

          {/* 提高邀请成功率 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">提高邀请成功率</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-lg mt-1">💡</div>
                <div>
                  <div className="font-medium text-gray-800">个性化邀请</div>
                  <div className="text-sm text-gray-600">告诉好友你在平台的真实体验和收获</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-lg mt-1">🎯</div>
                <div>
                  <div className="font-medium text-gray-800">精准推荐</div>
                  <div className="text-sm text-gray-600">根据好友兴趣推荐适合的任务类型</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-lg mt-1">👥</div>
                <div>
                  <div className="font-medium text-gray-800">提供帮助</div>
                  <div className="text-sm text-gray-600">指导好友完成首次任务，提高留存率</div>
                </div>
              </div>
            </div>
          </div>

          {/* 邀请奖励规则 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">邀请奖励规则</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>1. 邀请新用户注册并完成首次任务，奖励20元现金</div>
              <div>2. 被邀请用户每完成一个任务，邀请者获得该任务收益10%的佣金</div>
              <div>3. 邀请者可获得被邀请用户长期的任务佣金，无时间限制</div>
              <div>4. 邀请人数达到一定规模，可额外获得团队奖励</div>
              <div>5. 所有奖励实时到账，可随时提现</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              * 活动最终解释权归平台所有
            </div>
          </div>
        </div>
      )}

      {/* 已邀请好友标签页 */}
      {activeTab === 'invited' && (
        <div className="mx-4 space-y-6">
      

          {/* 邀请记录列表 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="text-center">
                <h3 className="font-bold text-gray-800">已邀请好友 ({mockInviteRecords.filter(record => record.status !== 'pending').length}人)</h3>
              </div>
            </div>
            <div className="divide-y">
              {mockInviteRecords.filter(record => record.status !== 'pending').length > 0 ? (
                mockInviteRecords.filter(record => record.status !== 'pending').map((invite) => (
                  <div key={invite.id} className="p-4">
                    {/* 被邀请人基本信息 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                          {invite.inviteeAvatar || '👤'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{invite.inviteeName || '未知用户'}</div>
                          <div className="text-xs text-gray-500">
                            邀请时间: {new Date(invite.inviteDate).toLocaleDateString()}
                            {invite.joinDate && ` · 注册时间: ${new Date(invite.joinDate).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${invite.status === 'active' ? 'text-green-600' : invite.status === 'joined' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {invite.status === 'active' ? '活跃中' : invite.status === 'joined' ? '已注册' : '待注册'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invite.status !== 'pending' && `已完成${invite.completedTasks || 0}个任务`}
                        </div>
                      </div>
                    </div>
                    
                    {/* 被邀请人数据统计 - 调整样式 */}
                    {invite.status !== 'pending' && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                          <div className="text-sm font-bold text-gray-800">¥{(invite.totalEarnings || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">总收益</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                          <div className="text-sm font-bold text-green-600">¥{(invite.myCommission || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">我的佣金</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                          <div className="text-sm font-bold text-blue-600">{invite.completedTasks || 0}</div>
                          <div className="text-xs text-gray-500">完成任务</div>
                        </div>
                      </div>
                    )}
                    
                    {/* 查看详情按钮 */}
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => router.push(`/commenter/invite/details/${invite.id}` as any)}
                        className="text-blue-500 text-sm hover:text-blue-600"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-5xl mb-4">👥</div>
                  <div className="text-gray-500">您还没有邀请任何好友</div>
                  <div className="text-gray-400 text-sm mt-2">快去邀请好友加入吧，一起赚取佣金！</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 佣金收益标签页 */}
      {activeTab === 'commission' && (
        <div className="mx-4 mt-6">
          {/* 佣金统计 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">佣金统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">¥{commissionStats.total.toFixed(2)}</div>
                <div className="text-xs text-gray-500">累计佣金</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">¥{commissionStats.month.toFixed(2)}</div>
                <div className="text-xs text-gray-500">本月佣金</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">¥{commissionStats.yesterday.toFixed(2)}</div>
                <div className="text-xs text-gray-500">昨日佣金</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">¥{commissionStats.today.toFixed(2)}</div>
                <div className="text-xs text-gray-500">今日佣金</div>
              </div>
            </div>
          </div>
          
          {/* 佣金来源分析 */}
          {commissionStats.total > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <h3 className="font-bold text-gray-800 mb-4">佣金来源分析</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">任务佣金</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">¥{commissionStats.breakdown.task.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{((commissionStats.breakdown.task / commissionStats.total) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">注册奖励</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">¥{commissionStats.breakdown.register.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{((commissionStats.breakdown.register / commissionStats.total) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                {commissionStats.breakdown.team > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span className="text-sm text-gray-600">团队奖励</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">¥{commissionStats.breakdown.team.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{((commissionStats.breakdown.team / commissionStats.total) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
                
                {/* 佣金来源环形图 - 优化版 */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* 计算并绘制各个部分 - 单层圆环 */}
                      {(() => {
                        const centerX = 50;
                        const centerY = 50;
                        const radius = 40;
                        let startAngle = -90; // 从顶部开始
                        
                        // 任务佣金部分
                        const taskPercentage = commissionStats.breakdown.task / commissionStats.total;
                        const taskEndAngle = startAngle + (taskPercentage * 360);
                        const taskStartX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
                        const taskStartY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
                        const taskEndX = centerX + radius * Math.cos(taskEndAngle * Math.PI / 180);
                        const taskEndY = centerY + radius * Math.sin(taskEndAngle * Math.PI / 180);
                        const taskLargeArcFlag = taskPercentage > 0.5 ? 1 : 0;
                        
                        // 注册奖励部分
                        startAngle = taskEndAngle;
                        const registerPercentage = commissionStats.breakdown.register / commissionStats.total;
                        const registerEndAngle = startAngle + (registerPercentage * 360);
                        const registerStartX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
                        const registerStartY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
                        const registerEndX = centerX + radius * Math.cos(registerEndAngle * Math.PI / 180);
                        const registerEndY = centerY + radius * Math.sin(registerEndAngle * Math.PI / 180);
                        const registerLargeArcFlag = registerPercentage > 0.5 ? 1 : 0;
                        
                        // 团队奖励部分
                        startAngle = registerEndAngle;
                        const teamPercentage = commissionStats.breakdown.team / commissionStats.total;
                        const teamEndAngle = startAngle + (teamPercentage * 360);
                        const teamStartX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
                        const teamStartY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
                        const teamEndX = centerX + radius * Math.cos(teamEndAngle * Math.PI / 180);
                        const teamEndY = centerY + radius * Math.sin(teamEndAngle * Math.PI / 180);
                        const teamLargeArcFlag = teamPercentage > 0.5 ? 1 : 0;
                        
                        // 计算标签位置
                        const calculateLabelPosition = (startAngle: number, endAngle: number) => {
                          const middleAngle = (startAngle + endAngle) / 2;
                          const labelRadius = radius * 0.7; // 标签位于圆环中间位置
                          const labelX = centerX + labelRadius * Math.cos(middleAngle * Math.PI / 180);
                          const labelY = centerY + labelRadius * Math.sin(middleAngle * Math.PI / 180);
                          return { x: labelX, y: labelY };
                        };
                        
                        const taskLabelPos = calculateLabelPosition(-90, taskEndAngle);
                        const registerLabelPos = calculateLabelPosition(taskEndAngle, registerEndAngle);
                        const teamLabelPos = calculateLabelPosition(registerEndAngle, teamEndAngle);
                        
                        return (
                          <>
                            {/* 任务佣金 */}
                            <path
                              d={`M ${centerX} ${centerY} L ${taskStartX} ${taskStartY} A ${radius} ${radius} 0 ${taskLargeArcFlag} 1 ${taskEndX} ${taskEndY} Z`}
                              fill="#3b82f6"
                            />
                            
                            {/* 注册奖励 */}
                            <path
                              d={`M ${centerX} ${centerY} L ${registerStartX} ${registerStartY} A ${radius} ${radius} 0 ${registerLargeArcFlag} 1 ${registerEndX} ${registerEndY} Z`}
                              fill="#22c55e"
                            />
                            
                            {/* 团队奖励 */}
                            <path
                              d={`M ${centerX} ${centerY} L ${teamStartX} ${teamStartY} A ${radius} ${radius} 0 ${teamLargeArcFlag} 1 ${teamEndX} ${teamEndY} Z`}
                              fill="#a855f7"
                            />
                            
                            {/* 任务佣金占比标签 */}
                            <text
                              x={taskLabelPos.x}
                              y={taskLabelPos.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-white text-[12px]"
                              fill="white"
                            >
                              {taskPercentage > 0.05 ? `${(taskPercentage * 100).toFixed(1)}%` : ''}
                            </text>
                            
                            {/* 注册奖励占比标签 */}
                            <text
                              x={registerLabelPos.x}
                              y={registerLabelPos.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-green-600 text-[10px]"
                              fill="white"
                            >
                              {registerPercentage > 0.05 ? `${(registerPercentage * 100).toFixed(1)}%` : ''}
                            </text>
                            
                            {/* 团队奖励占比标签 */}
                            <text
                              x={teamLabelPos.x}
                              y={teamLabelPos.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-white text-[12px]"
                              fill="white"
                            >
                              {teamPercentage > 0.05 ? `${(teamPercentage * 100).toFixed(1)}%` : ''}
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* 总计金额移至环形图下方 */}
                  <div className="mt-4 text-center">
                    <div className="text-lg font-bold text-gray-800">¥{commissionStats.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">总计佣金</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 佣金明细 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">佣金明细</h3>
                <span className="text-xs text-gray-500">最近{Math.min(mockCommissionRecords.length, 10)}条记录</span>
              </div>
            </div>
            <div className="divide-y overflow-y-auto">
              {/* 限制只显示前10条记录 */}
              {mockCommissionRecords.length > 0 ? (
                mockCommissionRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">{record.memberName}</span>
                          {record.type === 'register' ? (
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">注册奖励</span>
                          ) : record.type === 'team' ? (
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">团队奖励</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">任务佣金</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{record.taskName}</div>
                        <div className="text-xs text-gray-500">{new Date(record.date).toLocaleString()}</div>
                        {record.type === 'task' && (
                          <div className="text-xs text-gray-400 mt-1">
                            任务收益: ¥{(record.taskEarning || 0).toFixed(2)} × {(record.commissionRate * 100).toFixed(0)}% = ¥{record.commission.toFixed(2)}
                          </div>
                        )}
                        {record.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {record.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className={`font-bold ${record.type === 'register' ? 'text-green-600' : record.type === 'team' ? 'text-purple-600' : 'text-blue-600'}`}>+¥{record.commission.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          {record.type === 'register' ? '注册奖励' : record.type === 'team' ? '团队奖励' : `${(record.commissionRate * 100).toFixed(0)}%佣金`}
                        </div>
                      </div>
                    </div>
                    
                    {/* 查看佣金详情按钮 */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => router.push(`/commenter/invite/commission-details/${record.id}` as any)}
                        className="text-blue-500 text-sm hover:text-blue-600"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-5xl mb-4">💰</div>
                  <div className="text-gray-500">暂无佣金记录</div>
                  <div className="text-gray-400 text-sm mt-2">邀请好友完成任务，即可获得佣金奖励！</div>
                </div>
              )}
            </div>
          </div>
          
          {/* 查看更多 */}
          {mockCommissionRecords.length > 10 && (
            <div className="p-4 border-t bg-gray-50">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                查看全部佣金记录
              </button>
            </div>
          )}
        </div>
      )}

      {/* 底部间距，确保内容不被遮挡 */}
      <div className="pb-20"></div>
    </div>
  );
};

export default InvitePage;