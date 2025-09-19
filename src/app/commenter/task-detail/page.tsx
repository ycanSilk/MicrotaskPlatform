'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommenterAuthStorage } from '@/auth/commenter/auth';

// 定义任务接口（API返回的数据结构）
interface Task {
  id: string;
  parentId?: string;
  title: string;
  price: number;
  category: string;
  status: 'sub_pending_review' | 'sub_progress' | 'sub_completed' | 'waiting_collect';
  description: string;
  deadline?: string;
  progress?: number;
  submitTime?: string;
  completedTime?: string;
  requirements: string;
  publishTime: string;
  videoUrl?: string;
  mention?: string;
  taskType?: 'sub_task' | string;
}

// 定义增强后的任务详情接口（添加了显示需要的字段）
interface TaskDetail extends Task {
  commentContent?: string;
  screenshotUrl?: string;
  reviewNote?: string;
  orderNumber?: string;
  statusText?: string;
  statusColor?: string;
  recommendedComment?: string;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  
  // 添加调试日志
  console.log('调试信息 - 任务详情页面初始化:');
  console.log('当前URL:', typeof window !== 'undefined' ? window.location.href : '服务器端渲染');
  console.log('searchParams:', searchParams);
  console.log('获取的taskId:', taskId, '类型:', typeof taskId);
  
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // 状态转换映射
  const statusMap: Record<string, { text: string; color: string }> = {
    'sub_pending_review': { text: '待审核', color: 'bg-yellow-100 text-yellow-600' },
    'sub_progress': { text: '进行中', color: 'bg-blue-100 text-blue-600' },
    'sub_completed': { text: '已完成', color: 'bg-green-100 text-green-600' },
    'waiting_collect': { text: '待领取', color: 'bg-purple-100 text-purple-600' }
  };

  // 获取任务详情
  const fetchTaskDetail = async () => {
    console.log('===== 调试信息 - 开始获取任务详情 =====');
    console.log('当前时间戳:', new Date().toISOString());
    console.log('尝试获取的taskId:', taskId, '类型:', typeof taskId, '是否为空:', !taskId);
    
    if (!taskId) {
      console.error('❌ 调试错误 - 任务ID为空');
      setErrorMessage('任务ID不存在');
      console.log('===== 调试信息 - 获取任务详情结束 =====');
      return;
    }
    
    try {
      console.log('📋 调试信息 - 设置加载状态为true');
      setIsLoading(true);
      setErrorMessage(null);
      
      const token = localStorage.getItem('commenter_auth_token');
      console.log('🔑 调试信息 - 认证token存在:', !!token, 'token长度:', token ? token.length : 0);
      
      if (!token) {
        console.error('❌ 调试错误 - 未找到认证token');
        setErrorMessage('请先登录');
        setTimeout(() => router.push('/auth/login/commenterlogin'), 1000);
        console.log('===== 调试信息 - 获取任务详情结束 =====');
        return;
      }
      
      console.log('🚀 调试信息 - 准备请求API，URL:', `/api/commenter/task-detail?id=${taskId}`);
      console.log('📊 调试信息 - 请求头:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.substring(0, 10)}...` // 只显示部分token，保护安全
      });
      
      const startTime = performance.now();
      const response = await fetch(`/api/commenter/task-detail?id=${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const endTime = performance.now();
      
      console.log('✅ 调试信息 - API响应状态码:', response.status, '响应时间:', (endTime - startTime).toFixed(2), 'ms');
      console.log('📝 调试信息 - 响应头:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      });
      
      const result = await response.json();
      console.log('📦 调试信息 - API响应内容:', {
        success: result.success,
        hasData: !!result.data,
        message: result.message,
        dataKeys: result.data ? Object.keys(result.data) : []
      });
      
      if (result.success && result.data) {
        console.log('🎉 调试信息 - 获取任务详情成功，数据结构:');
        console.log('  - ID:', result.data.id);
        console.log('  - 状态:', result.data.status);
        console.log('  - 任务类型:', result.data.taskType);
        console.log('  - 评论员ID:', result.data.commenterId);
        console.log('  - 有截图URL:', !!result.data.screenshotUrl);
        
        // 添加状态文本和颜色转换
        const taskData = {
          ...result.data,
          statusText: statusMap[result.data.status]?.text || '未知状态',
          statusColor: statusMap[result.data.status]?.color || 'bg-gray-100 text-gray-600'
        };
        
        console.log('🔄 调试信息 - 转换后的数据:', {
          statusText: taskData.statusText,
          statusColor: taskData.statusColor
        });
        
        setTaskDetail(taskData);
      } else if (response.status === 401) {
        console.error('❌ 调试错误 - 认证失败 (401)');
        setErrorMessage('登录已过期，请重新登录');
        localStorage.removeItem('commenter_auth_token');
        localStorage.removeItem('commenter_user_info');
        localStorage.removeItem('commenter_auth_expires');
        setTimeout(() => router.push('/auth/login/commenterlogin'), 1500);
      } else {
        console.error('❌ 调试错误 - 获取任务详情失败:', {
          status: response.status,
          message: result.message || '未知错误'
        });
        setErrorMessage(result.message || '获取任务详情失败');
      }
    } catch (error) {
      console.error('💥 调试错误 - 获取任务详情时发生异常:', {
        type: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      console.log('🏁 调试信息 - 获取任务详情流程结束');
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取数据
  useEffect(() => {
    console.log('⚡ 调试信息 - 组件挂载或taskId变化，触发数据获取');
    fetchTaskDetail();
  }, [taskId]);
  
  // 返回任务列表
  const handleBack = () => {
    router.push('/commenter/tasks');
  };
  
  if (isLoading) {
    console.log('⏳ 调试信息 - 渲染加载状态界面');
    return (
      <div className="py-10 px-4">
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-500 rounded-full mb-4"></div>
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }
  
  if (errorMessage) {
    console.log('🚨 调试信息 - 渲染错误状态界面:', errorMessage);
    return (
      <div className="py-10 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleBack}
        >
          返回任务列表
        </button>
      </div>
    );
  }
  
  if (!taskDetail) {
    console.log('🔍 调试信息 - 任务详情数据为空');
    return (
      <div className="py-10 px-4">
        <div className="text-center py-12">
          <div className="text-gray-500">任务不存在</div>
        </div>
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mx-auto block"
          onClick={handleBack}
        >
          返回任务列表
        </button>
      </div>
    );
  }
  
  // 渲染任务详情界面
  console.log('📱 调试信息 - 渲染任务详情界面，数据完整');
  console.log('📊 调试信息 - 任务详情数据概览:', {
    taskId: taskDetail.id,
    taskType: taskDetail.taskType,
    status: taskDetail.status,
    hasCommentContent: !!taskDetail.commentContent,
    hasScreenshot: !!taskDetail.screenshotUrl,
    hasReviewNote: !!taskDetail.reviewNote
  });
  
  return (
    <div className="py-10 px-4">
      {/* 顶部返回按钮 */}
      <div className="mb-6">
        <button 
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          onClick={handleBack}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回任务列表
        </button>
      </div>
      
      {/* 任务详情卡片 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* 订单号和状态 */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm text-gray-500">
            订单号：{taskDetail.orderNumber || '无'}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${taskDetail.statusColor || 'bg-gray-100 text-gray-600'}`}>
            {taskDetail.statusText || '未知状态'}
          </span>
        </div>
        
        {/* 任务标题和价格 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{taskDetail.title || '未命名任务'}</h1>
          <div className="text-2xl font-bold text-orange-500">¥{(taskDetail.price || 0).toFixed(2)}</div>
        </div>
        
        {/* 任务要求 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">任务要求</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
            {taskDetail.requirements || '无特殊要求'}
          </div>
        </div>
        
        {/* 推荐评论 */}
        {taskDetail.recommendedComment && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">推荐评论</h3>
            <div className="bg-green-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
              {taskDetail.recommendedComment}
            </div>
          </div>
        )}
        
