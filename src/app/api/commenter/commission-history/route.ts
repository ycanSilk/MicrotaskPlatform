import { NextResponse } from 'next/server';
import { CommenterAuthStorage } from '@/auth/commenter/auth';
import { financeModelAdapter } from '@/data/commenteruser/finance_model_adapter';

// GET /api/commenter/commission-history - 获取当前用户的佣金历史记录
export async function GET(request: Request) {
  try {
    // 验证用户认证
    const authSession = CommenterAuthStorage.getAuth();
    
    if (!authSession || !authSession.user) {
      return NextResponse.json({ success: false, message: '未登录或认证已过期' }, { status: 401 });
    }
    
    const currentUserId = authSession.user.id;
    
    // 使用financeModelAdapter获取佣金历史
    const commissionHistory = await financeModelAdapter.getUserCommissionHistory(currentUserId);

    // 计算佣金统计信息
    const totalCommission = commissionHistory.reduce((sum, item) => sum + item.commission, 0);
    const taskCommissions = commissionHistory.filter(item => item.type === 'task');
    const registerCommissions = commissionHistory.filter(item => item.type === 'register');
    
    // 计算今日、昨日、本月佣金
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const todayCommission = commissionHistory
      .filter(item => item.date && item.date.startsWith(todayStr))
      .reduce((sum, item) => sum + item.commission, 0);
    
    const yesterdayCommission = commissionHistory
      .filter(item => item.date && item.date.startsWith(yesterdayStr))
      .reduce((sum, item) => sum + item.commission, 0);
    
    const thisMonthCommission = commissionHistory
      .filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        return itemDate >= firstDayOfMonth;
      })
      .reduce((sum, item) => sum + item.commission, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        commissionHistory,
        statistics: {
          totalCommission,
          taskCommissions: taskCommissions.length,
          registerCommissions: registerCommissions.length,
          todayCommission,
          yesterdayCommission,
          thisMonthCommission,
          taskCommissionTotal: taskCommissions.reduce((sum, item) => sum + item.commission, 0),
          registerCommissionTotal: registerCommissions.reduce((sum, item) => sum + item.commission, 0)
        }
      }
    });
  } catch (error) {
    console.error('获取佣金历史失败:', error);
    return NextResponse.json({ success: false, message: '获取佣金历史失败' }, { status: 500 });
  }
}