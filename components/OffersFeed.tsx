
import React, { useState, useEffect } from 'react';
import { BankOffer, UserCard } from '../types';
import { BANK_THEMES } from '../constants';
import { fetchLatestBankOffers } from '../services/geminiService';

interface OffersFeedProps {
  offers: BankOffer[];
  userCards: UserCard[];
  onClaim: (id: string) => void;
  onSync: (newOffers: BankOffer[]) => void;
}

const OffersFeed: React.FC<OffersFeedProps> = ({ offers, userCards, onClaim, onSync }) => {
  const [filter, setFilter] = useState<'all' | 'Lottery' | 'Cashback' | 'Coupon' | 'matched'>('all');
  const [syncing, setSyncing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  // 获取用户已添加的银行名称列表
  const userBankNames = new Set(userCards.map(c => c.bank));

  const filteredOffers = offers.filter(o => {
    const categoryMatch = filter === 'all' || filter === 'matched' || o.category === filter;
    const cardMatch = filter === 'matched' ? userBankNames.has(o.bank) : true;

    // Check expiry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(o.expiryDate);
    const isExpired = expiry < today;

    return categoryMatch && cardMatch && !isExpired && o.status !== 'expired';
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      const results = await fetchLatestBankOffers();
      const formatted = results.map((r: any) => ({
        ...r,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active',
        description: r.steps[0] || '点击查看详情',
        isNew: true
      }));
      onSync(formatted);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
      alert(`同步失败: ${e instanceof Error ? e.message : JSON.stringify(e)}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">实时福利库</h2>
          <p className="text-[10px] text-slate-400">上次更新: {lastUpdated}</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold transition-all active:scale-95 ${syncing ? 'opacity-50' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{syncing ? 'AI 搜索中...' : '同步全网活动'}</span>
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter('matched')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-1 ${filter === 'matched'
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200'
            }`}
        >
          <span>⭐ 我的匹配</span>
        </button>
        {['all', 'Lottery', 'Cashback', 'Coupon'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
              }`}
          >
            {cat === 'all' ? '全部' : cat === 'Lottery' ? '抽奖' : cat === 'Cashback' ? '返现' : '券码'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOffers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">暂无匹配活动，尝试同步全网或关注更多银行</p>
          </div>
        )}
        {filteredOffers.map(offer => {
          const isMatched = userBankNames.has(offer.bank);
          return (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all group ${offer.status === 'claimed' ? 'opacity-60' : ''} ${isMatched ? 'border-blue-100 ring-1 ring-blue-50' : 'border-slate-100'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${BANK_THEMES[offer.bank]?.bg || 'bg-slate-100'} ${BANK_THEMES[offer.bank]?.color || 'text-slate-600'}`}>
                    {offer.bank}
                  </div>
                  {isMatched && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold">已关注</span>
                  )}
                  {(offer as any).isNew && (
                    <span className="text-[10px] text-orange-500 font-bold animate-pulse">NEW</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">至 {offer.expiryDate}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{offer.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{offer.description}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">预计价值</span>
                  <span className="text-xl font-bold text-blue-600">¥{offer.estimatedValue}</span>
                </div>

                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="px-6 py-2 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  {offer.status === 'claimed' ? '查看详情' : '立即领取'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className={`p-6 ${BANK_THEMES[selectedOffer.bank]?.bg || 'bg-blue-50'} text-center relative`}>
              <button onClick={() => setSelectedOffer(null)} className="absolute top-4 right-4 text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">
                🏦
              </div>
              <h3 className="font-bold text-xl text-slate-900">{selectedOffer.bank}助手</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedOffer.title}</p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>
                参与指引
              </h4>
              <div className="space-y-4">
                {selectedOffer.steps.map((step, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    const textToCopy = selectedOffer.searchKeyword || `${selectedOffer.bank} ${selectedOffer.title}`;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                      alert(`已复制搜索词：【${textToCopy}】\n请打开手机银行App，粘贴到顶部搜索框直达活动。`);
                      // 尝试通用跳转或让用户自己打开
                      onClaim(selectedOffer.id);
                      setSelectedOffer(null);
                    }).catch(() => {
                      alert('复制失败，请手动查找活动');
                    });
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <div className="flex flex-col items-start leading-tight">
                    <span>复制搜索词并去 App</span>
                    <span className="text-[10px] opacity-80 font-normal">搜索口令: {selectedOffer.searchKeyword || selectedOffer.title}</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="w-full py-3 text-slate-400 text-sm font-medium"
                >
                  稍后再说
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersFeed;
