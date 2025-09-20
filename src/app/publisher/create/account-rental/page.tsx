'use client';

import { Button, Input, AlertModal } from '@/components/ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublisherAuthStorage } from '@/auth';

// 模拟账号数据
const AVAILABLE_ACCOUNTS = [
  {
    id: 'acc001',
    type: '普通用户',
    followers: '5000+',
    engagement: '3.2%',
    rating: 4.8,
    description: '适合日常内容推广',
    avatar: '👤',
    available: true
  },
  {
    id: 'acc002',
    type: '达人账号',
    followers: '50000+',
    engagement: '4.5%',
    rating: 4.9,
    description: '适合产品推荐和推广',
    avatar: '⭐',
    available: true
  },
  {
    id: 'acc003',
    type: '专业领域账号',
    followers: '20000+',
    engagement: '5.7%',
    rating: 4.7,
    description: '特定领域内容推广',
    avatar: '💼',
    available: true
  }
];

export default function AccountRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数获取任务信息
  const taskId = searchParams.get('taskId');
  const taskTitle = searchParams.get('title') || '真人号出租';
  const taskIcon = searchParams.get('icon') || '🔑';
  const basePrice = parseFloat(searchParams.get('price') || '50');
  const taskDescription = searchParams.get('description') || '提供真实用户账号租赁服务，支持自定义租赁时间';
  
  const [formData, setFormData] = useState({
    selectedAccount: '',
    rentalDays: 1,
    usagePurpose: '',
    specificRequirements: '',
    contactInfo: ''
  });

  const [isPublishing, setIsPublishing] = useState(false);

  // 通用提示框状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: ''
  });

  // 计算总费用
  const totalCost = (basePrice * formData.rentalDays).toFixed(2);

  // 显示通用提示框
  const showAlert = (title: string, message: string, icon: string) => {
    setAlertConfig({ title, message, icon });
    setShowAlertModal(true);
  };

  // 提交租赁订单
  const handleSubmitRental = async () => {
    // 表单验证
    if (!formData.selectedAccount) {
      showAlert('输入错误', '请选择要租赁的账号', '⚠️');
      return;
    }
    
    if (!formData.usagePurpose || formData.usagePurpose.trim().length < 10) {
      showAlert('输入错误', '请输入使用目的，至少10个字符', '⚠️');
      return;
    }
    
    if (formData.rentalDays < 1) {
      showAlert('输入错误', '租赁天数必须大于0', '⚠️');
      return;
    }

    // 显示加载状态
    setIsPublishing(true);
    console.log('开始提交租赁订单...');
    console.log('表单数据:', formData);
    console.log('任务ID:', taskId);

    try {
      // 使用PublisherAuthStorage获取认证token和用户信息
      const auth = PublisherAuthStorage.getAuth();
      const token = auth?.token;
      const userInfo = PublisherAuthStorage.getCurrentUser();
      
      console.log('[账号租赁] 认证信息:', { token: token ? '存在' : '不存在', userInfo });
      
      if (!token || !userInfo) {
        console.log('[账号租赁] 认证失败: 用户未登录或会话已过期');
        showAlert('认证失败', '用户未登录，请重新登录', '❌');
        router.push('/publisher/login' as any);
        return;
      }

      // 构建API请求体
      const requestBody = {
        taskId: taskId || '',
        taskTitle,
        basePrice: basePrice,
        rentalDays: formData.rentalDays,
        selectedAccount: formData.selectedAccount,
        usagePurpose: formData.usagePurpose,
        specificRequirements: formData.specificRequirements,
        contactInfo: formData.contactInfo,
        totalCost: parseFloat(totalCost)
      };

      console.log('API请求体:', requestBody);
      
      // 调用API提交租赁订单
      const response = await fetch('/api/publisher/account-rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('API响应状态:', response.status);

      const result = await response.json();
      console.log('API响应结果:', result);
      
      if (result.success) {
        showAlert('提交成功', `账号租赁订单提交成功！订单号：${result.order?.orderNumber || ''}`, '✅');
        setTimeout(() => {
          router.push('/publisher/dashboard');
        }, 1500);
      } else {
        showAlert('提交失败', `账号租赁订单提交失败: ${result.message || '未知错误'}`, '❌');
      }
    } catch (error) {
      console.error('提交租赁订单时发生错误:', error);
      showAlert('网络错误', '提交租赁订单时发生错误，请稍后重试', '❌');
    } finally {
      setIsPublishing(false);
    }
  };

  // 获取选中的账号信息
  const getSelectedAccountInfo = () => {
    return AVAILABLE_ACCOUNTS.find(acc => acc.id === formData.selectedAccount);
  };

  // 如果没有找到任务类型，返回错误页面
  if (!taskId || taskId !== 'account_rental') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-lg font-medium text-gray-800 mb-2">任务信息不完整</div>
          <Button 
            onClick={() => router.push('/publisher/create')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回选择任务
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex mb-4 items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 w-20 hover:shadow-md transition-all">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-full h-full text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
          >
            ← 返回
          </button>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <h1 className="text-xl font-bold">发布{taskTitle}</h1>
        </div>
        
        {/* 任务信息展示 */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-xl">
              {taskIcon}
            </div>
            <div>
              <h3 className="font-bold text-white">{taskTitle}</h3>
              <p className="text-blue-100 text-sm">单价: ¥{basePrice}/天</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm">{taskDescription}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 账号选择 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择账号 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {AVAILABLE_ACCOUNTS.map(account => (
              <div 
                key={account.id}
                onClick={() => setFormData({...formData, selectedAccount: account.id})}
                className={`p-3 border rounded-xl cursor-pointer transition-all ${formData.selectedAccount === account.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {account.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{account.type}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-gray-500 text-sm">粉丝: {account.followers}</span>
                        <span className="text-gray-500 text-sm">互动率: {account.engagement}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{account.rating}</span>
                    </div>
                    {formData.selectedAccount === account.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{account.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 租赁时长 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            租赁时长（天）
          </label>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setFormData({...formData, rentalDays: Math.max(1, formData.rentalDays - 1)})}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
            >
              -
            </button>
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                value={formData.rentalDays.toString()}
                onChange={(e) => setFormData({...formData, rentalDays: Math.max(1, parseInt(e.target.value) || 1)})}
                className="w-full text-2xl font-bold text-gray-900 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setFormData({...formData, rentalDays: formData.rentalDays + 1})}
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg font-bold transition-colors"
            >
              +
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            单价: ¥{basePrice}/天，可自定义租赁时间
          </div>
        </div>

        {/* 使用目的 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            使用目的 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="请详细描述账号使用目的和内容方向..."
            value={formData.usagePurpose}
            onChange={(e) => setFormData({...formData, usagePurpose: e.target.value})}
          />
        </div>

        {/* 特定要求 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            特定要求
          </label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            placeholder="如有特殊内容要求或注意事项，请在此说明..."
            value={formData.specificRequirements}
            onChange={(e) => setFormData({...formData, specificRequirements: e.target.value})}
          />
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            联系方式
          </label>
          <Input
            placeholder="请输入有效的联系方式，以便我们与您沟通账号使用事宜"
            value={formData.contactInfo}
            onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
            className="w-full"
          />
        </div>

        {/* 费用预览 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">费用预览</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">基础租赁费用（{formData.rentalDays}天）</span>
              <span className="font-medium">¥{totalCost}</span>
            </div>
            {getSelectedAccountInfo() && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">账号类型</span>
                <span className="font-medium">{getSelectedAccountInfo()?.type}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">总计费用</span>
                <span className="font-bold text-lg text-orange-500">¥{totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3">
        <Button 
          onClick={handleSubmitRental}
          disabled={!formData.selectedAccount || !formData.usagePurpose}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
        >
          提交租赁订单 - ¥{totalCost}
        </Button>
        <Button 
          onClick={() => router.back()}
          variant="secondary"
          className="w-full py-3 border border-gray-200 text-gray-700 rounded-2xl"
        >
          取消
        </Button>
      </div>
      
      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}