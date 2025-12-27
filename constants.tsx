
import React from 'react';
import { BankName, BankOffer } from './types';

export const MOCK_OFFERS: BankOffer[] = [
  // 工商银行
  {
    id: 'icbc-1',
    bank: BankName.ICBC,
    title: '工行消费季：天天抽i豆',
    description: '每天8点开始抽i豆，一直到月底，最高可得2000-10000豆。',
    category: 'Lottery',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 2, // Average daily
    steps: ['工行App', '搜索“任务中心”', '找到“工行消费季”', '每日抽奖']
  },
  {
    id: 'icbc-2',
    bank: BankName.ICBC,
    title: '爱购星期五',
    description: '每周五抽立减金，限深圳地区信用卡用户尝试。',
    category: 'Lottery',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 5,
    steps: ['工行App', '搜索“爱购星期五”', '周五参与']
  },

  // 建设银行
  {
    id: 'ccb-1',
    bank: BankName.CCB,
    title: '建行惠省钱：随机立减金',
    description: '最低可0.01元购36元立减金券包，找车头还能再反2元左右。',
    category: 'Coupon',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 36,
    steps: ['建行App', '搜索“惠省钱”', '抽取购买资格']
  },
  {
    id: 'ccb-2',
    bank: BankName.CCB,
    title: '任务中心：开宝箱',
    description: '签到做任务，1000积分开一次，近期很容易拿到100立减金。',
    category: 'Lottery',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 10,
    steps: ['建行App', '底部“会员中心”', '点击“开宝箱”']
  },

  // 招商银行
  {
    id: 'cmb-1',
    bank: BankName.CMB,
    title: 'M+会员：每月领还款金',
    description: 'M+会员每月1号10点抢还款金/返现券，2号10点抢黄金红包。',
    category: 'Cashback',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 10,
    steps: ['招商银行App', '搜索“M+会员”', '每月1号/2号准时参与']
  },
  {
    id: 'cmb-2',
    bank: BankName.CMB,
    title: '9分便民兑',
    description: '掌上生活9积分兑换视频会员、美食券等。',
    category: 'Points',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 15,
    steps: ['掌上生活App', '我的-积分', '9分兑换专区']
  },

  // 中国银行
  {
    id: 'boc-1',
    bank: BankName.BOC,
    title: '福仔云游记',
    description: '参与云游记游戏，兑换微信立减金。',
    category: 'Lottery',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 5,
    steps: ['中国银行App', '搜索“福仔云游记”', '做任务攒道具']
  },
  {
    id: 'boc-2',
    bank: BankName.BOC,
    title: '京东月月领券',
    description: '京东金融App内搜索“中行”领取，每月8-4元券等。',
    category: 'Coupon',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 8,
    steps: ['京东App', '搜索“中国银行”', '领取月月券']
  },

  // 农业银行
  {
    id: 'abc-1',
    bank: BankName.ABC,
    title: '数字人民币领红包',
    description: '热门活动，缤纷购物节，领10元红包，叠加最低0撸。',
    category: 'Cashback',
    status: 'active',
    expiryDate: '2026-06-30',
    estimatedValue: 10,
    steps: ['农行App', '搜索“数字人民币”', '查看热门活动']
  },

  // 邮储银行
  {
    id: 'psbc-1',
    bank: BankName.PSBC,
    title: '邮储9/19/29立减金',
    description: '每月9号、19号、29号专享权益，领取微信立减金。',
    category: 'Cashback',
    status: 'active',
    expiryDate: '2026-12-31',
    estimatedValue: 10,
    steps: ['邮储银行App', '活动中心', '逢9必抢']
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
  [BankName.CITIC]: { color: 'text-red-600', bg: 'bg-red-50' },
  [BankName.CEB]: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
  [BankName.HXB]: { color: 'text-red-600', bg: 'bg-red-50' },
  [BankName.CGB]: { color: 'text-red-600', bg: 'bg-red-50' },
  [BankName.PAB]: { color: 'text-orange-600', bg: 'bg-orange-50' },
  [BankName.SPDB]: { color: 'text-blue-700', bg: 'bg-blue-50' },
  [BankName.CIB]: { color: 'text-blue-600', bg: 'bg-blue-50' },
  [BankName.CMBC]: { color: 'text-blue-500', bg: 'bg-blue-50' },
  [BankName.HFB]: { color: 'text-amber-600', bg: 'bg-amber-50' },
  [BankName.CZB]: { color: 'text-red-500', bg: 'bg-red-50' },
  [BankName.CBHB]: { color: 'text-blue-500', bg: 'bg-blue-50' },
  [BankName.BOB]: { color: 'text-red-600', bg: 'bg-red-50' },
  [BankName.SHB]: { color: 'text-blue-600', bg: 'bg-blue-50' },
  [BankName.JSB]: { color: 'text-blue-600', bg: 'bg-blue-50' },
  [BankName.NBCB]: { color: 'text-orange-500', bg: 'bg-orange-50' },
  [BankName.NJCB]: { color: 'text-red-500', bg: 'bg-red-50' },
  [BankName.HSBC]: { color: 'text-red-700', bg: 'bg-red-50' },
};
