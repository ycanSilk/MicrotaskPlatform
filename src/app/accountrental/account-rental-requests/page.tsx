'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchOutlined, MessageOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';

// 求租信息接口定义
interface RentalRequest {
  id: string;
  orderNumber: string;
  publishTime: string;
  deadline: string;
  price: number;
  description: string;
  accountRequirements: {
    canChangeName: boolean;
    canChangeAvatar: boolean;
    canPostComments: boolean;
    canPostVideos: boolean;
  };
  loginMethods: {
    qrCode: boolean;
    phoneSms: boolean;
  };
  platform: string;
  platformIcon: React.ReactNode;
  publisherName: string;
  publisherRating: number;
}

// 复制状态接口
interface CopyStatus {
  [key: string]: boolean;
}

// 提示信息接口
interface ToastMessage {
  show: boolean;
  message: string;
}

// 获取平台图标
const getPlatformIcon = (platform: string) => {
  const iconMap: Record<string, string> = {
    douyin: '🎵',
    xiaohongshu: '📕',
    kuaishou: '🎬',
  };
  return iconMap[platform] || '📱';
};

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RentalRequestsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({});
  const [toast, setToast] = useState<ToastMessage>({
    show: false,
    message: ''
  });
  
  // 显示提示消息
  const showToast = (message: string) => {
    setToast({ show: true, message });
    // 2秒后自动隐藏
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  };

  // 模拟获取求租信息数据
  useEffect(() => {
    const fetchRentalRequests = async () => {
      try {
        setLoading(true);
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 模拟数据
        const mockData: RentalRequest[] = [
          {
            id: 'req001',
            orderNumber: 'REQ-20230705-001',
            publishTime: '2023-07-05T10:00:00',
            deadline: '2023-07-07T10:00:00',
            price: 92.40,
            description: '专注于美食探店内容，有稳定的粉丝群体和良好的互动率',
            accountRequirements: {
              canChangeName: true,
              canChangeAvatar: true,
              canPostComments: true,
              canPostVideos: true
            },
            loginMethods: {
              qrCode: true,
              phoneSms: true
            },
            platform: 'douyin',
            platformIcon: getPlatformIcon('douyin'),
            publisherName: '美食达人',
            publisherRating: 4.8
          },
          {
            id: 'req002',
            orderNumber: 'REQ-20230704-002',
            publishTime: '2023-07-04T15:30:00',
            deadline: '2023-07-06T15:30:00',
            price: 120.50,
            description: '需要时尚穿搭账号，用于夏季新品推广，要求有一定的粉丝基础和互动率',
            accountRequirements: {
              canChangeName: false,
              canChangeAvatar: false,
              canPostComments: true,
              canPostVideos: true
            },
            loginMethods: {
              qrCode: false,
              phoneSms: true
            },
            platform: 'xiaohongshu',
            platformIcon: getPlatformIcon('xiaohongshu'),
            publisherName: '时尚先锋',
            publisherRating: 4.5
          },
          {
            id: 'req003',
            orderNumber: 'REQ-20230703-003',
            publishTime: '2023-07-03T09:00:00',
            deadline: '2023-07-05T09:00:00',
            price: 85.00,
            description: '求租科技类账号，用于新品数码产品评测和推广',
            accountRequirements: {
              canChangeName: false,
              canChangeAvatar: false,
              canPostComments: true,
              canPostVideos: true
            },
            loginMethods: {
              qrCode: true,
              phoneSms: false
            },
            platform: 'kuaishou',
            platformIcon: getPlatformIcon('kuaishou'),
            publisherName: '科技玩家',
            publisherRating: 4.7
          }
        ];
        
        setRentalRequests(mockData);
      } catch (error) {
        console.error('获取求租信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();
  }, []);

  // 过滤求租信息
  const filteredRequests = rentalRequests.filter(request => 
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理立即租赁
  const handleRentNow = (requestId: string) => {
    // 在实际项目中，应该跳转到租赁确认页
    console.log('立即租赁请求:', requestId);
    // router.push(`/accountrental/account-rental-requests/rent/${requestId}`);
  };

  // 处理联系对方
  const handleContact = (requestId: string) => {
    console.log('联系对方请求:', requestId);
    // 在实际项目中，应该打开聊天窗口或显示联系方式
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索求租信息..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-2 py-6">
        <h1 className="text-2xl  mb-6 ">求租信息列表</h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <SearchOutlined className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">暂无求租信息</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100 cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => router.push(`/accountrental/account-rental-requests/requests-detail?orderNumber=${request.orderNumber}`)}
              >
                {/* 卡片头部 - 平台和价格信息 */}
                <div className="bg-blue-50 p-3 border-b border-blue-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-lg font-medium">抖音</span>
                    </div>
                    <div className="text-red-600 font-bold text-lg">
                      ¥{request.price.toFixed(2)}/天
                    </div>
                  </div>
                </div>

                {/* 订单号和基本信息 */}
                <div className="p-2">
                    {/* 订单号和基本信息 */}
                    <div className="mb-1 text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap">订单号：{request.orderNumber}</h3>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                navigator.clipboard.writeText(request.orderNumber);
                                // 设置复制成功状态
                                setCopyStatus({ ...copyStatus, [request.id]: true });
                                // 显示成功提示
                                showToast('复制单号成功');
                                // 2秒后恢复原状态
                                setTimeout(() => {
                                    setCopyStatus({ ...copyStatus, [request.id]: false });
                                }, 2000);
                            }}
                            className="flex items-center space-x-1 p-1 rounded hover:bg-blue-200 text-blue-600"
                            title="复制订单号"
                        >
                            {copyStatus[request.id] ? (
                                <CheckOutlined />
                            ) : (
                                <CopyOutlined />
                            )}
                            <span className="text-sm">复制</span>
                        </button>
                      </div>
                    <div className="">
                      发布用户：{request.publisherName}
                    </div>
                    <div className="">
                      发布时间：{formatDateTime(request.publishTime)}
                    </div>
                    <div className="">
                      截止时间：{formatDateTime(request.deadline)}
                    </div>
                  </div>

                  <div className="text-sm text-blue-500 mb-1 space-y-1">求租要求：</div>
                  <div className='border border-blue-500 bg-blue-50 p-2 space-y-1 rounded-md text-blue-500'>  
                    {/* 描述信息 */}
                    <div className="">
                      <p className="text-sm text-blue-500">{request.description}</p>
                    </div>

                    {/* 账户要求 */}
                    <div className="">
                      <div className="text-sm font-medium">账号要求：</div>
                      <div className="text-sm text-blue-500">
                        {request.accountRequirements.canChangeName && <div>• 可以修改抖音名称</div>}
                        {request.accountRequirements.canChangeAvatar && <div>• 可以修改头像</div>}
                        {request.accountRequirements.canPostComments && <div>• 可以发布评论</div>}
                        {request.accountRequirements.canPostVideos && <div>• 可以发布视频</div>}
                      </div>
                    </div>

                    {/* 登录方式 */}
                    <div className="">
                      <div className="text-sm font-medium">登录方式：</div>
                      <div className="text-sm text-blue-500">
                        {request.loginMethods.qrCode && <div>• 扫码登录</div>}
                        {request.loginMethods.phoneSms && <div>• 手机号加短信验证登录</div>}
                      </div>
                    </div>
                  </div>

                  {/* 风险提示 */}
                  <div className="mb-4 mt-2 p-2 bg-red-50 rounded-md text-xs text-red-600">
                    风险提示：出租账户期间账户可能被平台封禁风险，如有封禁，租户自行承担。租赁期间如被封禁，租户需按照要求进行验证解禁，并继续履约。
                  </div>

                  {/* 按钮区域 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleRentNow(request.id);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium shadow-sm active:scale-95 transition-all"
                    >
                      立即租赁
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleContact(request.id);
                      }}
                      className="flex items-center justify-center px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                      <MessageOutlined className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  );
};

// 提示框组件
const Toast = ({ toast }: { toast: ToastMessage }) => {
  if (!toast.show) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white px-6 py-4 rounded-lg shadow-lg border border-blue-100 flex items-center space-x-2">
        <CheckOutlined className="text-green-500" />
        <span className="text-gray-800">{toast.message}</span>
      </div>
    </div>
  );
};

export default RentalRequestsPage;