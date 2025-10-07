'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TransactionDetailTemplate, { TransactionDetail } from '../../../../components/page/transaction-etails/TransactionDetailTemplate';

// 原始页面保留数据获取和状态管理逻辑
// 但使用模板组件进行渲染
export default function TransactionDetailPage() {
  const params = useParams();
  const id = params?.id as string || '';
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
        // 这里可以添加一些自定义字段到transaction对象中
        const enhancedTransaction: TransactionDetail = {
          ...data.data,
          customFields: [
            {
              label: '数据来源',
              value: 'API接口',
              className: 'text-gray-700'
            },
            {
              label: '请求耗时',
              value: `${endTime - startTime}ms`
            }
          ]
        };
        setTransaction(enhancedTransaction);
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

  // 使用模板组件渲染页面
  return (
    <TransactionDetailTemplate
      transaction={transaction}
      loading={loading}
      showAlertModal={showAlertModal}
      alertConfig={alertConfig}
      onBack={handleBack}
      onAlertClose={handleAlertClose}
      title="交易详情"
      showAmountSection={true}
      showDetailsSection={true}
    />
  );
}