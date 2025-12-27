
import React from 'react';
import { BankOffer, RewardHistory, UserCard } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const generateMockHistory = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      value: Math.floor(Math.random() * 30) + 5
    });
  }
  return data;
};

const MOCK_HISTORY: RewardHistory[] = generateMockHistory();

const Dashboard: React.FC<{ offers: BankOffer[], userCards: UserCard[] }> = ({ offers, userCards }) => {
  const userBankNames = new Set(userCards.map(c => c.bank));
  const activeOffers = offers.filter(o => o.status === 'active');

  // 仅计算用户持有的银行卡的福利价值
  const matchedOffers = activeOffers.filter(o => userBankNames.has(o.bank));
  const matchedValue = matchedOffers.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const claimedCount = offers.filter(o => o.status === 'claimed').length;

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-sm font-medium opacity-80 mb-1">本月累计收益预估</h2>
          <div className="flex items-baseline space-x-1 mb-4">
            <span className="text-3xl font-bold">¥</span>
            <span className="text-4xl font-bold tracking-tight">1,248.50</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] opacity-80 mb-1 uppercase font-bold">待领(匹配卡片)</p>
              <p className="text-xl font-semibold">¥{matchedValue}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] opacity-80 mb-1 uppercase font-bold">已完成任务</p>
              <p className="text-xl font-semibold">{claimedCount} 项</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900">收益趋势 (7日)</h3>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">+12% vs 上周</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {MOCK_HISTORY.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === MOCK_HISTORY.length - 1 ? '#2563eb' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-900">为您推荐</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">优先显示已持卡</span>
        </div>
        <div className="space-y-3">
          {[...matchedOffers, ...activeOffers.filter(o => !userBankNames.has(o.bank))].slice(0, 4).map(offer => {
            const isMatched = userBankNames.has(offer.bank);
            return (
              <div key={offer.id} className={`bg-white p-4 rounded-xl border flex items-center justify-between transition-all ${isMatched ? 'border-blue-100 bg-blue-50/20' : 'border-slate-100'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${isMatched ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                    {isMatched ? '⭐' : '🎁'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{offer.title}</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-[10px] text-slate-500">{offer.bank}</p>
                      {isMatched && <span className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded font-bold">已持卡</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600">+¥{offer.estimatedValue}</span>
                  <p className="text-[10px] text-slate-400">预估</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
