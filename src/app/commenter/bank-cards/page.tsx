'use client';
import React, { useState } from 'react';
import { BankOutlined, WalletOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

// 定义银行卡数据接口
interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  cardHolderName: string;
  icon: React.ReactNode;
  type: 'debit' | 'credit';
}

export default function BankCardsPage() {
  const router = useRouter();
  
  // 模拟银行卡数据
  const [bankCards, setBankCards] = useState<BankCard[]>([
    {
      id: '1',
      bankName: '工商银行',
      cardNumber: '6222 **** **** **** 1234',
      cardHolderName: '王**',
      icon: <BankOutlined className="text-xl" />,
      type: 'debit'
    },
    {
      id: '2',
      bankName: '招商银行',
      cardNumber: '6225 **** **** **** 5678',
      cardHolderName: '王**',
      icon: <WalletOutlined className="text-xl" />,
      type: 'debit'
    }
  ]);

  // 跳转到银行卡详情页
  const viewCardDetails = (cardId: string) => {
    // 这里我们简化实现，实际上应该有一个专门的银行卡详情页面
    // 目前我们可以只打印信息或做其他操作
    console.log('查看银行卡详情:', cardId);
    // 如果需要，可以添加一个专门的详情页面，然后使用：
    // router.push(`/commenter/bank-cards/${cardId}`);
  };

  // 跳转到添加银行卡页面
  const navigateToBindCard = () => {
    router.push('/commenter/bind-bank-card');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-center h-16 relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-800">我的银行卡</h1>
          <div className="w-6 h-6 absolute right-4"></div> {/* 占位元素保持标题居中 */}
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="px-5 py-6">
        {/* 银行卡列表 */}
        <div className="space-y-4">
          {bankCards.length > 0 ? (
            bankCards.map((card) => (
              <button
                key={card.id}
                onClick={() => viewCardDetails(card.id)}
                className="w-full bg-white rounded-xl shadow-sm p-5 transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{card.icon}</span>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{card.bankName}</h3>
                      <p className="text-xs text-gray-500">{card.cardHolderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">储蓄卡</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-lg font-medium text-gray-800">{card.cardNumber}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-6">您还没有绑定银行卡</p>
              <button
                onClick={navigateToBindCard}
                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                添加银行卡
              </button>
            </div>
          )}
        </div>

        {/* 添加银行卡按钮 - 仅在有银行卡时显示 */}
        {bankCards.length > 0 && (
          <div className="mt-6">
            <button
              onClick={navigateToBindCard}
              className="w-full py-3 bg-white text-blue-500 border border-blue-500 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              + 添加银行卡
            </button>
          </div>
        )}

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            为保障您的资金安全，我们采用银行级加密技术<br />
            您的银行卡信息仅用于身份验证和提现
          </p>
        </div>
      </div>
    </div>
  );
}