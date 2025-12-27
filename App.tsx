
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { MOCK_OFFERS } from './constants';
import { BankOffer, UserCard, BankName } from './types';
import Dashboard from './components/Dashboard';
import OffersFeed from './components/OffersFeed';
import AIAnalyzer from './components/AIAnalyzer';
import Settings from './components/Settings';
import { fetchLatestBankOffers } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [offers, setOffers] = useState<BankOffer[]>(MOCK_OFFERS);
  const [userCards, setUserCards] = useState<UserCard[]>([
    { id: 'c1', bank: BankName.ICBC, lastFour: '8899', nickname: '我的工资卡' },
    { id: 'c2', bank: BankName.CMB, lastFour: '1234', nickname: '羊毛专用卡' }
  ]);

  // 应用启动时自动同步一次最新活动
  useEffect(() => {
    const autoSync = async () => {
      try {
        const results = await fetchLatestBankOffers();
        const formatted = results.map((r: any) => ({
          ...r,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active',
          description: r.steps[0] || '点击查看详情',
          isNew: true
        }));
        handleSyncOffers(formatted);
      } catch (e) {
        console.warn('Initial sync failed, using mock data.');
      }
    };
    autoSync();
  }, []);

  const handleClaim = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'claimed' } : o));
  };

  const handleSyncOffers = (newOffers: BankOffer[]) => {
    setOffers(prev => {
      const existingTitles = new Set(prev.map(o => o.title));
      const uniqueNew = newOffers.filter(o => !existingTitles.has(o.title));
      return [...uniqueNew, ...prev];
    });
  };

  const addOffer = (newOffer: BankOffer) => {
    setOffers(prev => [newOffer, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard offers={offers} userCards={userCards} />;
      case 'offers':
        return <OffersFeed offers={offers} userCards={userCards} onClaim={handleClaim} onSync={handleSyncOffers} />;
      case 'ai':
        return <AIAnalyzer onAddOffer={addOffer} userCards={userCards} offers={offers} />;
      case 'settings':
        return <Settings userCards={userCards} setUserCards={setUserCards} />;
      default:
        return <Dashboard offers={offers} userCards={userCards} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
