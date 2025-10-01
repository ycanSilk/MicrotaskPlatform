'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '../../../../components/ui/AlertModal';


// 定义交易记录详情类型接口
interface TransactionDetail {
  id: string;
  type: string;
  amount: number;
  status: string;
  method: string;
  time: string;
  orderId: string;
  description: string;
  // 额外的详情字段
  transactionId?: string;
  paymentMethod?: string;
  currency?: string;
  ipAddress?: string;
  orderTime?: string;
  completedTime?: string;
  relatedId?: string;
  expenseType?: string;
}

export default function TransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });

  // 显示通用提示框
  const showAlert = (title: string, message: string, icon: string) => {
    setAlertConfig({ title, message, icon });
    setShowAlertModal(true);
  };

  // 处理提示框关闭
  const handleAlertClose = () => {
    setShowAlertModal(false);
  };

  // 从token中获取用户信息
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem('publisher_auth_token');
      
      if (!token) {
        return null;
      }
      
      const decodedToken = JSON.parse(atob(token));
      
      // 验证token是否过期
      if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('publisher_auth_token');
        return null;
      }
      
      return decodedToken;
    } catch (error) {
      console.error('解析token失败:', error);
      return null;
    }
  };

  // 获取交易详情
  const fetchTransactionDetail = async () => {
    console.log('===== 开始获取交易详情 =====');
    console.log('请求的交易ID:', id);
    
    try {
      setLoading(true);
      console.log('设置加载状态为true');
      
      // 从token中获取用户信息
      console.log('尝试从token中获取用户信息');
      const userInfo = getUserInfoFromToken();
      console.log('获取到的用户信息:', userInfo);
      
      // 如果没有用户信息，提示登录
      if (!userInfo) {
        console.log('未获取到用户信息，提示登录');
        showAlert('提示', '请先登录', '💡');
        return;
      }
      
      // 从localStorage获取token
      console.log('尝试从localStorage获取token');
      const token = localStorage.getItem('publisher_auth_token');
      console.log('token获取状态:', !!token ? '成功获取token' : '未获取到token');
      
      if (!token) {
        console.log('未获取到token，提示登录');
        showAlert('提示', '请先登录', '💡');
        return;
      }

      // 请求交易详情数据
      console.log('开始发送API请求获取交易详情');
      console.log('请求URL:', `/api/publisher/transactions/detail?id=${id}`);
      console.log('请求使用的token前缀:', token.substring(0, 20) + '...'); // 只在日志中显示token的前20个字符
      
      const startTime = Date.now();
      const response = await fetch(`/api/publisher/transactions/detail?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // 发送完整的token用于认证
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      const endTime = Date.now();
      
      console.log(`API请求完成，耗时: ${endTime - startTime}ms`);
      console.log('响应状态码:', response.status);
      console.log('响应状态文本:', response.statusText);

      const data = await response.json();
      console.log('API响应数据:', data);
      
      if (data.success && data.data) {
        console.log('交易详情获取成功，设置交易数据');
        setTransaction(data.data);
      } else {
        console.log('交易详情获取失败:', data.message || '未知错误');
        showAlert('获取失败', data.message || '无法获取交易详情', '❌');
      }
    } catch (error) {
      console.error('获取交易详情发生异常:', error);
      showAlert('获取失败', '网络错误，请稍后重试', '❌');
    } finally {
      console.log('设置加载状态为false');
      setLoading(false);
      console.log('===== 获取交易详情流程结束 =====');
    }
  };

  // 组件挂载时获取交易详情
  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  // 获取交易类型文本
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'recharge':
        return '充值';
      case 'expense':
        return '支出';
      default:
        return type;
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return '成功';
      case 'pending':
        return '处理中';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  // 获取状态颜色类
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // 获取金额颜色类
  const getAmountColorClass = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
        <button 
          onClick={handleBack} 
          className="py-2 px-5 rounded-full bg-blue-500 hover:bg-blue-700 transition-colors text-white w-fit mb-8"
        >
          ← 返回
        </button>
        <div className="text-gray-500 text-center">交易记录不存在</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* 顶部导航和标题 */}
      <div className="flex items-center mb-8">

        <h1 className="text-xl font-bold text-gray-800">交易详情</h1>
      </div>

      {/* 交易详情卡片 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* 金额区域 */}
        <div className="p-8 flex flex-col items-center justify-center border-b">
          <h2 className="text-lg text-gray-600 mb-2">{getTransactionTypeText(transaction.type)}</h2>
          <div className={`text-4xl font-bold ${getAmountColorClass(transaction.amount)}`}>
            {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount).toFixed(2)}
          </div>
          <div className={`mt-4 text-sm ${getStatusColorClass(transaction.status)}`}>
            {getStatusText(transaction.status)}
          </div>
        </div>

        {/* 详情信息区域 */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">交易信息</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">交易时间</span>
              <span className="font-medium">{transaction.time || transaction.completedTime || '未知'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">交易类型</span>
              <span className="font-medium">{getTransactionTypeText(transaction.type)}</span>
            </div>
            
            {transaction.method === 'alipay' && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">支付方式</span>
                <div className="flex flex-col items-end">
                  <span className="font-medium mb-2">支付宝</span>
                  {/* 使用静态图片代替真实二维码链接 */}
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                    <span className="text-gray-500">支付宝二维码</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">交易状态</span>
              <span className={`font-medium ${getStatusColorClass(transaction.status)}`}>
                {getStatusText(transaction.status)}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">订单编号</span>
              <span className="font-medium text-gray-800">{transaction.orderId}</span>
            </div>
            
            {transaction.transactionId && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">交易编号</span>
                <span className="font-medium text-gray-800">{transaction.transactionId}</span>
              </div>
            )}
            
            {transaction.description && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">交易描述</span>
                <span className="font-medium">{transaction.description}</span>
              </div>
            )}
            
            {transaction.expenseType && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">消费类型</span>
                <span className="font-medium">
                  {transaction.expenseType === 'task_publish' ? '任务发布' : transaction.expenseType}
                </span>
              </div>
            )}
            
            {transaction.relatedId && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">关联ID</span>
                <span className="font-medium text-gray-800">{transaction.relatedId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={handleAlertClose}
      />
    </div>
  );
}