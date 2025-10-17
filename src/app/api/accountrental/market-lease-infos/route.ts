import { NextResponse } from 'next/server';
import { AccountRentalInfo } from '@/app/accountrental/types';

// 根据平台获取对应图标名称
const getPlatformIconName = (platform: string): string => {
  switch (platform) {
    case 'douyin':
      return 'AudioOutlined';
    case 'xiaohongshu':
      return 'BookOutlined';
    case 'kuaishou':
      return 'ToolOutlined';
    default:
      return 'BookOutlined';
  }
};

// 转换外部API数据为前端需要的格式
const transformLeaseInfoToAccountRentalInfo = (leaseInfo: any): AccountRentalInfo => {
  // 计算价格，假设外部API返回的是派单单价
  const orderPrice = leaseInfo.price || 0;
  const price = orderPrice * 0.77; // 订单单价 = 派单单价 * 77%
  
  // 创建基本对象，不包含platformIcon字段（由前端处理）
  const baseObject: Partial<AccountRentalInfo> = {
    id: leaseInfo.id || `lease-${Date.now()}`,
    platform: leaseInfo.platform || 'douyin',
    accountTitle: leaseInfo.title || '账号出租',
    followersRange: leaseInfo.followerCount || '0-0',
    engagementRate: leaseInfo.engagementRate || '0%',
    contentCategory: leaseInfo.category || 'other',
    region: leaseInfo.region || 'national',
    accountAge: leaseInfo.accountAge || '0',
    accountScore: leaseInfo.score || 0,
    orderPrice: orderPrice,
    price: price,
    rentalDuration: leaseInfo.duration || 1,
    minimumRentalHours: leaseInfo.minHours || 1,
    deliveryTime: leaseInfo.deliveryTime || 60,
    maxConcurrentUsers: leaseInfo.maxConcurrentUsers || 1,
    responseTime: leaseInfo.responseTime || 30,
    includedFeatures: leaseInfo.features || [],
    description: leaseInfo.description || '',
    advantages: leaseInfo.advantages || [],
    restrictions: leaseInfo.restrictions || [],
    isVerified: leaseInfo.verified || false,
    rating: leaseInfo.rating || 0,
    rentalCount: leaseInfo.rentalCount || 0,
    availableCount: leaseInfo.availableCount || 1,
    publishTime: leaseInfo.createTime || new Date().toISOString(),
    status: leaseInfo.status === 'ACTIVE' ? 'active' : 'inactive',
    images: leaseInfo.images || [],
    publisherName: leaseInfo.publisherName || '未知发布者',
    userId: leaseInfo.userId || Math.random() > 0.7 ? '3' : undefined // 模拟数据：随机将约30%的租赁信息标记为用户ID=3发布的
  };
  
  // 返回符合AccountRentalInfo类型的对象
  return baseObject as AccountRentalInfo;
};

export async function GET(request: Request) {
  try {
    // 从请求中获取查询参数
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '10';
    const sort = url.searchParams.get('sort') || 'createTime';
    const direction = url.searchParams.get('direction') || 'DESC';
    const status = url.searchParams.get('status') || 'ACTIVE';
    
    // 使用固定的新API URL
    const externalApiUrl = `http://14.29.178.235:8889/api/lease/market/lease-infos?status=ACTIVE&page=0&size=10&sort=createTime&direction=DESC`;
    
    console.log('请求外部API:', externalApiUrl);
    
    // 调用外部API
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`外部API调用失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('外部API返回数据:', data);
    
    // 转换数据格式
    const transformedData = data.data?.items?.map((item: any) => 
      transformLeaseInfoToAccountRentalInfo(item)
    ) || [];
    
    // 返回转换后的数据
    return NextResponse.json({
      success: true,
      data: transformedData,
      total: data.data?.total || 0,
      page: parseInt(page),
      size: parseInt(size)
    });
    
  } catch (error) {
    console.error('获取租赁市场数据失败:', error);
    
    // 为了保证系统可用性，如果外部API调用失败，返回模拟数据
    const mockData: AccountRentalInfo[] = [
      {
        id: 'mock-acc-001',
        platform: 'douyin',
        accountTitle: '美食探店达人',
        followersRange: '50k-100k',
        engagementRate: '5.2%',
        contentCategory: 'food',
        orderPrice: 120,
        price: 120 * 0.77,
        rentalDuration: 1,
        minimumRentalHours: 2,
        accountScore: 4.8,
        region: 'national',
        accountAge: '12+',
        deliveryTime: 60,
        maxConcurrentUsers: 1,
        responseTime: 30,
        availableCount: 1,
        publishTime: new Date().toISOString(),
        includedFeatures: ['基础发布', '数据分析'],
        description: '专注于美食探店内容，有稳定的粉丝群体和良好的互动率',
        advantages: ['粉丝活跃度高', '内容质量优', '响应速度快'],
        restrictions: ['禁止发布违法内容', '禁止更改账号设置'],
        status: 'active',
        images: ['/images/douyin-logo.png'],
        publisherName: '美食达人'
      } as AccountRentalInfo,
      {
        id: 'mock-acc-002',
        platform: 'xiaohongshu',
        accountTitle: '生活方式博主',
        followersRange: '30k-50k',
        engagementRate: '4.8%',
        contentCategory: 'lifestyle',
        orderPrice: 90,
        price: 90 * 0.77,
        rentalDuration: 1,
        minimumRentalHours: 1,
        accountScore: 4.6,
        region: 'national',
        accountAge: '8+',
        deliveryTime: 45,
        maxConcurrentUsers: 1,
        responseTime: 20,
        availableCount: 1,
        publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        includedFeatures: ['基础发布', '评论回复'],
        description: '分享日常生活技巧和好物推荐',
        advantages: ['互动性强', '粉丝黏性高'],
        restrictions: ['禁止发布违法内容'],
        status: 'active',
        images: ['/images/xiaohongshu-logo.png'],
        publisherName: '生活家'
      } as AccountRentalInfo
    ];
    
    return NextResponse.json({
      success: true,
      data: mockData,
      total: mockData.length,
      page: 0,
      size: 10,
      warning: '使用模拟数据，外部API可能暂时不可用'
    });
  }
}