'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PublishForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    price: '',
    description: '',
    duration: '1',
    phoneNumber: '',
    platform: 'douyin',
    accountRequirements: {
      canChangeName: false,
      canPostComments: false,
      canPostVideos: false
    },
    loginMethods: {
      qrCode: false,
      phoneSms: false
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCheckboxChange = (type: 'accountRequirements' | 'loginMethods', field: string) => {
    setFormData(prev => {
      const updatedType = { ...prev[type] };
      (updatedType as Record<string, boolean>)[field] = !(updatedType as Record<string, boolean>)[field];
      return {
        ...prev,
        [type]: updatedType
      };
    });
  };
  
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '请输入手机号';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = '请输入有效的手机号';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 这里可以添加表单验证和提交逻辑
    console.log('Form submitted:', formData);
    // 提交成功后显示成功模态框
    setShowSuccessModal(true);
  };
  
  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    router.push('/accountrental/account-rental-requests');
  };
  
  const handleCancel = () => {
    router.push('/accountrental/account-rental-publish');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">填写发布信息</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 描述输入 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              租赁信息描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="请输入详细描述"
              rows={4}
              maxLength={150}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/150 字</p>
          </div>

           {/* 价格输入 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              价格 (元/天) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="请输入价格"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* 租赁时长 */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              租赁时长 (天)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="请输入租赁时长"
              min="1"
            />
          </div>

          {/* 手机号 */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              联系电话 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              placeholder="请输入手机号"
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          
          {/* 平台选择 */}
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              平台选择 <span className="text-red-500">*</span>
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            >
              <option value="douyin">抖音平台</option>
            </select>
          </div>
          
          {/* 账号要求 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              账号要求
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.accountRequirements.canChangeName}
                  onChange={() => handleCheckboxChange('accountRequirements', 'canChangeName')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">修改抖音账号名称和头像</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.accountRequirements.canPostComments}
                  onChange={() => handleCheckboxChange('accountRequirements', 'canPostComments')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">支持发布评论</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.accountRequirements.canPostVideos}
                  onChange={() => handleCheckboxChange('accountRequirements', 'canPostVideos')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">支持发布视频</span>
              </label>
            </div>
          </div>
          
          {/* 登录方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登录方式
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.loginMethods.qrCode}
                  onChange={() => handleCheckboxChange('loginMethods', 'qrCode')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">扫描登录</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.loginMethods.phoneSms}
                  onChange={() => handleCheckboxChange('loginMethods', 'phoneSms')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">手机号+短信验证登录</span>
              </label>
            </div>
          </div>

          {/* 表单操作按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              发布
            </button>
          </div>
        </form>
      </div>
      
      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">发布成功！</h3>
              <p className="text-gray-600 mb-6">您的求租信息已成功发布</p>
              <button
                onClick={handleSuccessConfirm}
                className="w-full py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishForm;