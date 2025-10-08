'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCardOutlined } from '@ant-design/icons';
// 定义银行卡数据接口
interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  cardType: string;
  icon: string;
  bgColor: string;
  hasActivity?: boolean;
  canCheckBalance?: boolean;
}

export default function BankCardsPage() {
  const router = useRouter();
  
  // 模拟银行卡数据 - 更新为与图片匹配的数据
  const [bankCards, setBankCards] = useState<BankCard[]>([
    {
      id: '1',
      bankName: '邮储银行',
      cardNumber: '6226 **** **** **** 0541',
      cardType: '储蓄卡',
      icon: '🏦',
      bgColor: 'bg-green-500',
      hasActivity: true
    },
    {
      id: '2',
      bankName: '招商银行',
      cardNumber: '6225 **** **** **** 0280',
      cardType: '信用卡',
      icon: '💼',
      bgColor: 'bg-red-500'
    },
    {
      id: '3',
      bankName: '中国银行',
      cardNumber: '6216 **** **** **** 8934',
      cardType: '储蓄卡',
      icon: '🏛️',
      bgColor: 'bg-red-500',
      hasActivity: true,
      canCheckBalance: true
    },
    {
      id: '4',
      bankName: '广发银行',
      cardNumber: '6225 **** **** **** 4673',
      cardType: '储蓄卡',
      icon: '🏢',
      bgColor: 'bg-red-500'
    },
    {
      id: '5',
      bankName: '招商银行',
      cardNumber: '6225 **** **** **** 1593',
      cardType: '储蓄卡',
      icon: '💼',
      bgColor: 'bg-red-500'
    }
  ]);

  // 跳转到银行卡详情页
  const viewCardDetails = (cardId: string) => {
    router.push(`/publisher/bank-cards/bank-cardlist/${cardId}`);
  };

  // 跳转到添加银行卡页面
  const navigateToBindCard = () => {
    router.push('/publisher/bind-bank-card');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center h-16 px-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600"
            aria-label="返回"
          >
            <div className="">
              <CreditCardOutlined className="h-7 w-7 text-white text-xl" />
            </div>
          </button>
          <h1 className="flex-1 text-center text-lg font-medium text-gray-800">银行卡</h1>
          <button
            className="p-2 -mr-2 text-gray-600"
            aria-label="更多选项"
          >
            <div className="">
              <CreditCardOutlined className="h-7 w-7 text-white text-xl" />
            </div>
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="px-10 py-3">
        {/* 银行卡列表 */}
        <div className="space-y-4">
          {bankCards.map((card) => (
            <button
              key={card.id}
              onClick={() => viewCardDetails(card.id)}
              className="w-full rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg"
              aria-label={`查看${card.bankName}${card.cardType}详情`}
            >
              {/* 银行卡卡片 */}
              <div className={`${card.bgColor} p-5 text-white relative overflow-hidden`}>
                {/* 银行Logo和名称 */}
                <div className="flex items-center justify-between mb-3">
                 <div className="flex mb-3">
                    <CreditCardOutlined className="h-7 w-7 text-white text-xl mr-2" />
                    <div>
                      <h3 className="text-xl font-medium text-left">{card.bankName}</h3>
                      <p className="text-xs text-left">{card.cardType}</p>
                    </div>
                  </div>
                </div>
                
                {/* 卡号 */}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium tracking-wider">{card.cardNumber}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 添加银行卡按钮 */}
        <div className="mt-6">
          <button
            onClick={navigateToBindCard}
            className="w-full py-4 bg-white rounded-xl shadow-sm flex items-center justify-center space-x-2  font-medium transition-colors hover:bg-blue-500 hover:text-white"
          >
            <span className="text-lg">+</span>
            <span>添加银行卡</span>
          </button>
        </div>
      </div>
    </div>
  );
}