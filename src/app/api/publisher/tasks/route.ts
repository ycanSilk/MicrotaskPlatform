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
const transformOrderToTask = (order: any) => {
  // 确定任务状态
  let status, statusText, statusColor;
  switch (order.status) {
    case 'in_progress':
      status = 'in_progress';
      statusText = '进行中';
      statusColor = 'bg-green-100 text-green-600';
      break;
    case 'completed':
      status = 'completed';
      statusText = '已完成';
      statusColor = 'bg-green-100 text-green-600';
      break;
    default:
      // 根据规范，主任务只有进行中和已完成两种状态
      // 如果状态不是这两个之一，默认设为进行中
      status = 'in_progress';
      statusText = '进行中';
      statusColor = 'bg-green-100 text-green-600';
  }
  
  // 计算进行中和待抢单的数量
  let inProgress = 0;
  let pending = 0;
  let completed = 0;
  
  if (order.subOrders && Array.isArray(order.subOrders)) {
    inProgress = order.subOrders.filter((subOrder: any) => subOrder.status === 'in_progress').length;
    pending = order.subOrders.filter((subOrder: any) => subOrder.status === 'pending').length;
    completed = order.subOrders.filter((subOrder: any) => subOrder.status === 'completed').length;
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
    completed: completed,
    inProgress: inProgress,
    pending: pending,
    publishTime: new Date(order.publishTime).toLocaleString('zh-CN'),
    deadline: new Date(order.deadline).toLocaleString('zh-CN'),
    description: order.taskRequirements
  };
};

// 过滤订单以匹配当前用户
const filterOrdersByUser = (orders: any[], userId: string) => {
  return orders.filter(order => order.userId === userId);
};

// 根据状态过滤订单
const filterOrdersByStatus = (orders: any[], status: string) => {
  // 直接使用JSON文件中的状态值，不再进行映射
  if (!status) {
    return orders; // 如果没有提供状态，返回所有订单
  }
  
  return orders.filter(order => order.status === status);
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
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || ''; // 获取状态参数
    
    // 读取订单数据
    const orderData = getCommentOrders();
    const allOrders = orderData.orders;
    
    // 过滤当前用户的订单
    let userOrders = filterOrdersByUser(allOrders, currentUserId);
    console.log(`用户${currentUserId}的订单数量:`, userOrders.length);
    
    // 如果提供了状态参数，则进一步过滤
    if (status) {
      userOrders = filterOrdersByStatus(userOrders, status);
      console.log(`用户${currentUserId}的${status}状态订单数量:`, userOrders.length);
    }
    
    // 转换订单为任务格式
    const tasks = userOrders.map(order => transformOrderToTask(order));
    
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