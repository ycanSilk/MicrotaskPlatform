'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadOutlined } from '@ant-design/icons';

const PublishForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    duration: '',
    contactMethod: 'phone'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单验证和提交逻辑
    console.log('Form submitted:', formData);
    // 提交成功后跳转到成功页面或列表页
    alert('发布成功！');
    router.push('/accountrental/account-rental-requests');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">填写发布信息</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 标题输入 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="请输入标题"
              required
            />
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

          {/* 描述输入 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="请输入详细描述"
              rows={4}
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

          {/* 联系方式 */}
          <div>
            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-1">
              联系方式
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="phone">电话</option>
              <option value="email">邮箱</option>
              <option value="chat">在线聊天</option>
            </select>
          </div>

          {/* 上传图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              上传图片 (可选)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
              <UploadOutlined className="text-gray-400 text-4xl mb-2" />
              <p className="text-gray-500">点击或拖拽文件到此处上传</p>
              <p className="text-gray-400 text-xs mt-1">支持 JPG, PNG, GIF 格式，最大 5MB</p>
            </div>
          </div>

          {/* 表单操作按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => router.back()}
            >
              返回
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
    </div>
  );
};

export default PublishForm;