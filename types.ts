
export enum BankName {
  ICBC = '工商银行',
  CCB = '建设银行',
  ABC = '农业银行',
  BOC = '中国银行',
  CMB = '招商银行',
  COMM = '交通银行',
  PSBC = '邮储银行',
  CITIC = '中信银行',
  CEB = '光大银行',
  HXB = '华夏银行',
  CGB = '广发银行',
  PAB = '平安银行',
  SPDB = '浦发银行',
  CIB = '兴业银行',
  CMBC = '民生银行',
  HFB = '恒丰银行',
  CZB = '浙商银行',
  CBHB = '渤海银行',
  BOB = '北京银行',
  SHB = '上海银行',
  JSB = '江苏银行',
  NBCB = '宁波银行',
  NJCB = '南京银行',
  HSBC = '汇丰银行',
}

export interface BankOffer {
  id: string;
  bank: BankName;
  title: string;
  searchKeyword?: string;
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
  type?: 'Credit' | 'Debit';
}

export interface RewardHistory {
  date: string;
  value: number;
}
