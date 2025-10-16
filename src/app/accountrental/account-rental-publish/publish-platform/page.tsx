import Link from 'next/link';

// 定义平台类型接口
interface Platform {
  id: string;
  title: string;
  iconSvg: string;
  description: string;
  accountCount: number;
  iconBgColor: string;
}

const PublishPlatformPage = () => {
  // 平台类型配置 - 使用字符串形式的SVG以避免服务器/客户端渲染不匹配
  const platforms: Platform[] = [
    {
      id: 'douyin',
      title: '抖音',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1.66-12.87c-.39-.39-1.02-.39-1.41 0l-2.67 2.67-.67-.67a1 1 0 00-1.41 1.41l1.34 1.34a1 1 0 00.71.29h3.66c.55 0 1-.45 1-1V7.59c0-.38-.32-.71-.7-.71-.19 0-.37.08-.51.22l-1.34 1.34z"/>
      </svg>`,
      description: '租用活跃抖音账号进行品牌推广和内容传播',
      accountCount: 1000,
      iconBgColor: 'bg-red-500'
    },
    {
      id: 'xiaohongshu',
      title: '小红书',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
      </svg>`,
      description: '租用高质量小红书账号发布种草笔记和产品推荐',
      accountCount: 800,
      iconBgColor: 'bg-orange-500'
    },
    {
      id: 'kuaishou',
      title: '快手',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>`,
      description: '租用快手账号进行产品宣传和用户互动',
      accountCount: 600,
      iconBgColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">选择平台</h1>
        
        {/* 平台卡片列表 */}
        <div className="space-y-4">
          {platforms.map((platform) => (
            <Link 
              key={platform.id}
              href="/accountrental/account-rental-publish/platformtype"
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* 卡片左侧内容 */}
                <div className="flex items-center space-x-4">
                  {/* 平台图标 */}
                  <div className={`${platform.iconBgColor} rounded-lg p-2 flex items-center justify-center w-12 h-12`}>
                    {/* 使用特定的图标替代动态SVG，以避免hydration问题 */}
                    <span className="text-white text-xl">
                      {platform.id === 'douyin' && '🎵'}
                      {platform.id === 'xiaohongshu' && '📖'}
                      {platform.id === 'kuaishou' && '🎬'}
                    </span>
                  </div>
                  
                  {/* 平台信息 */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{platform.title}</h3>
                      <span className="text-sm text-gray-500">{platform.accountCount}+ 活跃账号</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{platform.description}</p>
                  </div>
                </div>
                
                {/* 继续按钮 */}
                <div className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
                  <span>继续</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublishPlatformPage;