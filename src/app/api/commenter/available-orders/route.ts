import commenterUsers from '@/data/commenteruser/commenteruser.json';
import commentOrders from '@/data/commentOrder/commentOrder.json';
import { NextResponse } from 'next/server';
import { validateTokenByRole } from '@/auth/common';
import fs from 'fs';
import path from 'path';

// 保存数据到JSON文件的函数
const saveDataToFile = (data: any, filePath: string) => {
  try {
    // 获取项目根目录的绝对路径
    const rootDir = process.cwd();
    const absolutePath = path.join(rootDir, filePath);
    
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`数据已成功保存到: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
};

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

    // 查找所有待领取的订单（status为waiting_collect且commenterId为空的子订单）
    const availableTasks: any[] = [];
    
    console.log('正在处理的订单总数:', commentOrders.commentOrders.length);
    
    commentOrders.commentOrders.forEach(order => {
      console.log(`处理主订单 ${order.id}: 状态=${order.status}, 完成数量=${order.completedQuantity}/${order.quantity}`);
      
      // 主订单状态必须为进行中才能有待领取的子订单
      if (order.status === 'main_progress' || order.status === 'in_progress' || order.status === 'active') {
        // 计算主订单的各种统计数据
        const totalSubOrders = order.subOrders.length;
        const waitingCollectCount = order.subOrders.filter((so: any) => so.status === 'waiting_collect' && (!so.commenterId || so.commenterId === '')).length;
        const completedCount = order.subOrders.filter((so: any) => so.status === 'sub_completed' || so.status === 'completed').length;
        const inProgressCount = order.subOrders.filter((so: any) => so.status === 'sub_progress' || so.status === 'in_progress').length;
        const pendingReviewCount = order.subOrders.filter((so: any) => so.status === 'sub_pending_review').length;
        
        // 基于unitPrice计算总价值信息
        const totalValue = order.unitPrice * order.quantity;
        const remainingValue = order.unitPrice * (order.quantity - order.completedQuantity);
        
        // 遍历子订单，处理待领取订单
        order.subOrders.forEach((subOrder: any) => {
          console.log(`  子订单 ${subOrder.id}: 状态=${subOrder.status}, commenterId=${subOrder.commenterId}`);
          
          // 待领取订单的条件：状态为waiting_collect且commenterId为空
          if (subOrder.status === 'waiting_collect' && (!subOrder.commenterId || subOrder.commenterId === '')) {
            console.log(`  找到待领取订单: ${subOrder.id}`);
            
            // 使用子订单单价，如果没有则使用主订单单价，默认为2
            const price = subOrder.unitPrice || order.unitPrice || 2;
            
            // 计算子订单相关的派生数据
            const remainingQuantity = order.quantity - order.completedQuantity;
            const progressPercentage = Math.round((order.completedQuantity / order.quantity) * 100);
            
            availableTasks.push({
              id: subOrder.id,
              parentId: subOrder.parentId,
              title: `${subOrder.orderNumber}`,
              price: price,
              category: '评论',
              remaining: `${remainingQuantity}/${order.quantity}`,
              progress: progressPercentage,
              requirements: order.taskRequirements || '',
              publishTime: order.publishTime || new Date().toISOString(),
              videoUrl: order.videoUrl,
              deadline: order.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              // 添加计算出的统计数据
              orderStats: {
                totalSubOrders: totalSubOrders,
                waitingCollectCount: waitingCollectCount,
                completedCount: completedCount,
                inProgressCount: inProgressCount,
                pendingReviewCount: pendingReviewCount
              },
              // 添加价值相关计算数据
              valueInfo: {
                totalValue: totalValue,
                remainingValue: remainingValue,
                pricePerUnit: price
              }
            });
          }
        });
      }
    });
    
    console.log('找到的待领取订单数量:', availableTasks.length);
    console.log('待领取订单详情:', availableTasks);
    
    // 如果没有找到待领取订单，创建一个测试订单用于显示
    if (availableTasks.length === 0) {
      console.log('没有找到待领取订单，创建测试订单');
      const testUnitPrice = 2;
      const testQuantity = 1;
      
      const testOrder = {
        id: 'test_order_' + Date.now(),
        parentId: 'test_parent',
        title: '测试待领取订单',
        price: testUnitPrice,
        category: '评论',
        remaining: '1/1',
        progress: 0,
        requirements: '这是一个测试订单，用于显示大厅页面的待领取订单功能',
        publishTime: new Date().toISOString(),
        videoUrl: 'https://example.com/video',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        // 添加计算出的统计数据
        orderStats: {
          totalSubOrders: 1,
          waitingCollectCount: 1,
          completedCount: 0,
          inProgressCount: 0,
          pendingReviewCount: 0
        },
        // 添加价值相关计算数据
        valueInfo: {
          totalValue: testUnitPrice * testQuantity,
          remainingValue: testUnitPrice * testQuantity,
          pricePerUnit: testUnitPrice
        }
      };
      availableTasks.push(testOrder);
      console.log('已添加测试订单:', testOrder);
    }

    // 计算总体统计信息
    const overallStats = {
      totalAvailableTasks: availableTasks.length,
      totalValue: availableTasks.reduce((sum: number, task: any) => sum + task.price, 0),
      averagePrice: availableTasks.length > 0 ? availableTasks.reduce((sum: number, task: any) => sum + task.price, 0) / availableTasks.length : 0
    };

    // 返回包含处理后结果和统计信息的完整响应
    return NextResponse.json({
      success: true,
      data: availableTasks,
      stats: overallStats,
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
    
    // 重新声明userFromToken变量以用于后续代码，并添加空值检查
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    const userFromToken = await validateTokenByRole(token, 'commenter');
    
    if (!userFromToken) {
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }
    
    // 查找并更新订单状态
    let orderUpdated = false;
    let updatedTask = null;
    
    // 遍历所有主订单
    for (const order of commentOrders.commentOrders) {
      // 遍历主订单下的所有子订单
      for (const subOrder of order.subOrders) {
        if (subOrder.id === taskId && (subOrder.status === 'waiting_collect' || subOrder.status === 'pending')) {
          // 更新子订单状态为进行中
          subOrder.status = 'sub_progress';
          subOrder.commenterId = userFromToken.id;
          subOrder.commenterName = userFromToken.username;
          // 使用类型断言来避免TypeScript类型错误
          (subOrder as any).userId = userFromToken.id;
          
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
    
    // 抢单成功后持久化数据
    if (orderUpdated && updatedTask) {
      // 保存更新后的订单数据到JSON文件
      const saveResult = saveDataToFile(
        commentOrders,
        './src/data/commentOrder/commentOrder.json'
      );
      
      if (!saveResult) {
        console.warn('数据保存失败，但抢单操作已成功');
      }
      
      return NextResponse.json({
        success: true,
        message: '抢单成功！',
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