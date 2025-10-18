import { NextResponse } from 'next/server';
import { AccountRentalInfo } from '@/app/accountrental/types';

// 转换外部API数据为前端需要的格式
  const transformLeaseInfoToAccountRentalInfo = (leaseInfo: any): AccountRentalInfo => {
    // 根据用户提供的API数据结构进行转换
    // 平台映射
    const platformMap: Record<string, string> = {
      '抖音': 'douyin',
    };
    
    // 价格处理 - 使用pricePerDay作为价格
    const price = leaseInfo.pricePerDay || 0;
    
    // 创建基本对象，不包含platformIcon字段（由前端处理）
    const baseObject: Partial<AccountRentalInfo> = {
      id: String(leaseInfo.id) || `lease-${Date.now()}`,
      platform: platformMap[leaseInfo.accountType] || 'douyin',
      accountTitle: leaseInfo.title || '账号出租',
      followersRange: '0-0', // API中没有提供粉丝数信息
      engagementRate: '0%', // API中没有提供互动率信息
      contentCategory: 'other', // API中没有提供内容分类信息
      region: 'national', // API中没有提供地区信息
      accountAge: '0', // API中没有提供账号年龄信息
      accountScore: 0, // API中没有提供账号评分信息
      price: price,
      rentalDuration: leaseInfo.minLeaseDays || 1,
      minimumRentalHours: 24 * (leaseInfo.minLeaseDays || 1), // 转换为小时
      deliveryTime: 60, // 默认值
      maxConcurrentUsers: 1, // 默认值
      responseTime: 30, // 默认值
      availableCount: 1, // 默认值
      publishTime: leaseInfo.createTime || new Date().toISOString(),
      // 添加可能需要的额外字段
      orderPrice: price,
      includedFeatures: [],
      description: leaseInfo.description || '',
      advantages: [],
      restrictions: [],
      isVerified: false,
      rating: 0,
      rentalCount: 0,
      status: leaseInfo.status === 'ACTIVE' ? 'active' : 'inactive',
      images: [],
      publisherName: leaseInfo.username || '未知发布者'
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
    
    // 更新为新的外部API地址
    const externalApiUrl = `http://14.29.178.235:8889/api/lease/market/lease-infos?status=ACTIVE&page=0&size=10&sort=createTime&direction=DESC`;
    
    console.log('请求外部API:', externalApiUrl);
    
    // 调用外部API
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`外部API调用失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('外部API返回数据:', data);
    
    // 根据用户提供的API数据结构，使用data.content来获取数据
    const transformedData = data.data?.content?.map((item: any) => 
      transformLeaseInfoToAccountRentalInfo(item)
    ) || [];
    
    // 返回转换后的数据
    return NextResponse.json({
      success: true,
      data: transformedData,
      total: data.data?.totalElements || 0,
      page: parseInt(page),
      size: parseInt(size)
    });
    
  } catch (error) {
    console.error('获取租赁市场数据失败:', error);
    
    // 返回错误信息，不使用模拟数据
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      page: 0,
      size: 10,
      message: error instanceof Error ? error.message : '获取租赁市场数据失败'
    }, {
      status: 500
    });
  }
}