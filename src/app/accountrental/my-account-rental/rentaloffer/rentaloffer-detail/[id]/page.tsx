'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Space, Descriptions, Divider, Modal, message } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// 出租信息状态类型
type RentalOfferStatus = '待审核' | '已上架' | '已租出' | '已下架' | '审核不通过';

// 出租信息接口
interface RentalOffer {
  id: string;
  offerNo: string;
  userName: string;
  userId: string;
  accountType: string;
  accountName: string;
  accountDescription: string;
  rentalPrice: number;
  rentalUnit: string;
  createTime: string;
  status: RentalOfferStatus;
  imageUrl?: string;
  // 租赁信息（如果已租出）
  rentalInfo?: {
    rentalOrderNo: string;
    tenantName: string;
    startDate: string;
    endDate: string;
    amount: number;
  };
  // 审核失败原因
  rejectReason?: string;
  // 账号数据展示图片
  dataImages?: string[];
}

// 获取状态对应的标签颜色
const getStatusTagColor = (status: RentalOfferStatus): string => {
  const statusColors = {
    '待审核': 'orange',
    '已上架': 'green',
    '已租出': 'purple',
    '已下架': 'gray',
    '审核不通过': 'red'
  };
  return statusColors[status];
};

const RentalOfferDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams?.get('id');
  const [offerDetail, setOfferDetail] = useState<RentalOffer | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [offShelfModalVisible, setOffShelfModalVisible] = useState<boolean>(false);
  // 删除不再使用的表单实例
  
  // 模拟从API获取出租详情
  useEffect(() => {
    // 这里应该是实际API调用，这里使用模拟数据
    const mockOffers: RentalOffer[] = [
      {
        id: '1',
        offerNo: 'OFFER20240620001',
        userName: '张三',
        userId: 'USER123456',
        accountType: '抖音',
        accountName: '美食达人小C',
        accountDescription: '专注美食领域，以制作精致的餐厅探店和美食测评视频为主，互动率高，粉丝粘性强。主要内容包括热门餐厅探店、美食制作教程、特色小吃推荐等。账号粉丝主要为20-35岁的年轻人群，对美食有较高的热情和消费能力。',
        rentalPrice: 800,
        rentalUnit: '天',
        createTime: '2024-06-20 10:30:00',
        status: '已上架',
        imageUrl: '/images/douyin-logo.png',
        dataImages: [
          '/images/1758384598887_578.jpg',
          '/images/1758380776810_96.jpg'
        ]
      },
      {
        id: '2',
        offerNo: 'OFFER20240619002',
        userName: '李四',
        userId: 'USER234567',
        accountType: '抖音',
        accountName: '美妆博主小D',
        accountDescription: '专业美妆博主，擅长口红试色和妆容教程，粉丝多为年轻女性，互动积极。主要分享美妆技巧、产品测评、妆容教程等内容，内容风格清新自然，推荐产品性价比高，深受粉丝信赖。',
        rentalPrice: 600,
        rentalUnit: '天',
        createTime: '2024-06-19 15:20:00',
        status: '已租出',
        imageUrl: '/images/douyin-logo.png',
        rentalInfo: {
          rentalOrderNo: 'RENT20240621001',
          tenantName: '王五',
          startDate: '2024-06-25',
          endDate: '2024-06-28',
          amount: 2400
        },
        dataImages: [
         '/images/1758384598887_578.jpg',
          '/images/1758380776810_96.jpg'
        ]
      },
      {
        id: '5',
        offerNo: 'OFFER20240616005',
        userName: '钱七',
        userId: 'USER567890',
        accountType: '抖音',
        accountName: '游戏主播阿强',
        accountDescription: '人气游戏主播，技术出众，解说专业，擅长多款热门游戏，粉丝活跃度高。每天固定直播时间4小时以上，直播间互动热烈，打赏收入稳定。',
        rentalPrice: 1500,
        rentalUnit: '小时',
        createTime: '2024-06-16 11:20:00',
        status: '审核不通过',
        imageUrl: '/images/douyin-logo.png',
        rejectReason: '请提供账号所有权证明文件和近期直播数据截图。账号信息需与实名认证信息一致。',
        rentalInfo: {
          rentalOrderNo: 'RENT20240621001',
          tenantName: '王五',
          startDate: '2024-06-25',
          endDate: '2024-06-28',
          amount: 2400
        },
        dataImages: [
         '/images/1758384598887_578.jpg',
          '/images/1758380776810_96.jpg'
        ]
      }
    ];

    // 查找匹配的出租信息
    const foundOffer = mockOffers.find(offer => offer.id === offerId) || mockOffers[0];
    // 确保账号类型为抖音
    const offerWithDouyinType = {
      ...foundOffer,
      accountType: '抖音',
      imageUrl: '/images/douyin-logo.png'
    };
    setOfferDetail(offerWithDouyinType);
  }, [offerId]);

  // 处理返回列表
  const handleBackToList = () => {
    router.push('/accountrental/my-account-rental/rentaloffer');
  };

  // 处理联系客服
  const handleContactService = () => {
    console.log('联系客服，出租ID:', offerId);
    alert('即将为您连接客服，请稍候...');
  };

  // 处理编辑出租
  const handleEditOffer = () => {
    setEditModalVisible(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    // 由于表单组件已删除，简化处理逻辑
    setEditModalVisible(false);
    message.success('出租信息已更新');
  };

  // 处理下架
  const handleOffShelf = () => {
    setOffShelfModalVisible(true);
  };

  // 处理确认下架
  const handleConfirmOffShelf = () => {
    console.log('下架出租信息:', offerId);
    setOffShelfModalVisible(false);
    // 更新本地状态模拟下架成功
    if (offerDetail) {
      setOfferDetail({
        ...offerDetail,
        status: '已下架'
      });
      message.success('出租信息已下架');
    }
  };

  // 处理重新上架
  const handleReList = () => {
    console.log('重新上架出租信息:', offerId);
    // 更新本地状态模拟重新上架成功
    if (offerDetail) {
      setOfferDetail({
        ...offerDetail,
        status: '待审核'
      });
      message.success('出租信息已提交重新审核');
    }
  };

  // 处理查看订单
  const handleViewOrder = () => {
    console.log('查看租赁订单');
    alert('查看租赁订单详情');
  };

  if (!offerDetail) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 pt-8">
      {/* 头部返回按钮 */}
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackToList}
          style={{ borderColor: '#000' }}
        >
          返回出租列表
        </Button>
      </div>

      {/* 出租信息卡片 */}
      <Card className="border-0 rounded-none mb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-2">出租信息详情</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">出租编号：{offerDetail.offerNo}</span>
              <span className="text-sm font-medium" style={{ color: getStatusTagColor(offerDetail.status) }}>
                {offerDetail.status}
              </span>
            </div>
          </div>
          <Button
            type="default"
            icon={<PhoneOutlined />}
            onClick={handleContactService}
            size="small"
            style={{ borderColor: '#000' }}
          >
            联系客服
          </Button>
        </div>

        {/* 出租基本信息 */}
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="账号类型">
            <div className="flex items-center">
              {offerDetail.imageUrl && (
                <img 
                  src={offerDetail.imageUrl} 
                  alt={offerDetail.accountType} 
                  className="w-8 h-8 mr-2"
                />
              )}
              {offerDetail.accountType}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="账号名称">{offerDetail.accountName}</Descriptions.Item>
          <Descriptions.Item label="账号描述">{offerDetail.accountDescription}</Descriptions.Item>
          <Descriptions.Item label="租赁价格">{offerDetail.rentalPrice} 元/{offerDetail.rentalUnit}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{offerDetail.createTime}</Descriptions.Item>
        </Descriptions>

        {/* 如果已租出，显示租赁信息 */}
        {offerDetail.status === '已租出' && offerDetail.rentalInfo && (
          <>
            <Divider orientation="left" orientationMargin={0} className="my-4">
              <span className="text-base">当前租赁信息</span>
            </Divider>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="租赁订单号">{offerDetail.rentalInfo.rentalOrderNo}</Descriptions.Item>
              <Descriptions.Item label="租户名称">{offerDetail.rentalInfo.tenantName}</Descriptions.Item>
              <Descriptions.Item label="租赁开始时间">{offerDetail.rentalInfo.startDate}</Descriptions.Item>
              <Descriptions.Item label="租赁结束时间">{offerDetail.rentalInfo.endDate}</Descriptions.Item>
              <Descriptions.Item label="租赁金额">¥{offerDetail.rentalInfo.amount}</Descriptions.Item>
            </Descriptions>
          </>
        )}

        {/* 如果审核不通过，显示失败原因 */}
        {offerDetail.status === '审核不通过' && offerDetail.rejectReason && (
          <>
            <Divider orientation="left" orientationMargin={0} className="my-4">
              <span className="text-base text-red-500">审核失败原因</span>
            </Divider>
            <div className="bg-red-50 p-4 border-l-4 border-red-400">
              <p className="text-sm text-red-600">{offerDetail.rejectReason}</p>
            </div>
          </>
        )}

        {/* 如果有数据展示图片，显示账号数据 */}
        {offerDetail.dataImages && offerDetail.dataImages.length > 0 && (
          <>
            <Divider orientation="left" orientationMargin={0} className="my-4">
              <span className="text-base">账号数据展示</span>
            </Divider>
            <div className="account-data-images">
              {offerDetail.dataImages.map((src, index) => (
                <div key={index} className="data-image-item">
                  <img 
                    src={src} 
                    alt={`账号数据截图 ${index + 1}`} 
                    className="data-screenshot"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* 操作按钮 */}
      <div className="bg-white p-4 flex justify-end">
        <Space>
          {(offerDetail.status === '已上架' || offerDetail.status === '待审核') && (
            <>
              <Button 
                type="primary" 
                onClick={handleEditOffer}
                icon={<EditOutlined />}
              >
                编辑出租
              </Button>
              <Button 
                danger 
                onClick={handleOffShelf}
                icon={<DeleteOutlined />}
              >
                下架出租
              </Button>
            </>
          )}

          {offerDetail.status === '已下架' && (
            <Button 
              type="primary" 
              onClick={handleReList}
            >
              重新上架
            </Button>
          )}

          {offerDetail.status === '已租出' && (
            <Button 
              type="default" 
              onClick={handleViewOrder}
              style={{ borderColor: '#000' }}
            >
              查看订单
            </Button>
          )}
        </Space>
      </div>

      {/* 编辑出租弹窗 */}
      <Modal
        title="编辑出租信息"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            保存
          </Button>
        ]}
      >
        <div className="p-4 text-center">
          <p>编辑功能正在开发中...</p>
        </div>
      </Modal>

      {/* 下架确认弹窗 */}
      <Modal
        title="下架出租"
        open={offShelfModalVisible}
        onOk={handleConfirmOffShelf}
        onCancel={() => setOffShelfModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setOffShelfModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" danger onClick={handleConfirmOffShelf}>
            确认下架
          </Button>
        ]}
      >
        <div className="flex items-center text-center py-4">
          <span>确定要下架该出租信息吗？下架后可重新上架。</span>
        </div>
      </Modal>
    </div>
  );
};

export default RentalOfferDetailPage;