        {/* 任务描述 */}
        {taskDetail.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">任务描述</h3>
            <div className="text-gray-700 whitespace-pre-line">
              {taskDetail.description}
            </div>
          </div>
        )}
        
        {/* 评论内容 */}
        {taskDetail.commentContent && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">评论内容</h3>
            <div className="bg-blue-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
              {taskDetail.commentContent}
            </div>
          </div>
        )}
        
        {/* 截图 */}
        {taskDetail.screenshotUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">提交截图</h3>
            <div className="bg-gray-100 rounded-lg p-2">
              <img 
                src={taskDetail.screenshotUrl} 
                alt="任务完成截图" 
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-image.png';
                }}
              />
            </div>
          </div>
        )}
        
        {/* 审核备注 */}
        {taskDetail.reviewNote && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">审核备注</h3>
            <div className="bg-yellow-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
              {taskDetail.reviewNote}
            </div>
          </div>
        )}
        
        {/* 时间信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {taskDetail.publishTime && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">发布时间</div>
              <div className="text-gray-800">{taskDetail.publishTime}</div>
            </div>
          )}
          {taskDetail.deadline && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">截止时间</div>
              <div className="text-gray-800">{taskDetail.deadline}</div>
            </div>
          )}
          {taskDetail.submitTime && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">提交时间</div>
              <div className="text-gray-800">{taskDetail.submitTime}</div>
            </div>
          )}
          {taskDetail.completedTime && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">完成时间</div>
              <div className="text-gray-800">{taskDetail.completedTime}</div>
            </div>
          )}
        </div>
        
        {/* 底部操作按钮 */}
        <div className="flex justify-center">
          <button 
            className="bg-blue-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            onClick={handleBack}
          >
            返回任务列表
          </button>
        </div>
      </div>
      
      {/* 任务提示 */}
      <div className="mx-auto mt-6 max-w-md bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">任务小贴士</h4>
            <p className="text-sm text-blue-600">
              如有疑问，请联系客服。感谢您的努力工作！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}