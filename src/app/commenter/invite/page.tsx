'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InviteRecord, CommissionRecord, InviteStats, CommissionStats } from '@/types/invite';

export default function CommenterInvitePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('invite');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // 动态数据状态
  const [myInviteCode, setMyInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [inviteRecords, setInviteRecords] = useState<InviteRecord[]>([]);
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  
  // 统计数据状态
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    totalInvited: 0,
    activeMembers: 0,
    pendingInvites: 0,
    totalCommission: 0
  });
  
  const [commissionStats, setCommissionStats] = useState<CommissionStats>({
    total: 0,
    today: 0,
    yesterday: 0,
    month: 0,
    breakdown: {
      task: 0,
      register: 0,
      team: 0
    }
  });

  // 生成静态邀请记录数据
  const generateMockInviteRecords = (): InviteRecord[] => {
    return [
      {
        id: '1',
        inviteeId: 'user123',
        inviteeName: '张三',
        inviteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        inviteDate: '2023-05-15T09:30:00',
        joinDate: '2023-05-15T10:15:00',
        status: 'active',
        rewardAmount: 5.00,
        completedTasks: 25,
        totalEarnings: 1250,
        myCommission: 125,
        level: '一级'
      },
      {
        id: '2',
        inviteeId: 'user456',
        inviteeName: '李四',
        inviteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        inviteDate: '2023-06-20T14:20:00',
        joinDate: '2023-06-20T15:00:00',
        status: 'joined',
        rewardAmount: 5.00,
        completedTasks: 3,
        totalEarnings: 150,
        myCommission: 15,
        level: '一级'
      },
      {
        id: '3',
        inviteeId: 'user789',
        inviteeName: '王五',
        inviteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        inviteDate: '2023-04-10T11:45:00',
        joinDate: '2023-04-10T12:30:00',
        status: 'active',
        rewardAmount: 5.00,
        completedTasks: 45,
        totalEarnings: 2250,
        myCommission: 225,
        level: '一级'
      },
      {
        id: '4',
        inviteeId: 'user101',
        inviteeName: '赵六',
        inviteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
        inviteDate: '2023-07-01T16:10:00',
        joinDate: undefined,
        status: 'pending',
        rewardAmount: 0,
        completedTasks: 0,
        totalEarnings: 0,
        myCommission: 0,
        level: '一级'
      }
    ];
  };
  
  // 生成静态佣金记录数据
  const generateMockCommissionRecords = (): CommissionRecord[] => {
    return [
      {
        id: '1',
        memberId: 'user123',
        memberName: '张三',
        memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        taskId: 'task001',
        taskName: '产品评论任务',
        commission: 25.50,
        commissionRate: 0.1,
        taskEarning: 255.00,
        type: 'task',
        date: '2023-07-10T14:30:00',
        status: 'completed',
        description: '用户完成产品评论任务获得的佣金'
      },
      {
        id: '2',
        memberId: 'user456',
        memberName: '李四',
        memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        taskId: undefined,
        taskName: '新用户注册',
        commission: 5.00,
        commissionRate: 1.0,
        taskEarning: 0,
        type: 'register',
        date: '2023-07-08T09:15:00',
        status: 'completed',
        description: '新用户注册奖励佣金'
      },
      {
        id: '3',
        memberId: 'user789',
        memberName: '王五',
        memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        taskId: 'task002',
        taskName: '应用测试任务',
        commission: 42.75,
        commissionRate: 0.1,
        taskEarning: 427.50,
        type: 'task',
        date: '2023-07-05T16:45:00',
        status: 'completed',
        description: '用户完成应用测试任务获得的佣金'
      },
      {
        id: '4',
        memberId: 'user123',
        memberName: '张三',
        memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        taskId: 'task003',
        taskName: '市场调研任务',
        commission: 18.25,
        commissionRate: 0.1,
        taskEarning: 182.50,
        type: 'task',
        date: '2023-07-01T11:20:00',
        status: 'completed',
        description: '用户完成市场调研任务获得的佣金'
      },
      {
        id: '5',
        memberId: 'user789',
        memberName: '王五',
        memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
        taskId: 'task004',
        taskName: '内容审核任务',
        commission: 32.00,
        commissionRate: 0.1,
        taskEarning: 320.00,
        type: 'task',
        date: '2023-06-28T14:50:00',
        status: 'completed',
        description: '用户完成内容审核任务获得的佣金'
      }
    ];
  };
  
  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 使用演示用户ID，确保页面能正常加载静态数据
        const currentUserId = 'demo_user';
        setUserId(currentUserId);

        // 设置静态邀请记录和佣金记录
        const invites = generateMockInviteRecords();
        const commissions = generateMockCommissionRecords();
        setInviteRecords(invites);
        setCommissionRecords(commissions);
        
        // 设置邀请码和链接
        setMyInviteCode('INV8765');
        setInviteLink(`https://douyin-task.com/register?invite=INV8765`);
        
        // 计算统计数据
        const activeCount = invites.filter(invite => invite.status === 'active').length;
        const pendingCount = invites.filter(invite => invite.status === 'pending').length;
        const totalComAmount = commissions.reduce((sum, comm) => sum + comm.commission, 0);
        
        // 更新统计数据状态
        setInviteStats({
          totalInvited: invites.length,
          activeMembers: activeCount,
          pendingInvites: pendingCount,
          totalCommission: totalComAmount
        });
        
        setCommissionStats({
          total: totalComAmount,
          today: 0,
          yesterday: 0,
          month: totalComAmount,
          breakdown: {
            task: commissions.filter(comm => comm.type === 'task').reduce((sum, comm) => sum + comm.commission, 0),
            register: commissions.filter(comm => comm.type === 'register').reduce((sum, comm) => sum + comm.commission, 0),
            team: 0
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
        console.error('页面初始化错误:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-blue-500 text-xl">加载中...</div>
      </div>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          重新加载
        </button>
        {error === '请先登录' && (
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            去登录
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* 返回按钮 */}
      <button
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push('/commenter' as any);
          }
        }}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
      >
        ← 返回
      </button>
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
          onClick={() => setActiveTab('invited')}
          className={`py-3 px-4 rounded font-medium transition-colors ${activeTab === 'invited' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-blue-50'}`}
        >
          已邀请好友
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
          {/* 邀请统计 - 数据来自bound_user_invitations.json */}
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">我的邀请数据</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{inviteStats.totalInvited}</div>
                  <div className="text-xs text-blue-700">累计邀请</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{inviteStats.activeMembers}</div>
                  <div className="text-xs text-green-700">活跃用户</div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">¥{inviteStats.totalCommission.toFixed(2)}</div>
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

          {/* 邀请统计 - 使用来自bound_user_invitations.json的实时数据 */}
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

      {activeTab === 'invited' && (
        <div className="mx-4 mt-6">
          {/* 邀请概览 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">邀请概览</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">{inviteStats.totalInvited}</div>
                <div className="text-xs text-gray-500">累计邀请</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{inviteStats.activeMembers}</div>
                <div className="text-xs text-gray-500">活跃用户</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">{inviteRecords.filter(invite => invite.status === 'pending').length}</div>
                <div className="text-xs text-gray-500">待注册用户</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">¥{inviteStats.totalCommission.toFixed(2)}</div>
                <div className="text-xs text-gray-500">累计佣金</div>
              </div>
            </div>
          </div>
          
          {/* 邀请记录列表 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">已邀请好友 ({inviteStats.totalInvited}人)</h3>
            </div>
            <div className="divide-y">
              {inviteRecords.length > 0 ? (
                inviteRecords.map((invite) => (
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
                    
                    {/* 被邀请人数据统计 */}
                    {invite.status !== 'pending' && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm font-bold text-gray-800">¥{(invite.totalEarnings || 0).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">总收益</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-green-600">¥{(invite.myCommission || 0).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">我的佣金</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-blue-600">{invite.completedTasks || 0}</div>
                            <div className="text-xs text-gray-500">完成任务</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 佣金贡献比例 */}
                    {invite.status !== 'pending' && commissionStats.total > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">佣金贡献</span>
                          <span className="text-xs text-blue-600">{((invite.myCommission / commissionStats.total) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-gray-200 h-1 rounded">
                          <div 
                            className="bg-blue-500 h-1 rounded" 
                            style={{width: `${(invite.myCommission / commissionStats.total) * 100}%`}}
                          ></div>
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
                
                {/* 佣金来源饼图 */}
                <div className="mt-6">
                  <div className="flex justify-center">
                    <div className="relative w-40 h-40">
                      {/* 简化的环形图表实现 */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="16"
                        />
                        {/* 任务佣金 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="16"
                          strokeDasharray={`${(commissionStats.breakdown.task / commissionStats.total) * 251.2} 251.2`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        {/* 注册奖励 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="16"
                          strokeDasharray={`${(commissionStats.breakdown.register / commissionStats.total) * 251.2} 251.2`}
                          strokeDashoffset={`${(commissionStats.breakdown.task / commissionStats.total) * 251.2}`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* 团队奖励 */}
                        {commissionStats.breakdown.team > 0 && (
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="16"
                            strokeDasharray={`${(commissionStats.breakdown.team / commissionStats.total) * 251.2} 251.2`}
                            strokeDashoffset={`${((commissionStats.breakdown.task + commissionStats.breakdown.register) / commissionStats.total) * 251.2}`}
                            transform="rotate(-90 50 50)"
                          />
                        )}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">佣金比例</div>
                        </div>
                      </div>
                    </div>
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
                <span className="text-xs text-gray-500">最近{Math.min(commissionRecords.length, 10)}条记录</span>
              </div>
            </div>
            <div className="divide-y overflow-y-auto">
              {/* 限制只显示前10条记录 */}
              {commissionRecords.slice(0, 10).map((record) => (
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
              )) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-5xl mb-4">💰</div>
                  <div className="text-gray-500">暂无佣金记录</div>
                  <div className="text-gray-400 text-sm mt-2">邀请好友完成任务，即可获得佣金奖励！</div>
                </div>
              )}
            </div>
            
            {/* 查看更多 */}
            {commissionRecords.length > 10 && (
              <div className="p-4 border-t bg-gray-50">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  查看全部佣金记录
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}