import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateTokenByRole } from '@/auth/common';

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 写入评论订单数据文件 (事务方式)
const saveCommentOrders = (data: any) => {
  try {
    const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Comment orders saved successfully to', filePath);
    return true;
  } catch (error) {
    console.error('Failed to save comment orders:', error);
    return false;
  }
};

// 生成订单ID，使用用户ID和时间戳确保唯一性
const generateOrderId = (userId: string) => {
  const timestamp = Date.now();
  return `${userId}_${timestamp}`;
};

// 生成订单号
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DY${year}${month}${day}${random}`;
};

// 生成子订单
const generateSubOrders = (parentId: string, quantity: number) => {
  const subOrders = [];
  // 从现有数据中获取最大的子订单ID号
  const baseId = parentId.includes('_') ? parentId.split('_')[1] : parentId;
  
  for (let i = 1; i <= quantity; i++) {
    subOrders.push({
      id: `sub${baseId}${i.toString().padStart(3, '0')}`,
      orderNumber: `SUB${baseId}${i.toString().padStart(3, '0')}`, // 子订单唯一订单号
      parentId: parentId,
      status: "pending", // 使用英文状态值
      commenterId: "",
      commenterName: "",
      commentContent: "",
      commentTime: "",
      screenshotUrl: ""
    });
  }
  return subOrders;
};

// 处理截止时间参数
const processDeadline = (deadline: string | null) => {
  if (!deadline) {
    // 默认7天后截止
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  
  // 如果是数字，表示从现在开始的小时数
  if (!isNaN(Number(deadline))) {
    const hours = parseInt(deadline);
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  }
  
  // 尝试解析为日期字符串
  const date = new Date(deadline);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  
  // 默认7天后截止
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
};

export async function POST(request: Request) {
  try {
    console.log('=== Comment Order API Called ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // 从请求头中获取认证token并解析用户ID
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    console.log('Auth header:', authHeader);
    
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
        { status: 401 }
      );
    }
    
    console.log(`当前用户ID: ${currentUserId}`);
    
    // 从请求体中获取任务信息
    const requestBody = await request.json();
    console.log('Request body:', requestBody);
    
    // 支持两种参数格式
    const taskId = requestBody.taskId || requestBody.taskType;
    const title = requestBody.title || requestBody.taskTitle;
    const icon = requestBody.icon;
    const price = requestBody.price || requestBody.taskPrice;
    const description = requestBody.description || requestBody.requirements;
    const videoUrl = requestBody.videoUrl;
    // 处理mention参数，支持单个mention
    const mention = requestBody.mention || requestBody.mentions?.[0];
    const quantity = requestBody.quantity;
    const deadline = requestBody.deadline;

    // 验证必需参数
    console.log('验证参数:', { taskId, title, price, description, videoUrl, quantity });
    if (!taskId || !title || !price || !description || !videoUrl || !quantity) {
      console.log('缺少必要参数:', { taskId, title, price, description, videoUrl, quantity });
      return NextResponse.json(
        { success: false, message: '缺少必要的参数' },
        { status: 400 }
      );
    }

    // 验证数量参数
    const quantityNum = parseInt(quantity);
    console.log('数量参数:', { quantity, quantityNum, isNaN: isNaN(quantityNum) });
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json(
        { success: false, message: '数量必须是正整数' },
        { status: 400 }
      );
    }

    // 验证价格参数
    const priceNum = parseFloat(price);
    console.log('价格参数:', { price, priceNum, isNaN: isNaN(priceNum) });
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, message: '价格必须是正数' },
        { status: 400 }
      );
    }

    // 事务开始 - 读取现有订单数据
    console.log('读取现有订单数据...');
    const orderData = getCommentOrders();
    console.log('当前订单数量:', orderData.orders.length);
    
    // 生成新的订单ID和订单号
    const newOrderId = generateOrderId(currentUserId);
    const newOrderNumber = generateOrderNumber();
    console.log('生成新订单ID:', newOrderId, '订单号:', newOrderNumber);
    
    // 处理截止时间
    const processedDeadline = processDeadline(deadline);
    console.log('处理截止时间:', { deadline, processedDeadline });
    
    // 创建新的订单
    const newOrder = {
      id: newOrderId,
      // 使用从token中解析的用户ID
      userId: currentUserId,
      orderNumber: newOrderNumber,
      videoUrl: videoUrl,
      mention: mention,
      status: "in_progress", // 使用英文状态值
      quantity: quantityNum,
      completedQuantity: 0,
      unitPrice: priceNum,
      taskRequirements: description,
      publishTime: new Date().toISOString(),
      deadline: processedDeadline,
      subOrders: generateSubOrders(newOrderId, quantityNum)
    };
    
    console.log('创建新订单:', newOrder);

    // 添加新订单到订单列表
    orderData.orders.push(newOrder);
    console.log('添加订单后数量:', orderData.orders.length);

    // 事务处理 - 保存更新后的订单数据
    console.log('保存订单数据...');
    const saveResult = saveCommentOrders(orderData);
    
    if (saveResult) {
      console.log('事务完成: 订单数据保存成功');
      // 返回成功响应
      return NextResponse.json({
        success: true,
        message: '评论任务发布成功！',
        order: {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber
        }
      });
    } else {
      console.error('事务失败: 订单数据保存失败');
      // 返回错误响应
      return NextResponse.json(
        { success: false, message: '任务发布失败，请稍后重试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Comment order creation error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
