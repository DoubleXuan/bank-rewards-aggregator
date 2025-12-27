
export enum BankName {
  ICBC = '工商银行',
  CCB = '建设银行',
  ABC = '农业银行',
  BOC = '中国银行',
  CMB = '招商银行',
  COMM = '交通银行',
  PSBC = '邮储银行',
}

export interface BankOffer {
  id: string;
  bank: BankName;
  title: string;
  description: string;
  category: 'Lottery' | 'Points' | 'Cashback' | 'Coupon';
  status: 'active' | 'expired' | 'claimed';
  expiryDate: string;
  estimatedValue: number;
  steps: string[];
}

export interface UserCard {
  id: string;
  bank: BankName;
  lastFour: string;
  nickname: string;
}

export interface RewardHistory {
  date: string;
  value: number;
}
