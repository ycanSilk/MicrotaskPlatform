import { NextRequest, NextResponse } from 'next/server';
import { validateTokenByRole } from '@/auth/common';
import publisherUser from '../../../../data/publisheruser/publisheruser.json';
import accountBalance from '../../../../data/accountBalance/accountBalance.json';
import financialRecords from '../../../../data/financialRecords/financialRecords.json';
import fs from 'fs';
import path from 'path';

// 文件路径常量
const PUBLISHER_USER_PATH = path.join(process.cwd(), 'src/data/publisheruser/publisheruser.json');
const ACCOUNT_BALANCE_PATH = path.join(process.cwd(), 'src/data/accountBalance/accountBalance.json');
const FINANCIAL_RECORDS_PATH = path.join(process.cwd(), 'src/data/financialRecords/financialRecords.json');

// 获取用户余额信息
export async function GET(req: NextRequest) {
  try {
    // 验证用户认证token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: '未提供认证信息' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userInfo = await validateTokenByRole(token, 'publisher');
    
    if (!userInfo) {
      return NextResponse.json({ success: false, message: '无效的认证信息' }, { status: 401 });
    }

    const userId = userInfo.id;

    // 读取用户数据
    const publisherData = publisherUser.find(user => user.id === userId);
    const balanceData = accountBalance.userId === userId ? accountBalance : null;

    // 如果没有余额数据，创建默认数据
    let balance = {
      total: publisherData?.balance || 0,
      frozen: 0,
      available: publisherData?.balance || 0
    };

    if (balanceData) {
      balance = {
        total: balanceData.currentBalance,
        frozen: balanceData.frozenAmount,
        available: balanceData.availableBalance
      };
    }

    // 获取用户的交易记录
    const userTransactions = [];
    
    // 充值订单
    if (financialRecords.rechargeOrders) {
      financialRecords.rechargeOrders
        .filter(order => order.userId === userId)
        .forEach(order => {
          userTransactions.push({
            id: order.orderId,
            type: 'recharge',
            amount: order.amount,
            status: order.status === 'completed' ? 'success' : order.status,
            method: order.paymentMethod === 'alipay' ? '支付宝' : 'PayPal' || order.paymentMethod,
            time: order.completedTime ? new Date(order.completedTime).toLocaleString('zh-CN') : '',
            orderId: order.orderId
          });
        });
    }

    // 消费订单
    if (financialRecords.expenseOrders) {
      financialRecords.expenseOrders
        .filter(order => order.userId === userId)
        .forEach(order => {
          userTransactions.push({
            id: order.orderId,
            type: 'expense',
            amount: -order.amount,
            status: order.status === 'completed' ? 'success' : order.status,
            method: order.type === 'task_publish' ? '任务支付' : order.type,
            time: order.completedTime ? new Date(order.completedTime).toLocaleString('zh-CN') : '',
            orderId: order.orderId
          });
        });
    }

    // 提现订单
    if (financialRecords.withdrawalOrders) {
      financialRecords.withdrawalOrders
        .filter(order => order.userId === userId)
        .forEach(order => {
          userTransactions.push({
            id: order.orderId,
            type: 'withdraw',
            amount: -order.amount,
            status: order.status === 'completed' ? 'success' : order.status,
            method: order.withdrawalAccountType === 'alipay' ? '支付宝' : '提现',
            time: order.completedTime ? new Date(order.completedTime).toLocaleString('zh-CN') : '',
            orderId: order.orderId
          });
        });
    }

    // 按时间排序
    userTransactions.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return NextResponse.json({
      success: true,
      data: {
        balance,
        transactions: userTransactions.slice(0, 5) // 返回最近5条记录
      }
    }, { status: 200 });

  } catch (error) {
    console.error('获取财务数据失败:', error);
    return NextResponse.json({ success: false, message: '获取数据失败' }, { status: 500 });
  }
}

// 处理充值请求
export async function POST(req: NextRequest) {
  try {
    // 验证用户认证token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: '未提供认证信息' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userInfo = await validateTokenByRole(token, 'publisher');
    
    if (!userInfo) {
      return NextResponse.json({ success: false, message: '无效的认证信息' }, { status: 401 });
    }

    const userId = userInfo.id;
    const { amount, paymentMethod } = await req.json();

    // 验证金额
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: '请输入有效的充值金额' }, { status: 400 });
    }

    // 生成订单ID
    const orderId = `recharge${new Date().getTime()}`;
    const now = new Date().toISOString();

    // 更新publisher用户余额
    const publisherData = JSON.parse(fs.readFileSync(PUBLISHER_USER_PATH, 'utf8'));
    const userIndex = publisherData.findIndex((user: any) => user.id === userId);
    
    if (userIndex !== -1) {
      publisherData[userIndex].balance += amount;
      publisherData[userIndex].updatedAt = now;
      fs.writeFileSync(PUBLISHER_USER_PATH, JSON.stringify(publisherData, null, 2));
    }

    // 更新账户余额数据
    const balanceData = JSON.parse(fs.readFileSync(ACCOUNT_BALANCE_PATH, 'utf8'));
    if (balanceData.userId === userId) {
      balanceData.currentBalance += amount;
      balanceData.availableBalance += amount;
      balanceData.updatedAt = now;
      fs.writeFileSync(ACCOUNT_BALANCE_PATH, JSON.stringify(balanceData, null, 2));
    }

    // 添加充值记录到financialRecords
    const financialData = JSON.parse(fs.readFileSync(FINANCIAL_RECORDS_PATH, 'utf8'));
    const newRechargeOrder = {
      orderId,
      userId,
      userType: 'publisher',
      amount,
      currency: 'CNY',
      paymentMethod,
      transactionId: `trans${new Date().getTime()}`,
      status: 'completed',
      orderTime: now,
      paymentTime: now,
      completedTime: now,
      ipAddress: req.headers.get('x-forwarded-for') || req.ip || '',
      description: '账户充值'
    };

    if (!financialData.rechargeOrders) {
      financialData.rechargeOrders = [];
    }
    financialData.rechargeOrders.unshift(newRechargeOrder);
    fs.writeFileSync(FINANCIAL_RECORDS_PATH, JSON.stringify(financialData, null, 2));

    return NextResponse.json({
      success: true,
      message: `充值 ¥${amount} 成功！`,
      orderId
    }, { status: 200 });

  } catch (error) {
    console.error('充值失败:', error);
    return NextResponse.json({ success: false, message: '充值失败，请稍后重试' }, { status: 500 });
  }
}