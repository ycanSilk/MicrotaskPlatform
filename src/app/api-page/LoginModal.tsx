// 定义类型，不依赖外部导入以避免循环依赖
import React from 'react';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginModalProps {
  isOpen: boolean;
  form: LoginFormData;
  isLoggingIn: boolean;
  loginError: string;
  loginSuccess: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  form,
  isLoggingIn,
  loginError,
  loginSuccess,
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
          <div className="text-lg font-bold text-gray-800">用户登录</div>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="关闭"
            disabled={isLoggingIn}
          >
            ✕
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-4 overflow-auto flex-1">
          {loginSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">登录成功！</h3>
              <p className="text-gray-600 mb-4">您已成功登录，即将自动关闭...</p>
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
                  placeholder="请输入您的用户名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={isLoggingIn}
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
                  placeholder="请输入您的密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={isLoggingIn}
                />
              </div>

              {/* 错误信息 */}
              {loginError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isLoggingIn ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    登录中...
                  </div>
                ) : (
                  '立即登录'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;