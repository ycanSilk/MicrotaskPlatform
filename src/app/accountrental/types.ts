import React from 'react';

// 账号租赁信息接口定义
export interface AccountRentalInfo {
  id: string;
  platform: string;
  platformIcon: React.ReactNode;
  accountTitle: string;
  followersRange: string;
  engagementRate: string;
  contentCategory: string;
  region: string;
  accountAge: string;
  accountScore: number;
  orderPrice: number;
  price: number;
  rentalDuration: number;
  minimumRentalHours: number;
  deliveryTime: number;
  maxConcurrentUsers: number;
  responseTime: number;
  includedFeatures: string[];
  description: string;
  advantages: string[];
  restrictions: string[];
  isVerified?: boolean;
  rating?: number;
  rentalCount?: number;
  availableCount?: number;
  publishTime?: string;
  status: 'active' | 'inactive' | 'pending';
  images?: string[];
  publisherName?: string;
}