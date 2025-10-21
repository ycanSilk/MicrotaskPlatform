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
  rentalDuration: string; // 新增租赁时长字段
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
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  // 编辑表单状态
  const [editForm, setEditForm] = useState({
    accountName: '',
    accountDescription: '',
    rentalPrice: '',
    rentalDuration: '', // 新增租赁时长字段，删除租赁单位
    dataImages: [] as string[]
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
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
        rentalDuration: '可租赁3-7天', // 新增租赁时长
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
        rentalDuration: '可租赁1-14天', // 新增租赁时长
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
        rentalDuration: '每次至少2小时，最长8小时', // 新增租赁时长
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
    if (offerDetail) {
      // 初始化编辑表单数据
      setEditForm({
        accountName: offerDetail.accountName,
        accountDescription: offerDetail.accountDescription,
        rentalPrice: offerDetail.rentalPrice.toString(),
        rentalDuration: offerDetail.rentalDuration || '', // 初始化租赁时长，删除租赁单位
        dataImages: offerDetail.dataImages || []
      });
    }
    setEditModalVisible(true);
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // 处理图片选择
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      // 这里应该上传图片到服务器，这里简化处理
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setEditForm(prev => ({
        ...prev,
        dataImages: [...prev.dataImages, imageUrl]
      }));
      // 清空input，允许选择相同文件
      e.target.value = '';
    }
  };

  // 处理删除图片
  const handleDeleteImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      dataImages: prev.dataImages.filter((_, i) => i !== index)
    }));
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    // 验证表单
    if (!editForm.accountName || !editForm.accountDescription || !editForm.rentalPrice || !editForm.rentalDuration) {
      message.error('请填写必填信息');
      return;
    }
    
    // 这里应该是实际的API调用，这里使用本地状态更新模拟
    if (offerDetail) {
      const updatedOffer = {
        ...offerDetail,
        accountName: editForm.accountName,
        accountDescription: editForm.accountDescription,
        rentalPrice: parseFloat(editForm.rentalPrice),
        rentalDuration: editForm.rentalDuration, // 更新租赁时长，保留原租赁单位
        dataImages: editForm.dataImages
      };
      setOfferDetail(updatedOffer);
    }
    
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
    
    // 如果有租赁信息，先取消订单
    if (offerDetail && offerDetail.rentalInfo) {
      console.log('取消租赁订单:', offerDetail.rentalInfo.rentalOrderNo);
      // 这里应该是实际的API调用取消订单
      message.info('租赁订单已取消');
    }
    
    // 更新本地状态模拟下架成功，同时删除相关数据
    if (offerDetail) {
      setOfferDetail({
        ...offerDetail,
        status: '已下架',
        rentalInfo: undefined, // 删除租赁信息
        dataImages: [] // 删除图片数据
      });
      message.success('出租信息已下架，相关数据已清理');
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

  // 处理图片点击查看大图
  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  if (!offerDetail) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 pt-8">
      {/* 出租信息卡片 */}
      <Card className="border-0 rounded-none mb-4">
        <div className="flex items-center">出租编号：{offerDetail.offerNo}</div>
        <div className='my-1'><span className='py-1 px-2 border border-red-500 rounded-md text-xs'>状态：{offerDetail.status}</span></div>
        <div className="text-lg">出租信息详情:</div>
        {/* 出租基本信息 */}
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">账号类型</td>
              <td className="p-3 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">
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
              </td>
            </tr>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">账号名称</td>
              <td className="p-3 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">{offerDetail.accountName}</td>
            </tr>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">账号描述</td>
              <td className="p-3 border border-gray-200 line-clamp-3">{offerDetail.accountDescription}</td>
            </tr>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁价格</td>
              <td className="p-3 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">{offerDetail.rentalPrice} 元/{offerDetail.rentalUnit}</td>
            </tr>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁时长</td>
              <td className="p-3 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">{offerDetail.rentalDuration}</td>
            </tr>
            <tr className="border border-gray-200">
              <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">发布时间</td>
              <td className="p-3 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">{offerDetail.createTime}</td>
            </tr>
          </tbody>
        </table>

        {/* 如果已租出，显示租赁信息 */}
        {offerDetail.status === '已租出' && offerDetail.rentalInfo && (
          <>
            <Divider orientation="left" orientationMargin={0} className="my-4">
              <span className="text-base">当前租赁信息</span>
            </Divider>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border border-gray-200">
                  <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁订单号</td>
                  <td className="p-3 border border-gray-200">{offerDetail.rentalInfo.rentalOrderNo}</td>
                </tr>
                <tr className="border border-gray-200">
                  <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租户名称</td>
                  <td className="p-3 border border-gray-200">{offerDetail.rentalInfo.tenantName}</td>
                </tr>
                <tr className="border border-gray-200">
                  <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁开始时间</td>
                  <td className="p-3 border border-gray-200">{offerDetail.rentalInfo.startDate}</td>
                </tr>
                <tr className="border border-gray-200">
                  <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁结束时间</td>
                  <td className="p-3 border border-gray-200">{offerDetail.rentalInfo.endDate}</td>
                </tr>
                <tr className="border border-gray-200">
                  <td className="w-1/4 p-3 bg-gray-50 border-r border-gray-200 font-medium">租赁金额</td>
                  <td className="p-3 border border-gray-200">¥{offerDetail.rentalInfo.amount}</td>
                </tr>
              </tbody>
            </table>
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
              <span className="text-base">图片展示</span>
            </Divider>
            <div className="flex flex-wrap gap-3">
              {offerDetail.dataImages.map((src, index) => (
                <div 
                  key={index} 
                  className="w-20 h-20 bg-gray-100 overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(src)}
                >
                  <img 
                    src={src} 
                    alt={`账号数据截图 ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    style={{ width: '85px', height: '85px' }}
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
        <div className="space-y-4">
          {/* 账号名称 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">账号名称 *</label>
            <input
              type="text"
              name="accountName"
              value={editForm.accountName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入账号名称"
            />
          </div>
          
          {/* 账号描述 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">账号描述 *</label>
            <textarea
              name="accountDescription"
              value={editForm.accountDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入账号描述"
              rows={4}
            />
          </div>
          
          {/* 租赁价格 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">租赁价格 *</label>
            <div className="flex items-center">
              <input
                type="number"
                name="rentalPrice"
                value={editForm.rentalPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入租赁价格"
                min="0"
                step="0.01"
              />
              <span className="ml-2 text-gray-500">元</span>
            </div>
          </div>
          
          {/* 租赁时长 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">租赁时长 *</label>
            <input
              type="text"
              name="rentalDuration"
              value={editForm.rentalDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="例如：可租赁1-7天，每次至少2小时等"
            />
            <p className="text-xs text-gray-500 mt-1">请清晰描述租赁时长规则，如适用期限、最短/最长租赁时间等</p>
          </div>
          
          {/* 图片上传与展示 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">账号数据图片</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {editForm.dataImages.map((src, index) => (
                <div key={index} className="relative">
                  <img 
                    src={src} 
                    alt={`账号数据截图 ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <label htmlFor="imageUpload">
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">上传图片</span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500">点击图片缩略图可删除图片，点击上传按钮添加新图片</p>
          </div>
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

      {/* 图片预览Modal */}
      <Modal
        title="图片预览"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img 
          src={previewImage} 
          alt="预览图片" 
          className="w-full h-auto max-h-[70vh] object-contain" 
        />
      </Modal>
    </div>
  );
};

export default RentalOfferDetailPage;