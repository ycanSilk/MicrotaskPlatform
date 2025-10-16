'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 平台类型接口
interface PlatformType {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  popular: boolean;
}

// 平台类型数据
const PLATFORM_TYPES: PlatformType[] = [
  {
    id: 'personal',
    title: '个人账号',
    description: '适合个人品牌推广和日常内容创作',
    priceRange: '¥30-100/天',
    popular: true
  },
  {
    id: 'business',
    title: '企业账号',
    description: '适合企业品牌营销和产品推广',
    priceRange: '¥100-500/天',
    popular: false
  },
  {
    id: 'expert',
    title: '专业账号',
    description: '特定领域的专业创作者账号',
    priceRange: '¥200-1000/天',
    popular: false
  }
];

const PlatformTypeSelection = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      // 跳转到下一步
      router.push('/accountrental/account-rental-publish/publish-form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">选择账号类型</h1>
        <p className="text-gray-600 mb-6">请选择您需要租用的账号类型</p>

        {/* 平台类型卡片列表 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PLATFORM_TYPES.map((type) => (
            <div
              key={type.id}
              className={`
                bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer
                ${selectedType === type.id 
                  ? 'border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-300'}
              `}
              onClick={() => handleSelectType(type.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                  {type.popular && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      热门
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="text-blue-600 font-medium">{type.priceRange}</div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="w-full flex items-center">
                  <span className="text-sm text-gray-500 mr-2">选择</span>
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center
                    ${selectedType === type.id 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white border border-gray-300'}
                  `}>
                    {selectedType === type.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 继续按钮 */}
        <div className="flex justify-end">
          <button
            className={`
              bg-blue-500 text-white px-6 py-3 rounded-lg font-medium
              ${selectedType ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}
            `}
            onClick={handleContinue}
            disabled={!selectedType}
          >
            继续
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformTypeSelection;