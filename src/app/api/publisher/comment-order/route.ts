import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 读取评论订单数据文件
const getCommentOrders = () => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
};

// 写入评论订单数据文件
const saveCommentOrders = (data: any) => {
  const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// 生成订单ID，使用时间戳确保唯一性
const generateOrderId = () => {
  const timestamp = Date.now();
  // 使用时间戳的后8位作为ID的一部分，确保唯一性
  const uniquePart = timestamp.toString().slice(-8);
  return `ord${uniquePart}`;
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
  for (let i = 1; i <= quantity; i++) {
    subOrders.push({
      id: `${parentId}${i.toString().padStart(3, '0')}`,
      parentId: parentId,
      status: "待领取",
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
    const url = new URL(request.url);
    
    // 支持两种参数格式
    const taskId = url.searchParams.get('taskId') || url.searchParams.get('taskType');
    const title = url.searchParams.get('title') || url.searchParams.get('taskTitle');
    const icon = url.searchParams.get('icon');
    const price = url.searchParams.get('price') || url.searchParams.get('taskPrice');
    const description = url.searchParams.get('description') || url.searchParams.get('requirements');
    const videoUrl = url.searchParams.get('videoUrl');
    // 处理mention参数，只支持单个mention
    const mention = url.searchParams.get('mention');
    const quantity = url.searchParams.get('quantity');
    const deadline = url.searchParams.get('deadline');

    // 验证必需参数
    if (!taskId || !title || !price || !description || !videoUrl || !quantity) {
      return NextResponse.json(
        { success: false, message: '缺少必要的参数' },
        { status: 400 }
      );
    }

    // 验证数量参数
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json(
        { success: false, message: '数量必须是正整数' },
        { status: 400 }
      );
    }

    // 验证价格参数
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, message: '价格必须是正数' },
        { status: 400 }
      );
    }

    // 读取现有订单数据
    const orderData = getCommentOrders();
    
    // 生成新的订单ID和订单号
    const newOrderId = generateOrderId();
    const newOrderNumber = generateOrderNumber();
    
    // 处理截止时间
    const processedDeadline = processDeadline(deadline);
    
    // 创建新的订单
    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      videoUrl: videoUrl,
      mention: mention,
      status: "已发布",
      quantity: quantityNum,
      completedQuantity: 0,
      unitPrice: priceNum,
      taskRequirements: description,
      publishTime: new Date().toISOString(),
      deadline: processedDeadline,
      subOrders: generateSubOrders(newOrderId, quantityNum)
    };

    // 添加新订单到订单列表
    orderData.orders.push(newOrder);

    // 保存更新后的订单数据
    saveCommentOrders(orderData);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '评论任务发布成功！',
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber
      }
    });

  } catch (error) {
    console.error('Comment order creation error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}