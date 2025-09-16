import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 获取统计数据
const getStatsData = (orders: any[], timeRange: string) => {
  // 过滤当前发布者的订单（这里简化处理，实际应该根据发布者ID过滤）
  const publisherOrders = orders;
  
  // 根据时间范围过滤订单（如果时间范围是'month'或'all'，则不过滤）
  const filteredOrders = (timeRange === 'month' || timeRange === 'all') ? publisherOrders : filterOrdersByTimeRange(publisherOrders, timeRange);
  
  // 计算统计数据
  const totalTasks = filteredOrders.length;
  const activeTasks = filteredOrders.filter(order => order.status === '已发布' || order.status === '进行中').length;
  const completedTasks = filteredOrders.filter(order => order.status === '已完成').length;
  const totalSpent = filteredOrders.reduce((sum, order) => sum + (order.unitPrice * order.quantity), 0);
  const totalParticipants = filteredOrders.reduce((sum, order) => sum + order.completedQuantity, 0);
  
  return {
    totalTasks,
    activeTasks,
    completedTasks,
    totalSpent,
    totalParticipants
  };
};

// 根据时间范围过滤订单
const filterOrdersByTimeRange = (orders: any[], timeRange: string) => {
  // 使用本地时间而不是UTC时间
  const now = new Date();
  console.log(`当前时间: ${now.toString()}`);
  console.log(`时间范围: ${timeRange}`);
  
  // 设置时间范围的开始时间（使用本地时间）
  let startTime: Date;
  switch (timeRange) {
    case 'today':
      // 今天的开始时间（本地时间）
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'yesterday':
      // 昨天的开始时间（本地时间）
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      break;
    case 'week':
      // 本周第一天（周一）的开始时间（本地时间）
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周日视为第7天
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
      break;
    case 'month':
      // 本月第一天的开始时间（本地时间）
      startTime = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      console.log('未知时间范围，返回所有订单');
      return orders; // 返回所有订单
  }
  
  console.log(`开始时间: ${startTime.toString()}`);
  console.log(`结束时间: ${now.toString()}`);
  
  // 过滤在时间范围内的订单（检查发布时间，转换为本地时间进行比较）
  const filteredOrders = orders.filter(order => {
    const publishTime = new Date(order.publishTime);
    const isInRange = publishTime >= startTime && publishTime <= now;
    console.log(`订单ID: ${order.id}, 发布时间: ${publishTime.toString()}, 是否在范围内: ${isInRange}`);
    return isInRange;
  });
  
  console.log(`过滤后的订单数量: ${filteredOrders.length}`);
  return filteredOrders;
};

// 转换订单数据为任务列表格式
const transformOrdersToTasks = (orders: any[]) => {
  return orders.map(order => {
    // 确定任务状态
    let status, statusText, statusColor;
    switch (order.status) {
      case '已发布':
      case '进行中':
        status = 'active';
        statusText = '进行中';
        statusColor = 'bg-green-100 text-green-600';
        break;
      case '待审核':
        status = 'review';
        statusText = '待审核';
        statusColor = 'bg-orange-100 text-orange-600';
        break;
      case '已完成':
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
      inProgress = order.subOrders.filter((subOrder: any) => subOrder.status === '审核中').length;
      pending = order.subOrders.filter((subOrder: any) => subOrder.status === '待领取').length;
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

// 获取待审核的订单
const getPendingOrders = (orders: any[]) => {
  // 查找所有状态为"待审核"的子订单
  const pendingSubOrders: any[] = [];
  
  orders.forEach(order => {
    const pendingSubs = order.subOrders.filter((subOrder: any) => subOrder.status === '审核中');
    pendingSubs.forEach((subOrder: any) => {
      pendingSubOrders.push({
        id: subOrder.id,
        taskTitle: order.taskRequirements.substring(0, 20) + (order.taskRequirements.length > 20 ? '...' : ''),
        commenterName: subOrder.commenterName || '未知评论员',
        submitTime: subOrder.commentTime ? new Date(subOrder.commentTime).toLocaleString('zh-CN') : '未知时间',
        content: subOrder.commentContent || '无内容',
        images: subOrder.screenshotUrl ? [subOrder.screenshotUrl] : []
      });
    });
  });
  
  return pendingSubOrders;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'today';
    
    // 读取订单数据
    const orderData = getCommentOrders();
    const orders = orderData.orders;
    
    // 获取统计数据
    const stats = getStatsData(orders, timeRange);
    
    // 获取任务列表
    const allTasks = transformOrdersToTasks(orders);
    
    // 分类任务
    const activeTasks = allTasks.filter(task => task.status === 'active');
    const completedTasks = allTasks.filter(task => task.status === 'completed');
    
    // 获取待审核订单
    const pendingOrders = getPendingOrders(orders);
    
    // 获取派发的任务列表（最近5个）
    const dispatchedTasks = allTasks.slice(0, 5).map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      statusText: task.statusText,
      participants: task.participants,
      maxParticipants: task.maxParticipants,
      time: getTimeAgo(task.publishTime),
      completed: task.completed,
      inProgress: task.inProgress, // 添加进行中的数量
      pending: task.pending // 添加待抢单的数量
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        activeTasks,
        completedTasks,
        pendingOrders,
        dispatchedTasks
      }
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// 计算时间差（用于显示"几小时前"等）
const getTimeAgo = (publishTime: string) => {
  const publishDate = new Date(publishTime);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return '刚刚';
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else {
    return `${Math.floor(diffInHours / 24)}天前`;
  }
};