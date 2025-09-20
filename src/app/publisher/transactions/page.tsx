'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlertModal from '../../../components/ui/AlertModal';

// 定义交易记录类型接口
export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  method: string;
  time: string;
  orderId: string;
  description: string;
}

export default function PublisherTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 10;

  // 通用提示框状态
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
      if (decodedToken.exp && decodedToken.exp < Date.now()) {
        localStorage.removeItem('publisher_auth_token');
        return null;
      }
      
      return decodedToken;
    } catch (error) {
      console.error('解析token失败:', error);
      return null;
    }
  };

  // 获取交易记录数据
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // 从token中获取用户信息
      const userInfo = getUserInfoFromToken();
      
      // 如果没有用户信息，提示登录
      if (!userInfo) {
        showAlert('提示', '请先登录', '💡');
        return;
      }
      
      // 从localStorage获取token
      const token = localStorage.getItem('publisher_auth_token');
      
      if (!token) {
        showAlert('提示', '请先登录', '💡');
        return;
      }

      // 请求交易记录数据
      const response = await fetch('/api/publisher/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setTransactions(data.data);
        setTotalPages(Math.ceil(data.data.length / recordsPerPage));
        setCurrentPage(1); // 重置为第一页
      } else {
        showAlert('获取失败', '无法获取交易记录', '❌');
      }
    } catch (error) {
      console.error('获取交易记录失败:', error);
      showAlert('获取失败', '网络错误，请稍后重试', '❌');
    } finally {
      setLoading(false);
    }
  };

  // 检查是否已登录并获取交易记录
  useEffect(() => {
    const userInfo = getUserInfoFromToken();
    if (!userInfo && process.env.NODE_ENV !== 'development') {
      showAlert('提示', '请先登录', '💡');
    } else {
      fetchTransactions();
    }
  }, []);

  // 计算当前页显示的交易记录
  const getCurrentTransactions = () => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return transactions.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  // 获取交易类型图标
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return '💸';
      case 'expense':
        return '💰';
      default:
        return '📝';
    }
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

  // 获取状态颜色类
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'success':
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
    return amount > 0 ? 'text-green-500' : 'text-red-500';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '成功';
      case 'pending':
        return '处理中';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 顶部导航和标题 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBack} 
            className="py-2 px-5 rounded-full bg-blue-500 hover:bg-blue-700 transition-colors text-white"
          >
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-gray-800">交易记录</h1>
        </div>
      </div>

      {/* 交易记录列表 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm text-gray-600 border-b">
          <div className="col-span-1">类型</div>
          <div className="col-span-2">描述</div>
          <div className="col-span-1">支付方式</div>
          <div className="col-span-1">金额</div>
          <div className="col-span-1">状态</div>
        </div>

        {/* 交易记录内容 */}
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无交易记录</div>
        ) : (
          <div>
            {getCurrentTransactions().map((transaction) => (
              <div 
                key={transaction.id} 
                className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50 transition-colors text-sm"
              >
                <div className="col-span-1 flex items-center space-x-2">
                  <span className="text-xl">{getTransactionIcon(transaction.type)}</span>
                  <span>{getTransactionTypeText(transaction.type)}</span>
                </div>
                <div className="col-span-2">
                  <div className="font-medium">{transaction.description || transaction.orderId}</div>
                  <div className="text-xs text-gray-400 mt-1">{transaction.time}</div>
                </div>
                <div className="col-span-1">{transaction.method}</div>
                <div className={`col-span-1 font-medium ${getAmountColorClass(transaction.amount)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} 元
                </div>
                <div className={`col-span-1 ${getStatusColorClass(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页控制 */}
        {transactions.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-500">
              共 {transactions.length} 条记录，当前第 {currentPage}/{totalPages} 页
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-500 border-blue-200 hover:bg-blue-50'}`}
              >
                上一页
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-500 border-blue-200 hover:bg-blue-50'}`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
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