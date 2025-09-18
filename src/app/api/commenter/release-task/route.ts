import { NextResponse } from 'next/server';
import commentOrders from '@/data/commentOrder/commentOrder.json';
import { validateTokenByRole } from '@/auth/common';

// 检查并释放超时订单（可以由前端定期调用或后台任务执行）
export async function POST(request: Request) {
  try {
    // 验证用户身份
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未提供认证令牌' },
        { status: 401 }
      );
    }
    
    const user = await validateTokenByRole(token, 'commenter');
    if (!user) {
      return NextResponse.json(
        { success: false, message: '无效的认证令牌' },
        { status: 401 }
      );
    }

    const { taskId } = await request.json();
    let tasksReleased = 0;

    // 查找并释放超时的订单
    commentOrders.orders.forEach(order => {
      order.subOrders.forEach((subOrder: any) => {
        // 如果是进行中状态的订单，检查是否超时
        if (subOrder.status === 'in_progress' && 
            subOrder.commentTime === '' && 
            subOrder.screenshotUrl === '') {
          
          // 检查是否是指定的任务ID（如果提供了）
          if (!taskId || subOrder.id === taskId) {
            // 计算订单被抢的时间（这里假设commentTime为空表示未提交审核）
            // 在实际应用中，应该有一个专门的grabTime字段
            const now = new Date();
            const publishTime = new Date(order.publishTime);
            const timeDiff = now.getTime() - publishTime.getTime();
            const minutesPassed = timeDiff / (1000 * 60);
            
            // 如果超过3分钟且没有提交审核，释放订单
            if (minutesPassed >= 3) {
              subOrder.status = 'pending';
              subOrder.commenterId = '';
              subOrder.commenterName = '';
              
              // 更新主订单的完成数量
              order.completedQuantity -= 1;
              
              // 如果有未完成的子订单，更新主订单状态
              if (order.status === 'completed') {
                order.status = 'in_progress';
              }
              
              tasksReleased++;
            }
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: `成功释放 ${tasksReleased} 个超时订单`,
      data: { releasedCount: tasksReleased }
    });
  } catch (error) {
    console.error('释放超时订单错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}