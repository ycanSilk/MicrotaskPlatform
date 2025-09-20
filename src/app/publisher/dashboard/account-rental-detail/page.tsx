'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 定义子任务数据类型 - 租号任务特定
interface AccountRentalSubTask {
  id: string;
  parentId: string;
  status: 'sub_progress' | 'sub_completed' | 'sub_pending_review' | 'waiting_collect';
  commenterId: string;
  commenterName: string;
  commentTime: string;
  screenshotUrl: string;
  accountDetails?: {
    username: string;
    password: string;
    loginMethod: string;
  };
}

// 定义任务数据类型 - 租号任务特定
interface AccountRentalTask {
  id: string;
  orderNumber: string;
  videoUrl: string;
  mention: string;
  status: 'main_progress' | 'main_completed';
  quantity: number;
  completedQuantity: number;
  unitPrice: number;
  taskRequirements: string;
  publishTime: string;
  deadline: string;
  taskType: string;
  title: string;
  accountInfo: {
    platform: string;
    accountLevel: string;
    followerCount: string;
    requiresVerification: boolean;
    rentalDuration: string;
  };
  subOrders: AccountRentalSubTask[];
}

export default function AccountRentalDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<AccountRentalTask | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail(taskId);
    } else {
      setError('未提供任务ID');
      setLoading(false);
    }
  }, [taskId]);

  const fetchTaskDetail = async (id: string) => {
    try {
      setLoading(true);
      
      // 调用API获取任务详情
      const url = `/api/publisher/task-detail?taskId=${id}`;
      
      // 获取认证token（如果存在）
      let authToken = null;
      if (typeof window !== 'undefined') {
        try {
          authToken = localStorage.getItem('publisher_auth_token');
        } catch (e) {
          console.warn(`获取认证token时出错: ${e}`);
        }
      }
      
      // 构建请求选项
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        cache: 'no-store' as RequestCache
      };
      
      // 发送请求
      const response = await fetch(url, requestOptions);
      
      // 检查响应是否成功
      if (!response.ok) {
        const errorText = await response.text();
        setError(`API请求失败: ${response.status}`);
        return;
      }
      
      // 解析响应数据
      const result = await response.json();
      
      if (result.success && result.data.taskType === 'account_rental') {
        setTask(result.data);
      } else if (result.success && result.data.taskType !== 'account_rental') {
        setError('此任务不是租号任务');
      } else {
        setError(result.message || '获取任务详情失败');
      }
    } catch (err) {
      setError(`获取任务详情时发生错误: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubTaskAction = (subTaskId: string, action: string) => {
    alert(`对子任务 ${subTaskId} 执行 ${action} 操作`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">加载中...</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
          <div className="text-gray-500">正在加载任务详情...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">错误</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">任务未找到</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-yellow-700">未找到指定的任务</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 统计子任务状态
  const statusCounts = {
    completed: task.subOrders.filter(sub => sub.status === 'sub_completed').length,
    waitingCollect: task.subOrders.filter(sub => sub.status === 'waiting_collect').length,
    inReview: task.subOrders.filter(sub => sub.status === 'sub_pending_review').length,
    inProgress: task.subOrders.filter(sub => sub.status === 'sub_progress').length,
  };

  // 状态映射函数
  const getStatusText = (status: string) => {
    switch (status) {
      // 主任务状态
      case 'main_progress':
        return '进行中';
      case 'main_completed':
        return '已完成';
      // 子任务状态
      case 'sub_completed':
        return '已完成';
      case 'sub_progress':
        return '进行中';
      case 'waiting_collect':
        return '待领取';
      case 'sub_pending_review':
        return '待审核';
      default:
        return status;
    }
  };

  // 状态样式映射函数
  const getStatusStyle = (status: string) => {
    switch (status) {
      // 主任务状态
      case 'main_progress':
        return 'bg-blue-100 text-blue-800';
      case 'main_completed':
        return 'bg-green-100 text-green-800';
      // 子任务状态
      case 'sub_completed':
        return 'bg-green-100 text-green-800';
      case 'sub_progress':
        return 'bg-blue-100 text-blue-800';
      case 'waiting_collect':
        return 'bg-yellow-100 text-yellow-800';
      case 'sub_pending_review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 账号等级映射
  const getAccountLevelText = (level: string) => {
    const levelMap: Record<string, string> = {
      'level_1': '初级账号',
      'level_2': '中级账号',
      'level_3': '高级账号',
      'level_4': '专业账号',
      'level_5': '顶级账号'
    };
    return levelMap[level] || level;
  };

  // 登录方式映射
  const getLoginMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      'phone_verification': '手机验证登录',
      'password_only': '密码登录',
      'third_party': '第三方登录'
    };
    return methodMap[method] || method;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">租号任务详情</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 任务基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">任务编号</p>
              <p className="font-medium">{task.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">任务类型</p>
              <p className="font-medium">账号租用任务</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">单价</p>
              <p className="font-medium">¥{task.unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">总数量</p>
              <p className="font-medium">{task.quantity} 个账号</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="font-medium">{task.completedQuantity} 个</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">发布时间</p>
              <p className="font-medium">{new Date(task.publishTime).toLocaleString('zh-CN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">截止时间</p>
              <p className="font-medium">{new Date(task.deadline).toLocaleString('zh-CN')}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
                <p className="text-sm text-gray-600">视频链接</p>
                <a 
                  href={task.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {task.videoUrl || '暂无链接'}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">任务要求</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">{task.taskRequirements}</p>
                </div>
              </div>
          </div>
        </div>

        {/* 账号信息 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">账号信息</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">平台</p>
              <p className="font-medium">{task.accountInfo.platform}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">账号等级</p>
              <p className="font-medium">{getAccountLevelText(task.accountInfo.accountLevel)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">粉丝数量</p>
              <p className="font-medium">{task.accountInfo.followerCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">需要验证</p>
              <p className="font-medium">{task.accountInfo.requiresVerification ? '是' : '否'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">租用时长</p>
              <p className="font-medium">{task.accountInfo.rentalDuration}</p>
            </div>
          </div>
        </div>

        {/* 子任务统计 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">子任务统计</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-sm text-green-700">已完成</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
              <div className="text-sm text-blue-700">进行中</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.inReview}</div>
              <div className="text-sm text-orange-700">待审核</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.waitingCollect}</div>
              <div className="text-sm text-yellow-700">待领取</div>
            </div>
          </div>
        </div>

        {/* 子任务列表 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">子任务列表</h2>
          <div className="space-y-4">
            {task.subOrders.map((subTask) => (
              <div key={subTask.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">订单编号： {subTask.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(subTask.status)}`}>
                          {getStatusText(subTask.status)}
                        </span>
                      </div>
                  {subTask.status === 'sub_pending_review' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSubTaskAction(subTask.id, '通过')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleSubTaskAction(subTask.id, '驳回')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        驳回
                      </button>
                    </div>
                  )}
                </div>
                
                {subTask.commenterName ? (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">领取用户</p>
                      <p className="font-medium">{subTask.commenterName}</p>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">领取用户</p>
                      <p className="font-medium text-gray-400">暂无信息</p>
                    </div>
                  )}
                
                {subTask.accountDetails ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">账号详情</p>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <p className="text-gray-800">用户名: {subTask.accountDetails.username || '暂无'}</p>
                      <p className="text-gray-800">登录方式: {subTask.accountDetails.loginMethod ? getLoginMethodText(subTask.accountDetails.loginMethod) : '暂无'}</p>
                      {/* 出于安全考虑，不显示密码 */}
                      <p className="text-gray-800">密码: ************</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">账号详情</p>
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded flex items-center justify-center h-20">
                      <p className="text-gray-400">暂无账号详情</p>
                    </div>
                  </div>
                )}
                
                {subTask.commentTime ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">提交时间</p>
                    <p className="font-medium">{new Date(subTask.commentTime).toLocaleString('zh-CN')}</p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">提交时间</p>
                    <p className="font-medium text-gray-400">暂无信息</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">截图</p>
                  {subTask.screenshotUrl ? (
                    <div className="bg-gray-100 rounded flex items-center justify-center">
                      <img 
                        src={subTask.screenshotUrl} 
                        alt="操作截图" 
                        className="max-h-40 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-200 rounded flex items-center justify-center h-40">
                      <p className="text-gray-400">暂无截图</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}