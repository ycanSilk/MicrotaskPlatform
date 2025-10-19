'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Space, Avatar, Descriptions, Divider, Tabs, Modal, Form, Input, InputNumber, Select, message, Image, Badge, List } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TabsProps } from 'antd';

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
  followersCount: string;
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
  const [form] = Form.useForm();
  
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
        followersCount: '12.5万',
        accountDescription: '专注美食领域，以制作精致的餐厅探店和美食测评视频为主，互动率高，粉丝粘性强。主要内容包括热门餐厅探店、美食制作教程、特色小吃推荐等。账号粉丝主要为20-35岁的年轻人群，对美食有较高的热情和消费能力。',
        rentalPrice: 800,
        rentalUnit: '天',
        createTime: '2024-06-20 10:30:00',
        status: '已上架',
        imageUrl: '/images/douyin-logo.png',
        dataImages: [
          '/images/data-chart1.png',
          '/images/data-chart2.png',
          '/images/data-chart3.png'
        ]
      },
      {
        id: '2',
        offerNo: 'OFFER20240619002',
        userName: '李四',
        userId: 'USER234567',
        accountType: '小红书',
        accountName: '美妆博主小D',
        followersCount: '8.3万',
        accountDescription: '专业美妆博主，擅长口红试色和妆容教程，粉丝多为年轻女性，互动积极。主要分享美妆技巧、产品测评、妆容教程等内容，内容风格清新自然，推荐产品性价比高，深受粉丝信赖。',
        rentalPrice: 600,
        rentalUnit: '天',
        createTime: '2024-06-19 15:20:00',
        status: '已租出',
        imageUrl: '/images/xiaohongshu-logo.png',
        rentalInfo: {
          rentalOrderNo: 'RENT20240621001',
          tenantName: '王五',
          startDate: '2024-06-25',
          endDate: '2024-06-28',
          amount: 2400
        },
        dataImages: [
          '/images/data-chart1.png',
          '/images/data-chart2.png'
        ]
      },
      {
        id: '3',
        offerNo: 'OFFER20240618003',
        userName: '王五',
        userId: 'USER345678',
        accountType: '微博',
        accountName: '旅行家李明',
        followersCount: '62.3万',
        accountDescription: '知名旅游博主，以高质量旅行攻略和目的地推荐著称，内容专业详实。曾获旅游行业多项大奖，多篇攻略被官方旅游局转载推荐。粉丝群体覆盖广泛，以25-45岁中高收入人群为主。',
        rentalPrice: 2000,
        rentalUnit: '天',
        createTime: '2024-06-18 09:15:00',
        status: '已上架',
        imageUrl: '/images/0e92a4599d02a7.jpg',
        dataImages: [
          '/images/data-chart1.png',
          '/images/data-chart2.png',
          '/images/data-chart3.png',
          '/images/data-chart4.png'
        ]
      },
      {
        id: '4',
        offerNo: 'OFFER20240617004',
        userName: '赵六',
        userId: 'USER456789',
        accountType: '快手',
        accountName: '搞笑视频创作者小王',
        followersCount: '35.7万',
        accountDescription: '擅长制作轻松幽默的短视频内容，搞笑段子和生活喜剧为主，深受年轻用户喜爱。内容风格轻松活泼，传播性强，平均每条视频播放量超过50万。',
        rentalPrice: 1200,
        rentalUnit: '天',
        createTime: '2024-06-17 14:30:00',
        status: '待审核',
        imageUrl: '/images/kuaishou-logo.png'
      },
      {
        id: '5',
        offerNo: 'OFFER20240616005',
        userName: '钱七',
        userId: 'USER567890',
        accountType: '抖音',
        accountName: '游戏主播阿强',
        followersCount: '42.1万',
        accountDescription: '人气游戏主播，技术出众，解说专业，擅长多款热门游戏，粉丝活跃度高。每天固定直播时间4小时以上，直播间互动热烈，打赏收入稳定。',
        rentalPrice: 1500,
        rentalUnit: '小时',
        createTime: '2024-06-16 11:20:00',
        status: '审核不通过',
        imageUrl: '/images/douyin-logo.png',
        rejectReason: '请提供账号所有权证明文件和近期直播数据截图。账号信息需与实名认证信息一致。'
      }
    ];

    // 查找匹配的出租信息
    const foundOffer = mockOffers.find(offer => offer.id === offerId) || mockOffers[0];
    setOfferDetail(foundOffer);
    
    // 初始化表单数据
    form.setFieldsValue({
      accountType: foundOffer.accountType,
      accountName: foundOffer.accountName,
      followersCount: foundOffer.followersCount,
      accountDescription: foundOffer.accountDescription,
      rentalPrice: foundOffer.rentalPrice,
      rentalUnit: foundOffer.rentalUnit
    });
  }, [offerId, form]);

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
    form.validateFields().then(values => {
      console.log('保存编辑:', values);
      setEditModalVisible(false);
      // 更新本地状态模拟编辑成功
      if (offerDetail) {
        const updatedOffer = {
          ...offerDetail,
          ...values
        };
        setOfferDetail(updatedOffer);
        message.success('出租信息已更新');
      }
    });
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
          <Descriptions.Item label="粉丝数量">{offerDetail.followersCount}</Descriptions.Item>
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
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={offerDetail.dataImages}
              renderItem={(src) => (
                <List.Item>
                  <Image
                    width={200}
                    height={120}
                    src={src}
                    alt="账号数据"
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Card>

      {/* 操作按钮 */}
      <div className="bg-white p-4 flex justify-end">
        <Space>
          {(offerDetail.status === '待审核' || offerDetail.status === '审核不通过' || offerDetail.status === '已上架') && (
            <Button 
              type="default" 
              onClick={handleEditOffer}
              icon={<EditOutlined />}
              style={{ borderColor: '#000' }}
            >
              编辑出租
            </Button>
          )}

          {offerDetail.status === '已上架' && (
            <Button 
              danger 
              onClick={handleOffShelf}
              icon={<DeleteOutlined />}
            >
              下架
            </Button>
          )}

          {offerDetail.status === '已下架' && (
            <Button 
              type="primary" 
              onClick={handleReList}
              icon={<CheckCircleOutlined />}
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
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="accountType"
            label="账号类型"
            rules={[{ required: true, message: '请选择账号类型' }]}
          >
            <Select placeholder="请选择账号类型">
              <Select.Option value="抖音">抖音</Select.Option>
              <Select.Option value="小红书">小红书</Select.Option>
              <Select.Option value="微博">微博</Select.Option>
              <Select.Option value="快手">快手</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="accountName"
            label="账号名称"
            rules={[{ required: true, message: '请填写账号名称' }]}
          >
            <Input placeholder="请填写账号名称" />
          </Form.Item>
          
          <Form.Item
            name="followersCount"
            label="粉丝数量"
            rules={[{ required: true, message: '请填写粉丝数量' }]}
          >
            <Input placeholder="例如：10万" />
          </Form.Item>
          
          <Form.Item
            name="accountDescription"
            label="账号描述"
            rules={[{ required: true, message: '请填写账号描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述您的账号特色和内容风格" />
          </Form.Item>
          
          <div className="flex gap-2">
            <Form.Item
              name="rentalPrice"
              label="租赁价格"
              rules={[{ required: true, message: '请填写租赁价格' }]}
              className="flex-1 mb-0"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="元" />
            </Form.Item>
            
            <Form.Item
              name="rentalUnit"
              label="单位"
              rules={[{ required: true, message: '请选择租赁单位' }]}
              className="flex-[0.5] mb-0"
            >
              <Select placeholder="选择单位">
                <Select.Option value="天">天</Select.Option>
                <Select.Option value="小时">小时</Select.Option>
                <Select.Option value="次">次</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            label="上传数据截图（可选）"
          >
            <Button
              icon={<UploadOutlined />}
              size="small"
            >
              上传图片
            </Button>
            <p className="text-xs text-gray-500 mt-1">支持JPG、PNG格式，最多上传5张</p>
          </Form.Item>
        </Form>
      </Modal>

      {/* 下架确认弹窗 */}
      <Modal
        title="下架出租信息"
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
          <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px', marginRight: '12px' }} />
          <span>确定要下架该出租信息吗？下架后可以重新上架。</span>
        </div>
      </Modal>
    </div>
  );
};

export default RentalOfferDetailPage;