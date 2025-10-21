'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Space, Avatar, Descriptions, Divider, Tabs, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TabsProps } from 'antd';

// 求租信息状态类型
type RentalRequestStatus = '待匹配' | '已匹配' | '已完成' | '已取消';

// 求租信息接口
interface RentalRequest {
  id: string;
  requestNo: string;
  userName: string;
  userId: string;
  accountType: string;
  accountDescription: string;
  requiredFollowers: string;
  rentalDays: number;
  budget: number;
  createTime: string;
  status: RentalRequestStatus;
  imageUrl?: string;
  // 匹配信息（如果已匹配）
  matchedAccount?: {
    accountId: string;
    accountName: string;
    accountOwner: string;
    followers: string;
    startDate: string;
    endDate: string;
  };
}

// 获取状态对应的标签颜色
const getStatusTagColor = (status: RentalRequestStatus): string => {
  const statusColors = {
    '待匹配': 'blue',
    '已匹配': 'orange',
    '已完成': 'green',
    '已取消': 'red'
  };
  return statusColors[status];
};

const RentalRequestDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams?.get('id');
  const [requestDetail, setRequestDetail] = useState<RentalRequest | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 模拟从API获取求租详情
  useEffect(() => {
    // 这里应该是实际API调用，这里使用模拟数据
    const mockRequests: RentalRequest[] = [
      {
        id: '1',
        requestNo: 'REQ20240620001',
        userName: '张三',
        userId: 'USER123456',
        accountType: '抖音',
        accountDescription: '需要一个拥有10万+粉丝的美食类抖音账号，用于推广新餐厅开业活动，要求互动率高，评论区活跃。希望博主能够制作高质量的短视频内容，展示餐厅的特色菜品、环境和服务，吸引目标客户群体。',
        requiredFollowers: '10万以上',
        rentalDays: 5,
        budget: 3000,
        createTime: '2024-06-20 10:30:00',
        status: '待匹配',
        imageUrl: '/images/douyin-logo.png'
      },
      {
        id: '2',
        requestNo: 'REQ20240619002',
        userName: '李四',
        userId: 'USER234567',
        accountType: '小红书',
        accountDescription: '寻找美妆类小红书达人账号，推广新品口红，需要有详细的产品展示和真实使用效果分享。要求博主能够突出产品的质地、颜色效果和持久度等特点，最好能够提供多场景的使用展示。',
        requiredFollowers: '5万-10万',
        rentalDays: 3,
        budget: 1500,
        createTime: '2024-06-19 15:20:00',
        status: '已匹配',
        imageUrl: '/images/xiaohongshu-logo.png',
        matchedAccount: {
          accountId: 'ACCT001',
          accountName: '美妆达人小C',
          accountOwner: '陈小姐',
          followers: '8.5万',
          startDate: '2024-06-25',
          endDate: '2024-06-28'
        }
      },
      {
        id: '3',
        requestNo: 'REQ20240618003',
        userName: '王五',
        userId: 'USER345678',
        accountType: '微博',
        accountDescription: '需要知名旅游博主账号发布目的地推荐，要求图文并茂，内容质量高。希望博主能够分享旅行攻略、景点介绍、特色美食和住宿推荐等内容，帮助读者规划旅行。',
        requiredFollowers: '50万以上',
        rentalDays: 2,
        budget: 5000,
        createTime: '2024-06-18 09:15:00',
        status: '已完成',
        imageUrl: '/images/0e92a4599d02a7.jpg',
        matchedAccount: {
          accountId: 'ACCT002',
          accountName: '旅行家李明',
          accountOwner: '李先生',
          followers: '62.3万',
          startDate: '2024-06-22',
          endDate: '2024-06-24'
        }
      },
      {
        id: '4',
        requestNo: 'REQ20240617004',
        userName: '赵六',
        userId: 'USER456789',
        accountType: '快手',
        accountDescription: '寻找搞笑视频创作者账号，推广新游戏上线活动，要求内容幽默有趣。希望通过轻松幽默的方式展示游戏的玩法和亮点，吸引玩家关注和下载游戏。',
        requiredFollowers: '10万-50万',
        rentalDays: 7,
        budget: 2500,
        createTime: '2024-06-17 14:30:00',
        status: '已取消',
        imageUrl: '/images/kuaishou-logo.png'
      }
    ];

    // 查找匹配的请求
    const foundRequest = mockRequests.find(req => req.id === requestId) || mockRequests[0];
    setRequestDetail(foundRequest);
    
    // 初始化表单数据
    form.setFieldsValue({
      accountType: foundRequest.accountType,
      accountDescription: foundRequest.accountDescription,
      requiredFollowers: foundRequest.requiredFollowers,
      rentalDays: foundRequest.rentalDays,
      budget: foundRequest.budget
    });
  }, [requestId, form]);

  // 处理返回列表
  const handleBackToList = () => {
    router.push('/accountrental/my-account-rental/rentalrequest');
  };

  // 处理联系客服
  const handleContactService = () => {
    console.log('联系客服，求租ID:', requestId);
    alert('即将为您连接客服，请稍候...');
  };

  // 处理编辑求租
  const handleEditRequest = () => {
    setEditModalVisible(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    form.validateFields().then(values => {
      console.log('保存编辑:', values);
      setEditModalVisible(false);
      // 更新本地状态模拟编辑成功
      if (requestDetail) {
        const updatedRequest = {
          ...requestDetail,
          ...values
        };
        setRequestDetail(updatedRequest);
        message.success('求租信息已更新');
      }
    });
  };

  // 处理取消求租
  const handleDeleteRequest = () => {
    setDeleteModalVisible(true);
  };

  // 处理确认取消
  const handleConfirmDelete = () => {
    console.log('取消求租:', requestId);
    setDeleteModalVisible(false);
    // 更新本地状态模拟取消成功
    if (requestDetail) {
      setRequestDetail({
        ...requestDetail,
        status: '已取消'
      });
      message.success('求租信息已取消');
    }
  };

  // 处理查看匹配账号
  const handleViewMatchedAccount = () => {
    console.log('查看匹配账号');
    alert('查看匹配账号详情');
  };

  // 处理评价服务
  const handleEvaluateService = () => {
    console.log('评价服务');
    alert('评价服务功能');
  };

  if (!requestDetail) {
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
          返回求租列表
        </Button>
      </div>

      {/* 求租信息卡片 */}
      <Card className="border-0 rounded-none mb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-2">求租信息详情</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">求租编号：{requestDetail.requestNo}</span>
              <span className="text-sm font-medium" style={{ color: getStatusTagColor(requestDetail.status) }}>
                {requestDetail.status}
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

        {/* 求租基本信息 */}
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="账号类型">
            <div className="flex items-center">
              {requestDetail.imageUrl && (
                <img 
                  src={requestDetail.imageUrl} 
                  alt={requestDetail.accountType} 
                  className="w-8 h-8 mr-2"
                />
              )}
              {requestDetail.accountType}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="账号要求">{requestDetail.accountDescription}</Descriptions.Item>
          <Descriptions.Item label="租赁时长">{requestDetail.rentalDays} 天</Descriptions.Item>
          <Descriptions.Item label="预算">¥{requestDetail.budget}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{requestDetail.createTime}</Descriptions.Item>
        </Descriptions>

        {/* 如果已匹配，显示匹配信息 */}
        {requestDetail.status !== '待匹配' && requestDetail.status !== '已取消' && requestDetail.matchedAccount && (
          <>
            <Divider orientation="left" orientationMargin={0} className="my-4">
              <span className="text-base">匹配信息</span>
            </Divider>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="匹配账号名称">{requestDetail.matchedAccount.accountName}</Descriptions.Item>
              <Descriptions.Item label="账号所有者">{requestDetail.matchedAccount.accountOwner}</Descriptions.Item>
              <Descriptions.Item label="租赁开始时间">{requestDetail.matchedAccount.startDate}</Descriptions.Item>
              <Descriptions.Item label="租赁结束时间">{requestDetail.matchedAccount.endDate}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      {/* 操作按钮 */}
      <div className="bg-white p-4 flex justify-end">
        <Space>
          {requestDetail.status === '待匹配' && (
            <>
              <Button 
                type="primary" 
                onClick={handleEditRequest}
                icon={<EditOutlined />}
              >
                编辑求租
              </Button>
              <Button 
                danger 
                onClick={handleDeleteRequest}
                icon={<DeleteOutlined />}
              >
                取消求租
              </Button>
            </>
          )}

          {requestDetail.status === '已匹配' && (
            <Button 
              type="default" 
              onClick={handleViewMatchedAccount}
              style={{ borderColor: '#000' }}
            >
              查看匹配账号
            </Button>
          )}

          {requestDetail.status === '已完成' && (
            <Button 
              type="default" 
              onClick={handleEvaluateService}
              style={{ borderColor: '#000' }}
            >
              评价服务
            </Button>
          )}
        </Space>
      </div>

      {/* 编辑求租弹窗 */}
      <Modal
        title="编辑求租信息"
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
            </Select>
          </Form.Item>
          
          <Form.Item
            name="accountDescription"
            label="账号要求详情"
            rules={[{ required: true, message: '请填写账号要求详情' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述您对账号的要求" />
          </Form.Item> 
          
          <Form.Item
            name="rentalDays"
            label="租赁时长"
            rules={[{ required: true, message: '请填写租赁时长' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="天" addonAfter="天" />
          </Form.Item>
          
          <Form.Item
            name="budget"
            label="预算"
            rules={[{ required: true, message: '请填写预算' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="元" addonBefore="¥" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 取消求租确认弹窗 */}
      <Modal
        title="取消求租"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" danger onClick={handleConfirmDelete}>
            确认取消
          </Button>
        ]}
      >
        <div className="flex items-center text-center py-4">
          <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px', marginRight: '12px' }} />
          <span>确定要取消该求租信息吗？取消后将无法恢复。</span>
        </div>
      </Modal>
    </div>
  );
};

export default RentalRequestDetailPage;