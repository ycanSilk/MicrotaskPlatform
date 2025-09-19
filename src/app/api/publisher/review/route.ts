import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 读取评论订单数据文件
const getCommentOrders = () => {
  try {
    const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
    console.log('Reading file from path:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('File read successfully, parsing JSON');
    const parsedData = JSON.parse(fileContents);
    console.log('JSON parsed successfully');
    return parsedData;
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    throw error;
  }
};

// 写入评论订单数据文件
const writeCommentOrders = (data: any) => {
  try {
    const filePath = path.join(process.cwd(), 'src/data/commentOrder/commentOrder.json');
    console.log('Writing file to path:', filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('File written successfully');
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
};

// 检查并更新主订单状态
const updateParentOrderStatus = (parentOrder: any) => {
  // 检查所有子订单是否都已完成
  const allSubOrdersCompleted = parentOrder.subOrders.every((sub: any) => sub.status === 'sub_completed');
  
  // 如果所有子订单都已完成，将主订单状态设为已完成
  if (allSubOrdersCompleted && parentOrder.status !== 'main_completed') {
    parentOrder.status = 'main_completed';
    console.log('主订单所有子订单已完成，更新主订单状态为已完成');
  }
  
  // 更新完成数量
  const completedCount = parentOrder.subOrders.filter((sub: any) => sub.status === 'sub_completed').length;
  parentOrder.completedQuantity = completedCount;
  console.log('更新主订单完成数量:', completedCount);
}

export async function POST(request: Request) {
  try {
    const { orderId, action } = await request.json();
    
    console.log('Received review request:', { orderId, action });
    
    // 读取订单数据
    const orderData = getCommentOrders();
    
    console.log('Loaded order data, orders count:', orderData.commentOrders.length);
    
    // 查找对应的子订单
    let subOrderFound = false;
    let parentOrderFound = false;
    let parentOrder = null;
    let subOrder = null;
    
    for (const order of orderData.commentOrders) {
      console.log('Checking order:', order.id);
      for (const sub of order.subOrders) {
        console.log('Checking subOrder:', sub.id);
        if (sub.id === orderId) {
          console.log('Found matching subOrder:', sub.id);
          subOrderFound = true;
          parentOrder = order;
          subOrder = sub;
          
          // 检查子订单状态，防止对已完成订单的重复审核
          if (sub.status === 'sub_completed') {
            console.log('SubOrder is already completed, cannot review again');
            return NextResponse.json(
              { success: false, message: '该订单已完成，无法再次审核' },
              { status: 400 }
            );
          }
          
          // 根据操作类型更新子订单状态
          if (action === 'approve') {
            sub.status = 'sub_completed';
            console.log('Approved subOrder, new status:', sub.status);
          } else if (action === 'reject') {
            sub.status = 'waiting_collect';
            // 清除评论员信息以便重新抢单
            sub.commenterId = '';
            sub.commenterName = '';
            sub.commentContent = '';
            sub.commentTime = '';
            sub.screenshotUrl = '';
            console.log('Rejected subOrder, new status:', sub.status);
          }
          
          parentOrderFound = true;
          break;
        }
      }
      
      // 如果找到了订单，更新主订单的完成数量和状态
      if (parentOrderFound) {
        console.log('Updating parent order completed quantity and status');
        updateParentOrderStatus(parentOrder);
        console.log('Parent order subOrders status breakdown:');
        parentOrder.subOrders.forEach((sub: any) => {
          console.log(`  ${sub.id}: ${sub.status}`);
        });
        break;
      }
    }
    
    if (!subOrderFound) {
      console.log('SubOrder not found:', orderId);
      return NextResponse.json(
        { success: false, message: '未找到指定的订单' },
        { status: 404 }
      );
    }
    
    // 写入更新后的数据
    console.log('Writing updated order data');
    writeCommentOrders(orderData);
    
    console.log('Review completed successfully');
    return NextResponse.json({
      success: true,
      message: action === 'approve' ? '订单已通过审核' : '订单已驳回'
    });
  } catch (error) {
    console.error('Review order error:', error);
    return NextResponse.json(
      { success: false, message: '审核订单失败' },
      { status: 500 }
    );
  }
}