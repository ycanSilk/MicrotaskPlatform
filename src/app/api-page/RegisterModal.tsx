import React from 'react';

// 定义类型，不依赖外部导入以避免循环依赖
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  form: RegisterFormData;
  isRegistering: boolean;
  registerError: string;
  registerSuccess: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  form,
  isRegistering,
  registerError,
  registerSuccess,
  onInputChange,
  onSubmit,
  onClose
}) => {
  // 如果模态框未打开，则不渲染任何内容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-bold text-gray-800">用户注册</div>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="关闭"
            disabled={isRegistering}
          >
            ✕
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-4 overflow-auto flex-1">
          {registerSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">注册成功！</h3>
              <p className="text-gray-600 mb-4">您的账号已成功创建，即将自动关闭...</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* 用户名 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={onInputChange}
                  placeholder="请输入3-20个字符的用户名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isRegistering}
                />
              </div>

              {/* 邮箱 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  电子邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onInputChange}
                  placeholder="请输入有效的邮箱地址（选填）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isRegistering}
                />
              </div>

              {/* 密码 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={onInputChange}
                  placeholder="请输入6-20个字符的密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isRegistering}
                />
              </div>

              {/* 确认密码 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onInputChange}
                  placeholder="请再次输入密码（选填）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isRegistering}
                />
              </div>

              {/* 手机号 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  手机号码
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone || ''}
                  onChange={onInputChange}
                  placeholder="请输入11位手机号码（选填）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isRegistering}
                />
              </div>



              {/* 错误信息 */}
              {registerError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {registerError}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isRegistering ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    注册中...
                  </div>
                ) : (
                  '立即注册'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;