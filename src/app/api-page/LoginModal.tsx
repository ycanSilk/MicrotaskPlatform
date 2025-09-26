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
  loginLogs: string[];
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
  loginLogs,
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
                <div className="bg-red-50 text-red-600 p-3 rounded-lg space-y-3 shadow-sm">
                  {/* 错误标题和主要信息 */}
                  <div className="flex items-start">
                    <div className="text-red-500 mr-2 mt-0.5">⚠️</div>
                    <div>
                      <p className="font-medium text-red-700">登录失败</p>
                      <p className="text-sm mt-1 whitespace-pre-line">{loginError}</p>
                    </div>
                  </div>
                  
                  {/* 可能的原因和解决建议 */}
                  <div className="bg-white p-2 rounded border border-red-200">
                    <p className="text-xs text-red-700 font-medium mb-1">可能的原因和解决建议：</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                      {loginError.includes('404') && (
                        <>
                          <li>API接口可能已更改或服务器路径错误</li>
                          <li>请检查服务器是否正常运行</li>
                        </>
                      )}
                      {loginError.includes('401') && (
                        <>
                          <li>用户名或密码可能不正确</li>
                          <li>请确认您输入的凭证无误</li>
                        </>
                      )}
                      {loginError.includes('NetworkError') || loginError.includes('Failed to fetch') ? (
                        <>
                          <li>网络连接可能中断</li>
                          <li>请检查您的网络设置</li>
                          <li>确认API服务器是否可访问</li>
                        </>
                      ) : (
                        <>
                          <li>请检查您的网络连接</li>
                          <li>确认用户名和密码输入正确</li>
                          <li>稍后重试或联系系统管理员</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  {/* 调试日志 */}
                  {loginLogs.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-700">详细调试信息:</h4>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          {loginLogs.length} 条日志
                        </span>
                      </div>
                      
                      {/* 日志内容卡片 */}
                      <div className="bg-gray-900 text-gray-300 p-3 rounded-lg text-xs overflow-auto max-h-72 whitespace-pre-wrap font-mono">
                        {loginLogs.map((log, index) => (
                          <div key={index} className="mb-2 last:mb-0">
                            {/* 为不同类型的日志添加不同的前缀颜色 */}
                            {log.includes('开始登录请求') && (
                              <span className="text-blue-400">[开始] </span>
                            )}
                            {log.includes('请求信息') && (
                              <span className="text-purple-400">[请求] </span>
                            )}
                            {log.includes('收到响应') && (
                              <span className="text-green-400">[响应] </span>
                            )}
                            {log.includes('登录失败') && (
                              <span className="text-red-400">[错误] </span>
                            )}
                            {log.includes('环境信息') && (
                              <span className="text-yellow-400">[环境] </span>
                            )}
                            {log.includes('成功响应') && (
                              <span className="text-cyan-400">[成功] </span>
                            )}
                            {log}
                          </div>
                        ))}
                      </div>
                      
                      {/* 控制台查看按钮 */}
                      <div className="flex justify-between items-center mt-2">
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => {
                            console.log('\n\n========== 登录请求详细调试信息 ==========\n');
                            console.group('登录请求完整日志');
                            loginLogs.forEach((log, index) => {
                              console.log(`[${index + 1}]`, log);
                            });
                            console.groupEnd();
                            console.log('\n=========================================\n');
                            alert('✅ 完整日志已打印到浏览器控制台\n\n请按 F12 键打开开发者工具查看详细信息');
                          }}
                        >
                          🔍 在控制台查看完整格式化日志
                        </button>
                        
                        {/* 复制日志按钮 */}
                        <button
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(loginLogs.join('\n'))
                              .then(() => alert('📋 调试日志已复制到剪贴板'))
                              .catch(err => console.error('复制失败:', err));
                          }}
                        >
                          📋 复制日志
                        </button>
                      </div>
                    </div>
                  )}
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