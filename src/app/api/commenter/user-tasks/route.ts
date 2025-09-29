import { NextResponse } from 'next/server';
import { validateTokenByRole } from '@/auth/common';
import commentOrders from '@/data/commentOrder/commentOrder.json';


// 获取当前登录用户的订单
export async function GET(request: Request) {
  try {
    // 从请求头中获取认证token并验证用户身份
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    let currentUserRole = null;
    let currentUser = null;
    
    console.log('API调试: 请求头中的authHeader:', authHeader ? '存在' : '不存在');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
      console.log('API调试: 提取的token前20位:', token.substring(0, 20) + '...');
      
      // 使用认证系统的验证函数来解析token
      currentUser = await validateTokenByRole(token, 'commenter');
      console.log('解析token结果:', currentUser);
      
      if (currentUser && currentUser.role === 'commenter') {
        currentUserId = currentUser.id;
        currentUserRole = currentUser.role;
        console.log('API调试: 成功验证用户:', currentUserId, currentUserRole, currentUser.username);
      }
    }
    
    // 如果没有有效的用户ID，返回错误
    if (!currentUserId) {
      console.log('未找到有效的用户ID，返回401错误');
      return NextResponse.json(
        { success: false, message: '未授权或无效的令牌' },
        { status: 401 }
      );
    }

    // 查找当前用户相关的所有子订单
    const userTasks: any[] = [];
    
    console.log('API调试: 开始处理订单数据，总订单数:', commentOrders.commentOrders ? commentOrders.commentOrders.length : '未定义');
    console.log('API调试: 当前用户ID:', currentUserId, '角色:', currentUserRole);
    console.log('API调试: commentOrders对象类型:', typeof commentOrders);
    console.log('API调试: commentOrders是否有commentOrders属性:', 'commentOrders' in commentOrders);
    
    try {
        if (commentOrders && Array.isArray(commentOrders.commentOrders)) {
          console.log('API调试: commentOrders数组验证通过，包含', commentOrders.commentOrders.length, '个订单');
        
        commentOrders.commentOrders.forEach(order => {
          console.log('API调试: 处理订单:', order?.orderNumber || '未知', '订单类型:', typeof order);
          
          if (order && Array.isArray(order.subOrders)) {
            console.log('API调试: 订单', order.orderNumber, '包含', order.subOrders.length, '个子订单');
            
            order.subOrders.forEach((subOrder: any) => {
              console.log('API调试: 检查子订单:', subOrder?.id || '未知', 'commenterId:', subOrder?.commenterId || '未知');
              
              // 严格只处理子订单，确保符合业务规则
              // 只获取当前用户的子订单
              if (subOrder && subOrder.commenterId === currentUserId && subOrder.id && subOrder.id.startsWith('sub')) {
                // 计算进度百分比
                const progress = Math.round((order.completedQuantity / order.quantity) * 100);
                
                // 计算剩余时间（如果是进行中的任务）
                let remainingTime = '';
                if (subOrder.status === 'sub_progress' && order.deadline) {
                  const now = new Date();
                  const deadline = new Date(order.deadline);
                  const diffMs = deadline.getTime() - now.getTime();
                  
                  if (diffMs > 0) {
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    
                    if (diffDays > 0) {
                      remainingTime = `${diffDays}天${diffHours}小时`;
                    } else if (diffHours > 0) {
                      remainingTime = `${diffHours}小时${diffMinutes}分钟`;
                    } else {
                      remainingTime = `${diffMinutes}分钟`;
                    }
                  }
                }
                
                // 构建任务对象，匹配前端需要的格式
                const task = {
                  id: subOrder.id,
                  parentId: subOrder.parentId,
                  title: `评论任务 #${order.orderNumber}`,
                  price: subOrder.unitPrice || order.unitPrice,
                  unitPrice: subOrder.unitPrice || order.unitPrice,
                  // 确保状态命名统一使用'in_progress'标准
                  status: getTaskStatus(subOrder.status),
                  statusText: getStatusText(subOrder.status),
                  statusColor: getStatusColor(subOrder.status),
                  description: getDescription(subOrder.status, remainingTime),
                  requirements: order.taskRequirements,
                  publishTime: order.publishTime,
                  deadline: order.deadline,
                  progress: subOrder.status === 'sub_progress' ? progress : undefined,
                  submitTime: subOrder.commentTime || '',
                  completedTime: subOrder.status === 'sub_completed' ? subOrder.commentTime : '',
                  reviewNote: '', // 可以从数据中获取审核备注
                  videoUrl: order.videoUrl,
                  screenshotUrl: subOrder.screenshotUrl || '',
                  // 添加子订单自己的订单号字段
                  subOrderNumber: subOrder.orderNumber || '',
                  // 从主订单获取taskType和recommendedComment
                  taskType: order.taskType || 'comment',
                  recommendedComment: (order as any).recommendedComment || ''
                };
                
                userTasks.push(task);
                console.log('API调试: 已添加任务:', task.id, '状态:', task.status);
              }
            });
          } else {
            console.log('API调试: 订单', order?.orderNumber || '未知', '的subOrders不是数组或不存在');
          }
        });
      } else {
        console.log('API调试: commentOrders.commentOrders不是数组或不存在');
      }
    } catch (processError) {
      console.error('API调试: 处理订单数据时出错:', processError instanceof Error ? processError.message : String(processError));
      console.error('API调试: 处理订单数据错误堆栈:', processError instanceof Error ? processError.stack : '未知');
    }

    console.log('API调试: 订单数据处理完成，找到', userTasks.length, '个任务');
    
    // 记录任务是否包含推荐评论
    if (userTasks.length > 0) {
      console.log('API调试: 第一个任务是否包含推荐评论:', 'recommendedComment' in userTasks[0], 
                  userTasks[0].recommendedComment ? '内容: ' + userTasks[0].recommendedComment.substring(0, 20) + '...' : '无');
    }
    
    return NextResponse.json({
      success: true,
      data: userTasks,
      message: '获取用户订单成功',
      taskCount: userTasks.length
    });
  } catch (error) {
    console.error('获取用户订单错误 - 错误类型:', typeof error);
    console.error('获取用户订单错误 - 错误对象:', error);
    console.error('获取用户订单错误 - 错误详情:', error instanceof Error ? error.message : String(error));
    console.error('获取用户订单错误 - 堆栈:', error instanceof Error ? error.stack : '未知堆栈');
    return NextResponse.json(
      {
        success: false,
        message: '服务器内部错误',
        errorType: typeof error,
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 辅助函数：保持后端状态名称不变，直接传递给前端
function getTaskStatus(backendStatus: string): string {
  // 确保只返回有效的状态名称
  const validStatuses = ['sub_progress', 'sub_pending_review', 'sub_completed', 'waiting_collect'];
  return validStatuses.includes(backendStatus) ? backendStatus : 'sub_pending_review';
}

// 辅助函数：获取状态文本
function getStatusText(backendStatus: string): string {
  switch (backendStatus) {
    case 'sub_progress':
    case 'main_progress':
      return '进行中';
    case 'sub_pending_review':
      return '待审核';
    case 'sub_completed':
    case 'main_completed':
      return '已完成';
    case 'waiting_collect':
      return '待领取';
    default:
      return '未知状态';
  }
}

// 辅助函数：获取状态颜色
function getStatusColor(backendStatus: string): string {
  switch (backendStatus) {
    case 'sub_progress':
    case 'main_progress':
      return 'bg-blue-100 text-blue-600';
    case 'sub_pending_review':
      return 'bg-orange-100 text-orange-600';
    case 'sub_completed':
    case 'main_completed':
      return 'bg-green-100 text-green-600';
    case 'waiting_collect':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

// 辅助函数：获取任务描述
function getDescription(backendStatus: string, remainingTime: string): string {
  switch (backendStatus) {
    case 'sub_progress':
    case 'main_progress':
      return `剩余时间: ${remainingTime}`;
    case 'sub_pending_review':
      return '已提交，等待审核';
    case 'sub_completed':
    case 'main_completed':
      return '任务已完成并获得奖励';
    case 'waiting_collect':
      return '任务待领取';
    default:
      return '';
  }
}