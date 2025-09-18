import commenterUsers from '@/data/commenteruser/commenteruser.json';
import commentOrders from '@/data/commentOrder/commentOrder.json';
import { NextResponse } from 'next/server';
import { validateTokenByRole } from '@/auth/common';

// 获取待领取的订单列表
export async function GET(request: Request) {
  try {
    // 从请求头中获取认证token并验证用户身份
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
      // 使用新认证系统的验证函数来解析token
      const user = await validateTokenByRole(token, 'commenter');
      console.log('解析token结果:', user);
      if (user && user.role === 'commenter') {
        currentUserId = user.id;
      }
    }
    
    // 如果没有有效的用户ID，返回错误
    if (!currentUserId) {
      console.log('未找到有效的用户ID');
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }

    // 查找所有待领取的订单（status为pending的子订单）
    const availableTasks: any[] = [];
    
    commentOrders.orders.forEach(order => {
      if (order.status === 'in_progress' || order.status === 'active') {
        order.subOrders.forEach((subOrder: any) => {
          if (subOrder.status === 'pending') {
            availableTasks.push({
              id: subOrder.id,
              parentId: subOrder.parentId,
              title: `评论任务 #${order.orderNumber}`,
              price: subOrder.unitPrice,
              category: '评论', // 可以从主订单获取或默认为评论
              remaining: `${order.quantity - order.completedQuantity}/${order.quantity}`,
              progress: Math.round((order.completedQuantity / order.quantity) * 100),
              requirements: order.taskRequirements,
              publishTime: order.publishTime,
              videoUrl: order.videoUrl,
              mention: order.mention,
              deadline: order.deadline
            });
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: availableTasks,
      message: '获取待领取订单成功'
    });
  } catch (error) {
    console.error('获取待领取订单错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 抢单功能
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taskId = body.taskId;
    
    // 验证必要参数
    if (!taskId) {
      return NextResponse.json(
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }
    
    // 从请求头中获取认证token并验证用户身份
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
      // 使用新认证系统的验证函数来解析token
      const user = await validateTokenByRole(token, 'commenter');
      console.log('解析token结果:', user);
      if (user && user.role === 'commenter') {
        currentUserId = user.id;
      }
    }
    
    // 如果没有有效的用户ID，返回错误
    if (!currentUserId) {
      console.log('未找到有效的用户ID');
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }
    
    // 查找对应用户
    const user = commenterUsers.users.find(u => u.id === currentUserId);
    if (!user || user.role !== 'commenter') {
      return NextResponse.json(
        { success: false, message: '无效的用户ID或权限不足' },
        { status: 401 }
      );
    }
    
    // 查找并更新订单状态
    let orderUpdated = false;
    let updatedTask = null;
    
    // 遍历所有主订单
    for (const order of commentOrders.orders) {
      // 遍历主订单下的所有子订单
      for (const subOrder of order.subOrders) {
        if (subOrder.id === taskId && subOrder.status === 'pending') {
          // 更新子订单状态为进行中
          subOrder.status = 'in_progress';
          subOrder.commenterId = user.id;
          subOrder.commenterName = user.username;
          subOrder.userId = user.id;
          
          // 更新主订单的完成数量
          order.completedQuantity += 1;
          
          // 如果所有子订单都已完成，更新主订单状态
          const allCompleted = order.subOrders.every((so: any) => 
            so.status === 'completed' || so.status === 'in_progress'
          );
          
          if (allCompleted) {
            order.status = 'completed';
          }
          
          orderUpdated = true;
          
          // 记录抢单时间，用于3分钟自动释放功能
          const grabTime = new Date().toISOString();
          
          updatedTask = {
            taskId,
            grabTime,
            deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString() // 3分钟后
          };
          
          break; // 找到后跳出内层循环
        }
      }
      
      if (orderUpdated) {
        break; // 找到后跳出外层循环
      }
    }
    
    // 抢单成功
    if (orderUpdated && updatedTask) {
      return NextResponse.json({
        success: true,
        message: '抢单成功，请在3分钟内提交审核',
        data: updatedTask
      });
    }

    if (!orderUpdated) {
      return NextResponse.json(
        { success: false, message: '任务已被抢或不存在' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('抢单错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}