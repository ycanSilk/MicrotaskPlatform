import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateToken } from '@/lib/auth';

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 转换订单数据为任务列表格式
const transformOrdersToTasks = (orders: any[]) => {
  return orders.map(order => {
    // 确定任务状态
    let status, statusText, statusColor;
    switch (order.status) {
      case 'in_progress':
        status = 'active';
        statusText = '进行中';
        statusColor = 'bg-green-100 text-green-600';
        break;
      case 'pending_review':
        status = 'review';
        statusText = '待审核';
        statusColor = 'bg-orange-100 text-orange-600';
        break;
      case 'completed':
        status = 'completed';
        statusText = '已完成';
        statusColor = 'bg-green-100 text-green-600';
        break;
      default:
        status = 'paused';
        statusText = '已暂停';
        statusColor = 'bg-gray-100 text-gray-600';
    }
    
    // 计算进行中和待抢单的数量
    let inProgress = 0;
    let pending = 0;
    
    if (order.subOrders && Array.isArray(order.subOrders)) {
      inProgress = order.subOrders.filter((subOrder: any) => subOrder.status === 'pending_review').length;
      pending = order.subOrders.filter((subOrder: any) => subOrder.status === 'pending').length;
    }
    
    return {
      id: order.id,
      title: order.taskRequirements.substring(0, 20) + (order.taskRequirements.length > 20 ? '...' : ''),
      category: '评论任务',
      price: order.unitPrice,
      status,
      statusText,
      statusColor,
      participants: order.completedQuantity,
      maxParticipants: order.quantity,
      completed: order.completedQuantity,
      inProgress, // 进行中的数量
      pending, // 待抢单的数量
      publishTime: new Date(order.publishTime).toLocaleString('zh-CN'),
      deadline: new Date(order.deadline).toLocaleString('zh-CN'),
      description: order.taskRequirements
    };
  });
};

// 过滤订单以匹配当前用户
const filterOrdersByUser = (orders: any[], userId: string) => {
  return orders.filter(order => order.userId === userId);
};

export async function GET(request: Request) {
  try {
    // 从请求头中获取认证token并解析用户ID
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
      // 使用认证系统的验证函数来解析token
      const user = validateToken(token);
      console.log('解析token结果:', user);
      if (user && user.role === 'publisher') {
        currentUserId = user.id;
      }
    }
    
    // 如果没有有效的用户ID，返回错误
    if (!currentUserId) {
      console.log('未找到有效的用户ID');
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }
    
    console.log(`当前用户ID: ${currentUserId}`);

    // 读取订单数据
    const orderData = getCommentOrders();
    const allOrders = orderData.orders;
    
    // 过滤当前用户的订单
    const userOrders = filterOrdersByUser(allOrders, currentUserId);
    console.log(`用户${currentUserId}的订单数量:`, userOrders.length);
    
    // 转换订单数据
    const tasks = transformOrdersToTasks(userOrders);
    
    return NextResponse.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Tasks data fetch error:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}