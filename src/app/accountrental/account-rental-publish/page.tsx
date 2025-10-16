import Link from 'next/link';

const AccountRentalPublishPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* 抖音平台卡片 */}
        <div className="mb-4 bg-white rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FE2C55"/>
                  <path d="M16.5 8.70001C16.5 7.2 15.3 6.00001 13.8 6.00001H10.2C8.7 6.00001 7.5 7.2 7.5 8.70001V13.5C7.5 14.6 7.95 15.65 8.75 16.45C9.55 17.25 10.6 17.7 11.7 17.7H12.3C13.4 17.7 14.45 17.25 15.25 16.45C16.05 15.65 16.5 14.6 16.5 13.5V8.70001Z" fill="white"/>
                  <path d="M14.25 10.5C14.25 10.5 13.8 11.65 12 12.5C10.2 11.65 9.75 10.5 9.75 10.5" stroke="#FE2C55" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-800">抖音</h3>
                  <span className="ml-2 text-sm text-gray-500">1000+ 活跃账号</span>
                </div>
                <p className="text-gray-600 mt-1">租用活跃抖音账号进行品牌推广和内容传播</p>
              </div>
            </div>
            <Link href="/accountrental/account-rental-publish/platformtype?platform=douyin">
              <div className="bg-blue-500 text-white px-4 py-2 rounded">
                继续 &gt;
              </div>
            </Link>
          </div>
        </div>

        {/* 小红书平台卡片 */}
        <div className="mb-4 bg-white rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FF2442"/>
                  <path d="M8.5 8L11.5 14L15.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-800">小红书</h3>
                  <span className="ml-2 text-sm text-gray-500">800+ 活跃账号</span>
                </div>
                <p className="text-gray-600 mt-1">租用高质量小红书账号发布种草笔记和产品推荐</p>
              </div>
            </div>
            <Link href="/accountrental/account-rental-publish/platformtype?platform=xiaohongshu">
              <div className="bg-blue-500 text-white px-4 py-2 rounded">
                继续 &gt;
              </div>
            </Link>
          </div>
        </div>

        {/* 快手平台卡片 */}
        <div className="mb-4 bg-white rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#00C6FF"/>
                  <path d="M9 8L13 10L17 8V14L13 12L9 14V8Z" fill="white"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-800">快手</h3>
                  <span className="ml-2 text-sm text-gray-500">600+ 活跃账号</span>
                </div>
                <p className="text-gray-600 mt-1">租用快手账号进行产品宣传和用户互动</p>
              </div>
            </div>
            <Link href="/accountrental/account-rental-publish/platformtype?platform=kuaishou">
              <div className="bg-blue-500 text-white px-4 py-2 rounded">
                继续 &gt;
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRentalPublishPage;