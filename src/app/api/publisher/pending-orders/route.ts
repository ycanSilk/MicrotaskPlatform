import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateTokenByRole } from '@/auth/common';

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  // 添加noCache参数来避免缓存
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
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
            images: subOrder.screenshotUrl ? [subOrder.screenshotUrl] : [],
            status: 'pending_review' // 确保状态字段始终为pending_review
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
      // 使用新认证系统的验证函数来解析token
      const user = await validateTokenByRole(token, 'publisher');
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

    // 读取订单数据
    const orderData = getCommentOrders();
    const allOrders = orderData.orders;
    
    // 获取待审核订单（只获取当前用户的）
    const pendingOrders = getPendingOrders(allOrders, currentUserId);
    console.log(`用户${currentUserId}的待审核订单数量:`, pendingOrders.length);
    console.log(`用户${currentUserId}的待审核订单列表:`, pendingOrders);
    
    return NextResponse.json({
      success: true,
      data: pendingOrders
    }, { headers });
  } catch (error) {
    console.error('Pending orders data fetch error:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}