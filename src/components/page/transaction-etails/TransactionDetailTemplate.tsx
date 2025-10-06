'use client';

import React from 'react';
import AlertModal from '../../ui/AlertModal';

// 定义交易记录详情类型接口
export interface TransactionDetail {
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
  // 自定义字段配置
  customFields?: Array<{
    label: string;
    value: string | React.ReactNode;
    show?: boolean;
    className?: string;
  }>;
}

// 定义模板组件属性接口
export interface TransactionDetailTemplateProps {
  transaction: TransactionDetail | null;
  loading: boolean;
  showAlertModal: boolean;
  alertConfig: {
    title: string;
    message: string;
    icon: string;
  };
  onBack: () => void;
  onAlertClose: () => void;
  // 可选配置
  title?: string;
  cardClassName?: string;
  showAmountSection?: boolean;
  showDetailsSection?: boolean;
}

/**
 * 交易详情页面模板组件
 * 封装了交易详情页面的基础布局框架，可以根据配置动态展示交易信息
 */
const TransactionDetailTemplate: React.FC<TransactionDetailTemplateProps> = ({
  transaction,
  loading,
  showAlertModal,
  alertConfig,
  onBack,
  onAlertClose,
  title = '交易详情',
  cardClassName = '',
  showAmountSection = true,
  showDetailsSection = true
}) => {
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

  // 渲染加载状态
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // 渲染交易不存在状态
  if (!transaction) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
        <button 
          onClick={onBack} 
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
        <button 
          onClick={onBack} 
          className="py-2 px-5 rounded-full bg-blue-500 hover:bg-blue-700 transition-colors text-white w-fit mr-4"
        >
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* 交易详情卡片 */}
      <div className={`bg-white rounded-lg shadow-md overflow-hidden mb-6 ${cardClassName}`}>
        {/* 金额区域 */}
        {showAmountSection && (
          <div className="p-8 flex flex-col items-center justify-center border-b">
            <h2 className="text-lg text-gray-600 mb-2">{getTransactionTypeText(transaction.type)}</h2>
            <div className={`text-4xl font-bold ${getAmountColorClass(transaction.amount)}`}>
              {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount).toFixed(2)}
            </div>
            <div className={`mt-4 text-sm ${getStatusColorClass(transaction.status)}`}>
              {getStatusText(transaction.status)}
            </div>
          </div>
        )}

        {/* 详情信息区域 */}
        {showDetailsSection && (
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
              
              {/* 渲染自定义字段 */}
              {transaction.customFields && transaction.customFields.map((field, index) => {
                if (field.show === false) return null;
                
                return (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center pb-3 border-b ${field.className || ''}`}
                  >
                    <span className="text-gray-600">{field.label}</span>
                    {typeof field.value === 'string' ? (
                      <span className="font-medium">{field.value}</span>
                    ) : (
                      field.value
                    )}
                  </div>
                );
              })}
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
        onClose={onAlertClose}
      />
    </div>
  );
};

export default TransactionDetailTemplate;