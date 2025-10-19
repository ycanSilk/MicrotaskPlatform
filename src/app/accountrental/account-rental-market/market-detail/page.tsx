import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AccountRentalInfo } from '../../types';





// 模拟获取账号详情数据
const fetchAccountDetail = async (accountId: string): Promise<AccountRentalInfo> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据，只包含新接口所需的字段
  return {
    id: accountId,
    rentalDescription: '抖音美食账号出租，专注餐厅探店和美食测评，互动率高',
    price: 800,
    publishTime: '2024-06-20T10:30:00Z',
    orderNumber: 'ORD202406201030001',
    orderStatus: '待确认',
    rentalDays: 30,
    images: [
              'images/0e92a4599d02a7.jpg'      
            ]
  };
};

// 服务器组件获取数据
const AccountDetailPage = async ({
  searchParams,
}: {
  searchParams: {
    id?: string;
  };
}) => {
  const accountId = searchParams?.id || '';
  
  if (!accountId) {
    return notFound();
  }

  try {
    const account = await fetchAccountDetail(accountId);

    // 格式化发布时间
    const formatPublishTime = (timeString: string): string => {
      const date = new Date(timeString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 根据订单状态返回对应的样式类名
    const getOrderStatusClass = (status: string): string => {
      switch (status) {
        case '待确认':
          return 'bg-yellow-100 text-yellow-800';
        case '已确认':
          return 'bg-green-100 text-green-800';
        case '进行中':
          return 'bg-blue-100 text-blue-800';
        case '已完成':
          return 'bg-purple-100 text-purple-800';
        case '已取消':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-800">账号详情</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧主要信息 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  {/* 订单基本信息 */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-xl font-bold text-gray-800">租赁详情</h1>
                      <p className="text-sm text-gray-500 mt-1">抖音账号租赁</p>
                    </div>
                    <div className={`text-sm px-3 py-1 rounded-full ${getOrderStatusClass(account.orderStatus)}`}>
                      {account.orderStatus}
                    </div>
                  </div>
                  
                  {/* 租赁描述 */}
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">租赁描述</h2>
                    <p className="text-gray-600 leading-relaxed">{account.rentalDescription}</p>
                  </div>
                  
                  {/* 订单详情 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t border-gray-100 pt-4">
                    <div>
                      <div className="text-sm text-gray-500">订单号</div>
                      <div className="text-gray-800 font-medium">{account.orderNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">发布时间</div>
                      <div className="text-gray-800">{formatPublishTime(account.publishTime)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧价格和操作信息 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                {/* 价格信息 */}
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-red-600">¥{account.price}</span>
                  </div>
                </div>
                
                {/* 租赁信息 */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">出租天数</span>
                    <span className="text-gray-800 font-medium">{account.rentalDays}天</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">总价</span>
                    <span className="text-gray-800 font-medium">¥{account.price}</span>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="space-y-3">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    立即租赁
                  </Button>
                  
                  <Button variant="ghost" className="w-full">
                    联系发布者
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('获取账号详情失败:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">获取账号详情失败</h2>
          <p className="text-gray-500 mb-4">请稍后再试或返回首页</p>
          <Button onClick={() => window.history.back()}>
            返回
          </Button>
        </div>
      </div>
    );
  }
};

export default AccountDetailPage;