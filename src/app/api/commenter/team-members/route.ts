import { NextResponse } from 'next/server';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import { financeModelAdapter } from '@/data/commenteruser/finance_model_adapter';

// GET /api/commenter/team-members - 获取当前用户的团队成员
export async function GET(request: Request) {
  try {
    // 验证用户认证
    const authSession = CommenterAuthStorage.getAuth();
    
    if (!authSession || !authSession.user) {
      return NextResponse.json({ success: false, message: '未登录或认证已过期' }, { status: 401 });
    }
    
    const currentUserId = authSession.user.id;
    
    // 使用financeModelAdapter获取团队成员
    const teamMembers = await financeModelAdapter.getUserTeamMembers(currentUserId);
    
    // 计算团队统计信息
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(member => member.status === '活跃').length;
    const totalTeamEarnings = teamMembers.reduce((sum, member) => sum + member.totalEarnings, 0);
    const totalMyCommission = teamMembers.reduce((sum, member) => sum + member.myCommission, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        teamMembers,
        statistics: {
          totalMembers,
          activeMembers,
          totalTeamEarnings,
          totalMyCommission
        }
      }
    });
  } catch (error) {
    console.error('获取团队成员失败:', error);
    return NextResponse.json({ success: false, message: '获取团队成员失败' }, { status: 500 });
  }
}