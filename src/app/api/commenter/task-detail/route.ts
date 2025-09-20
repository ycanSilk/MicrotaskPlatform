import { validateTokenByRole } from '@/auth/common';
import commentOrders from '@/data/commentOrder/commentOrder.json';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// 临时调试函数 - 打印完整的URL信息
function debugUrl(url: URL): void {
  console.log('===== URL调试信息 =====');
  console.log('完整URL:', url.toString());
  console.log('路径:', url.pathname);
  console.log('所有查询参数:');
  url.searchParams.forEach((value, key) => {
    console.log(`  ${key}: "${value}" (类型: ${typeof value})`);
  });
  console.log('=====================');
}

// 获取评论员任务详情
export async function GET(request: Request) {
  try {
    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    console.log('调试信息 - API收到GET请求');
    console.log('调试信息 - 请求URL:', request.url);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('调试信息 - 存在认证token，长度:', token.length);
      const user = await validateTokenByRole(token, 'commenter');
      
      if (user && user.role === 'commenter') {
        currentUserId = user.id;
        console.log('调试信息 - 用户认证成功，用户ID:', currentUserId);
      } else {
        console.error('调试错误 - 用户认证失败，角色不匹配或用户不存在');
      }
    } else {
      console.error('调试错误 - 未提供认证token或格式不正确');
    }
    
    if (!currentUserId) {
      console.error('调试错误 - 无法获取当前用户ID');
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId') || url.searchParams.get('id');
    
    // 使用调试函数打印完整URL信息
    debugUrl(url);
    
    console.log('详细调试信息 - 从URL解析的参数:');
    console.log('详细调试信息 - taskId参数值:', url.searchParams.get('taskId'), '类型:', typeof url.searchParams.get('taskId'));
    console.log('详细调试信息 - id参数值:', url.searchParams.get('id'), '类型:', typeof url.searchParams.get('id'));
    console.log('详细调试信息 - 最终使用的taskId:', taskId, '类型:', typeof taskId);
    console.log('详细调试信息 - taskId是否为空:', !taskId);
    
    if (!taskId) {
      console.error('调试错误 - 任务ID为空');
      return NextResponse.json(
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }

    // 查找任务详情
    let taskDetails = null;
    let parentOrder = null;
    
    console.log('调试信息 - 开始查找任务详情，用户ID:', currentUserId, '任务ID:', taskId);
    
    for (const order of commentOrders.commentOrders) {
      for (const subOrder of order.subOrders) {
        if (subOrder.id === taskId && subOrder.commenterId === currentUserId) {
          taskDetails = subOrder;
          parentOrder = order;
          console.log('调试信息 - 找到匹配的任务:', taskDetails);
          break;
        }
      }
      if (taskDetails) break;
    }

    if (!taskDetails) {
      console.error('调试错误 - 未找到任务或无访问权限');
      return NextResponse.json(
        { success: false, message: '未找到指定任务或无访问权限' },
        { status: 404 }
      );
    }
    
    console.log('调试信息 - 准备返回任务详情');
    
    // 返回子订单信息
    return NextResponse.json({
      success: true,
      data: taskDetails
    });
  } catch (error) {
    console.error('调试错误 - 获取任务详情时发生服务器异常:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 提交订单（事务性）
export async function POST(request: Request) {
  try {
    console.log('=== 开始处理订单提交请求 ===');
    
    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('调试: 接收到的认证令牌前20位:', token.substring(0, 20) + '...');
      
      const user = await validateTokenByRole(token, 'commenter');
      console.log('调试: 解析的用户信息:', user);
      
      if (user && user.role === 'commenter') {
        currentUserId = user.id;
        console.log('调试: 用户认证成功，用户ID:', currentUserId);
      } else {
        console.log('调试: 用户认证失败，无效的用户角色');
      }
    } else {
      console.log('调试: 未提供有效的认证令牌');
    }
    
    if (!currentUserId) {
      console.log('调试: 未授权访问，返回401错误');
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }

    const { taskId } = await request.json();
    console.log('调试: 接收到的任务ID:', taskId);
    
    if (!taskId) {
      console.log('调试: 任务ID为空，返回400错误');
      return NextResponse.json(
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }

    // 事务性操作 - 先验证所有数据，然后一次性更新
    let targetTask = null;
    let targetOrder = null;
    
    // 1. 查找任务并验证
    console.log('调试: 开始查找任务，当前数据中订单总数:', commentOrders.commentOrders ? commentOrders.commentOrders.length : 0);
    for (const order of commentOrders.commentOrders) {
      console.log('调试: 检查订单:', order.orderNumber, '包含子订单数:', order.subOrders.length);
      for (const subOrder of order.subOrders) {
        console.log('调试: 检查子订单:', subOrder.id, '评论员ID:', subOrder.commenterId);
        if (subOrder.id === taskId && subOrder.commenterId === currentUserId) {
          targetTask = subOrder;
          targetOrder = order;
          console.log('调试: 找到匹配的任务:', {
            taskId: targetTask.id,
            currentStatus: targetTask.status,
            hasScreenshot: !!targetTask.screenshotUrl,
            orderNumber: targetOrder.orderNumber
          });
          break;
        }
      }
      if (targetTask) break;
    }

    if (!targetTask) {
      console.log('调试: 未找到匹配的任务或无访问权限，返回404错误');
      return NextResponse.json(
        { success: false, message: '未找到指定任务或无访问权限' },
        { status: 404 }
      );
    }

    // 2. 验证任务状态
    console.log('调试: 任务状态验证，当前状态:', targetTask.status);
    // 支持'sub_progress'状态，符合后端JSON数据源中的实际状态值
    if (targetTask.status !== 'sub_progress') {
      console.log('调试: 任务状态验证失败，当前状态不是"进行中"(sub_progress)，返回400错误');
      return NextResponse.json(
        { success: false, message: `任务状态不允许提交，当前状态: ${targetTask.status}` },
        { status: 400 }
      );
    }

    // 3. 验证截图是否已上传
    console.log('调试: 截图验证，当前截图URL:', targetTask.screenshotUrl || '未上传');
    if (!targetTask.screenshotUrl) {
      console.log('调试: 截图验证失败，未上传截图，返回400错误');
      return NextResponse.json(
        { success: false, message: '请先上传截图' },
        { status: 400 }
      );
    }

    // 4. 执行更新操作
    console.log('调试: 开始更新任务状态，从"sub_progress"改为"sub_pending_review"');
    targetTask.status = 'sub_pending_review';
    targetTask.commentTime = new Date().toISOString();
    console.log('调试: 任务状态更新成功，更新后的任务信息:', {
      taskId: targetTask.id,
      newStatus: targetTask.status,
      commentTime: targetTask.commentTime,
      screenshotUrl: targetTask.screenshotUrl
    });
    
    // 如果所有子任务都已完成或待审核，更新父订单状态
    if (targetOrder) {
      const allSubOrdersCompleted = targetOrder.subOrders.every((sub: any) => 
        sub.status === 'completed' || sub.status === 'sub_pending_review'
      );
      console.log('调试: 检查父订单所有子任务状态，是否全部完成或待审核:', allSubOrdersCompleted);
      
      if (allSubOrdersCompleted) {
        console.log('调试: 所有子任务都已完成或待审核，更新父订单状态为"pending"');
        targetOrder.status = 'pending';
      }
    }

    // 5. 保存更新后的数据
    const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
    console.log('调试: 开始保存更新后的数据到文件:', filePath);
    fs.writeFileSync(filePath, JSON.stringify(commentOrders, null, 2), 'utf8');
    console.log('调试: 数据保存成功');

    console.log('=== 订单提交请求处理完成，处理成功 ===');
    return NextResponse.json({
      success: true,
      message: '订单提交成功，等待审核',
      data: targetTask
    });
  } catch (error) {
    console.log('=== 订单提交请求处理失败 ===');
    console.error('提交订单错误:', error instanceof Error ? error.message : String(error));
    console.error('错误堆栈:', error instanceof Error ? error.stack : '未知');
    return NextResponse.json(
      { 
        success: false, 
        message: '服务器内部错误',
        errorType: error instanceof Error ? error.name : 'UnknownError',
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}