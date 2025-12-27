
import React from 'react';
import { BankName, BankOffer } from './types';

export const MOCK_OFFERS: BankOffer[] = [
  {
    id: '1',
    bank: BankName.ICBC,
    title: '工行立减金大转盘',
    description: '每日登录抽最高50元微信立减金。',
    category: 'Lottery',
    status: 'active',
    expiryDate: '2024-12-31',
    estimatedValue: 5,
    steps: ['登录工行App', '搜索“任务中心”', '完成签到', '点击大转盘']
  },
  {
    id: '2',
    bank: BankName.CCB,
    title: '建行惠省钱红包',
    description: '通过数字人民币消费返现，最高领取88元。',
    category: 'Cashback',
    status: 'active',
    expiryDate: '2024-11-20',
    estimatedValue: 12,
    steps: ['打开建行App', '点击“惠省钱”', '完成支付任务', '领取立减金']
  },
  {
    id: '3',
    bank: BankName.CMB,
    title: '招行9分招米红包',
    description: '9积分兑换视频会员或美食券。',
    category: 'Coupon',
    status: 'active',
    expiryDate: '2024-12-15',
    estimatedValue: 15,
    steps: ['掌上生活App', '点击“精选”', '搜索“9分”', '立即兑换']
  }
];

export const BANK_THEMES: Record<BankName, { color: string, bg: string }> = {
  [BankName.ICBC]: { color: 'text-red-600', bg: 'bg-red-50' },
  [BankName.CCB]: { color: 'text-blue-600', bg: 'bg-blue-50' },
  [BankName.ABC]: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  [BankName.BOC]: { color: 'text-red-700', bg: 'bg-red-100' },
  [BankName.CMB]: { color: 'text-red-500', bg: 'bg-red-50' },
  [BankName.COMM]: { color: 'text-blue-800', bg: 'bg-blue-50' },
  [BankName.PSBC]: { color: 'text-green-700', bg: 'bg-green-50' },
};
