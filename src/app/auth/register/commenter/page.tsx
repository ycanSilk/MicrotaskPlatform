'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommenterRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    captcha: '',
    inviteCode: '',
    agreeToTerms: false
  });
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // 生成随机验证码
  function generateCaptcha(length = 4) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setFormData({ ...formData, captcha: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // 基础验证
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage('请输入用户名和密码');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('密码长度不能少于6位');
      return;
    }

    // 如果填写了手机号，则验证手机号格式
    if (formData.phone.trim()) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setErrorMessage('请输入正确的手机号码');
        return;
      }
    }

    if (!formData.agreeToTerms) {
      setErrorMessage('请阅读并同意用户协议和隐私政策');
      return;
    }

    // 验证码验证
    if (!formData.captcha.trim()) {
      setErrorMessage('请输入验证码');
      return;
    }

    if (formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('验证码错误');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    
    try {
      // 调用评论员注册API
      const response = await fetch('/api/register/commenter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          phone: formData.phone,
          inviteCode: formData.inviteCode
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 注册成功
        setSuccessMessage(result.message);
        
        // 2秒后跳转到登录页
        setTimeout(() => {
          router.push('/auth/login/commenterlogin');
        }, 2000);
      } else {
        setErrorMessage(result.message || '注册失败');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('注册过程中发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部装饰 */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-3">
            💬 评论员注册
          </div>
          <div className="text-green-100 text-xs md:text-sm">
            开启您的评论任务赚钱之旅
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 -mt-6 md:-mt-8">
        <div className="max-w-md mx-auto px-4">
          {/* 注册卡片 */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">注册评论员账号</h2>
              <p className="text-xs md:text-sm text-gray-600">填写基本信息，快速开启赚钱之旅</p>
            </div>

            {/* 注册表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 账号信息 */}
              <div className="bg-green-50 rounded-lg p-3 md:p-4">
                <h3 className="text-sm font-bold text-green-800 mb-3">账号信息</h3>
                
                {/* 用户名 */}
                <div className="mb-3">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-20位字母数字组合"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>

                {/* 密码 */}
                <div className="mb-3">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="至少6位字符"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>

                {/* 确认密码 */}
                <div className="mb-3">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    确认密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>

                {/* 手机号和验证码 */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      手机号
                    </label>
                    <input
                      type="tel"
                      placeholder="请输入11位手机号（选填）"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  {/* 验证码 */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      验证码 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="请输入验证码"
                        value={formData.captcha}
                        onChange={(e) => setFormData({...formData, captcha: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <div 
                        className="w-24 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg font-bold text-lg cursor-pointer"
                        onClick={refreshCaptcha}
                      >
                        {captchaCode}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">点击验证码可刷新</p>
                  </div>
                </div>
              </div>

              {/* 邀请码 */}
              <div className="bg-purple-50 rounded-lg p-3 md:p-4">
                <h3 className="text-sm font-bold text-purple-800 mb-3">🎁 邀请码（可选）</h3>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    邀请码
                  </label>
                  <input
                    type="text"
                    placeholder="填写邀请码可获得新人奖励"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <p className="text-xs text-purple-600 mt-1">💰 使用邀请码注册可获得5元新人奖励</p>
                </div>
              </div>

              {/* 协议同意 */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="agreeToTerms" className="text-xs text-gray-600 leading-relaxed">
                  我已阅读并同意 <span className="text-green-600 underline">《用户协议》</span> 和 <span className="text-green-600 underline">《隐私政策》</span>
                </label>
              </div>

              {/* 错误信息 */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">❌</span>
                    <span className="text-sm text-red-700">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* 成功信息 */}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-sm text-green-700">{successMessage}</span>
                  </div>
                </div>
              )}

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? '注册中...' : '立即注册评论员'}
              </button>
            </form>

            {/* 底部链接 */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                已有账号？{' '}
                <button 
                  onClick={() => router.push('/auth/login/commenterlogin')}
                  className="text-green-600 hover:text-green-800 underline"
                >
                  立即登录
                </button>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                申请派单员账号？{' '}
                <button 
                  onClick={() => router.push('/auth/register/publisher')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  点击这里
                </button>
              </p>
            </div>
          </div>

          {/* 新人礼包 */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800 font-medium mb-2">🎉 新人福利</div>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• 注册即送5元新人奖励（使用邀请码）</li>
              <li>• 首次完成任务再奖励10元</li>
              <li>• 前3天任务收益翻倍</li>
              <li>• 专属新人任务，轻松上手</li>
            </ul>
          </div>

          {/* 底部信息 */}
          <div className="text-center text-xs text-gray-500 mb-8">
            <p>© 2024 抖音派单系统 版本 v2.0.0</p>
            <p className="mt-1">安全注册 · 信息加密</p>
          </div>
        </div>
      </div>
    </div>
  );
}