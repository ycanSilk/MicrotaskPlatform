import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateToken } from '@/lib/auth'; // 导入验证token的函数

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 获取统计数据
const getStatsData = (orders: any[], timeRange: string) => {
  // 根据时间范围过滤订单
  const filteredOrders = filterOrdersByTimeRange(orders, timeRange);
  
  // 计算统计数据
  const totalTasks = filteredOrders.length;
  const activeTasks = filteredOrders.filter(order => order.status === 'in_progress').length;
  const completedTasks = filteredOrders.filter(order => order.status === 'completed').length;
  const totalSpent = filteredOrders.reduce((sum, order) => sum + (order.unitPrice * order.quantity), 0);
  
  // 计算子订单统计数据
  let totalInProgressSubOrders = 0;
  let totalCompletedSubOrders = 0;
  let totalPendingReviewSubOrders = 0;
  let totalPendingSubOrders = 0;
  
  filteredOrders.forEach(order => {
    if (order.subOrders && Array.isArray(order.subOrders)) {
      totalInProgressSubOrders += order.subOrders.filter((subOrder: any) => subOrder.status === 'in_progress').length;
      totalCompletedSubOrders += order.subOrders.filter((subOrder: any) => subOrder.status === 'completed').length;
      totalPendingReviewSubOrders += order.subOrders.filter((subOrder: any) => subOrder.status === 'pending_review').length;
      totalPendingSubOrders += order.subOrders.filter((subOrder: any) => subOrder.status === 'pending').length;
    }
  });
  
  // 计算平均客单价
  const averageOrderValue = totalTasks > 0 ? totalSpent / totalTasks : 0;
  
  return {
    totalTasks,
    activeTasks,
    completedTasks,
    totalSpent,
    totalInProgressSubOrders,
    totalCompletedSubOrders,
    totalPendingReviewSubOrders,
    totalPendingSubOrders,
    averageOrderValue
  };
};

// 根据时间范围过滤订单
const filterOrdersByTimeRange = (orders: any[], timeRange: string) => {
  // 如果时间范围是'all'，则不过滤
  if (timeRange === 'all') {
    return orders;
  }
  
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
      case 'in_progress':
        status = 'active';
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
        console.log(`警告：发现未知状态 "${order.status}" 的订单 ${order.id}，将默认设为进行中`);
        status = 'active';
        statusText = '进行中';
        statusColor = 'bg-green-100 text-green-600';
    }
    
    // 计算进行中、待抢单和已完成的数量
    let inProgress = 0;
    let pending = 0;
    let completed = 0;
    let pendingReview = 0; // 添加待审核的数量
    
    if (order.subOrders && Array.isArray(order.subOrders)) {
      inProgress = order.subOrders.filter((subOrder: any) => subOrder.status === 'in_progress').length;
      pending = order.subOrders.filter((subOrder: any) => subOrder.status === 'pending').length;
      completed = order.subOrders.filter((subOrder: any) => subOrder.status === 'completed').length;
      pendingReview = order.subOrders.filter((subOrder: any) => subOrder.status === 'pending_review').length; // 计算待审核的数量
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
      inProgress: inProgress, // 进行中的数量
      pending: pending, // 待抢单的数量
      pendingReview: pendingReview, // 待审核的数量
      publishTime: new Date(order.publishTime).toLocaleString('zh-CN'),
      deadline: new Date(order.deadline).toLocaleString('zh-CN'),
      description: order.taskRequirements
    };
  });
};

// 获取待审核的订单
const getPendingOrders = (orders: any[], currentUserId: string) => {
  // 查找所有状态为"审核中"的子订单，并且主任务属于当前用户
  const pendingSubOrders: any[] = [];
  
  console.log(`开始过滤用户 ${currentUserId} 的待审核订单`);
  console.log(`总订单数: ${orders.length}`);
  
  orders.forEach(order => {
    // 只处理当前用户的订单（确保订单属于当前用户）
    if (order.userId === currentUserId) {
      console.log(`检查订单 ${order.id} 的子订单`);
      // 确保subOrders存在且为数组
      if (order.subOrders && Array.isArray(order.subOrders)) {
        const pendingSubs = order.subOrders.filter((subOrder: any) => {
          const isPendingReview = subOrder.status === 'pending_review';
          console.log(`子订单 ${subOrder.id} 状态: ${subOrder.status}, 是否为pending_review: ${isPendingReview}`);
          return isPendingReview;
        });
        
        console.log(`订单 ${order.id} 找到 ${pendingSubs.length} 个pending_review子订单`);
        
        pendingSubs.forEach((subOrder: any) => {
          const pendingOrder = {
            id: subOrder.id,
            taskTitle: order.taskRequirements.substring(0, 20) + (order.taskRequirements.length > 20 ? '...' : ''),
            commenterName: subOrder.commenterName || '未知评论员',
            submitTime: subOrder.commentTime ? new Date(subOrder.commentTime).toLocaleString('zh-CN') : '未知时间',
            content: subOrder.commentContent || '无内容',
            images: subOrder.screenshotUrl ? [subOrder.screenshotUrl] : []
          };
          console.log(`添加待审核订单:`, pendingOrder);
          pendingSubOrders.push(pendingOrder);
        });
      }
    }
  });
  
  console.log(`总共找到 ${pendingSubOrders.length} 个待审核订单:`, pendingSubOrders.map(order => order.id));
  return pendingSubOrders;
};

// 过滤订单以匹配当前用户
const filterOrdersByUser = (orders: any[], userId: string) => {
  return orders.filter(order => order.userId === userId);
};

export async function GET(request: Request) {
  try {
    // 添加no-cache头来避免缓存
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
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
        { status: 401, headers }
      );
    }
    
    console.log(`当前用户ID: ${currentUserId}`);

    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'all'; // 默认使用'all'而不是'today'
    
    // 读取订单数据
    const orderData = getCommentOrders();
    const allOrders = orderData.orders;
    
    // 过滤当前用户的订单
    const userOrders = filterOrdersByUser(allOrders, currentUserId);
    console.log(`用户${currentUserId}的订单数量:`, userOrders.length);
    
    // 获取统计数据
    const stats = getStatsData(userOrders, timeRange);
    
    // 获取任务列表
    const allTasks = transformOrdersToTasks(userOrders);
    console.log(`转换后的任务列表:`, allTasks.map(task => ({id: task.id, status: task.status, statusText: task.statusText})));
    
    // 分类任务
    const activeTasks = allTasks.filter(task => task.status === 'active');
    const completedTasks = allTasks.filter(task => task.status === 'completed');
    
    // 获取待审核订单（只获取当前用户的）
    const pendingOrders = getPendingOrders(allOrders, currentUserId); // 修复：使用allOrders以确保能查找到所有用户的订单
    console.log(`用户${currentUserId}的待审核订单数量:`, pendingOrders.length);
    
    // 获取派发的任务列表（最近10个）
    const dispatchedTasks = allTasks.slice(0, 10).map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      statusText: task.statusText,
      participants: task.participants,
      maxParticipants: task.maxParticipants,
      time: task.publishTime, // 直接使用发布时间而不是计算时间差
      completed: task.completed,
      inProgress: task.inProgress, // 添加进行中的数量
      pending: task.pending, // 添加待抢单的数量
      pendingReview: task.pendingReview, // 添加待审核的数量
      price: task.price // 添加单价字段
    }));
    
    console.log(`派发的任务列表:`, dispatchedTasks.map(task => ({id: task.id, status: task.status, statusText: task.statusText})));
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        activeTasks,
        completedTasks,
        pendingOrders,
        dispatchedTasks
      }
    }, { headers });
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