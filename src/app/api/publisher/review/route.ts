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

export async function POST(request: Request) {
  try {
    const { orderId, action } = await request.json();
    
    console.log('Received review request:', { orderId, action });
    
    // 读取订单数据
    const orderData = getCommentOrders();
    
    console.log('Loaded order data, orders count:', orderData.orders.length);
    
    // 查找对应的子订单
    let subOrderFound = false;
    let parentOrderFound = false;
    
    for (const order of orderData.orders) {
      console.log('Checking order:', order.id);
      for (const subOrder of order.subOrders) {
        console.log('Checking subOrder:', subOrder.id);
        if (subOrder.id === orderId) {
          console.log('Found matching subOrder:', subOrder.id);
          subOrderFound = true;
          
          // 根据操作类型更新子订单状态
          if (action === 'approve') {
            subOrder.status = '已完成';
            console.log('Approved subOrder, new status:', subOrder.status);
          } else if (action === 'reject') {
            subOrder.status = '进行中';
            // 清除评论员信息以便重新抢单
            subOrder.commenterId = '';
            subOrder.commenterName = '';
            subOrder.commentContent = '';
            subOrder.commentTime = '';
            subOrder.screenshotUrl = '';
            console.log('Rejected subOrder, new status:', subOrder.status);
          }
          
          parentOrderFound = true;
          break;
        }
      }
      
      // 如果找到了订单，更新主订单的完成数量
      if (parentOrderFound) {
        console.log('Updating parent order completed quantity');
        order.completedQuantity = order.subOrders.filter((sub: any) => sub.status === '已完成').length;
        console.log('New completed quantity:', order.completedQuantity);
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