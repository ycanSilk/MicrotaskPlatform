'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/business/BackButton';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';

interface HeaderProps {
  // 可以添加需要的props
}

const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');



  const handleDashboardClick = () => {
    router.push('/publisher/dashboard');
  };

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 实际项目中，这里应该执行搜索逻辑
      console.log('执行搜索:', searchQuery);
      // 例如: router.push(`/accountrental/account-rental-market?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 清除搜索内容
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="h-[56px] bg-white flex items-center px-4 border-b border-gray-200 sticky top-0 z-10">
      {/* 使用公共 BackButton 组件 */}
      <BackButton className="w-[36px] h-[36px] flex items-center justify-center" />

      {/* 搜索框 - 优化并实现搜索功能 */}
      <div className="flex-1 ml-3 relative">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索账号名称、ID或平台"
              className="w-full h-[36px] bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="清除搜索内容"
              >
                <CloseOutlined />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 管理后台按钮 - 修改为符号样式 */}
      <button
        onClick={handleDashboardClick}
        className="ml-2 w-[36px] h-[36px] flex items-center justify-center bg-transparent border-none cursor-pointer text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative group"
        aria-label="管理后台"
        title="管理后台"
      >
        {/* 使用@ant-design/icons中的设置图标 */}
          <SettingOutlined className="text-xl" />
        {/* 悬停时显示中文提示 */}
        <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
          管理后台
        </span>
      </button>
    </header>
  );
};

export default Header;