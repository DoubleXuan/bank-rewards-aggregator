
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">薅羊毛大师 <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-40">
        <NavItem active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} icon="dashboard" label="概览" />
        <NavItem active={activeTab === 'offers'} onClick={() => onTabChange('offers')} icon="gift" label="福利库" />
        <NavItem active={activeTab === 'ai'} onClick={() => onTabChange('ai')} icon="ai" label="AI分析" />
        <NavItem active={activeTab === 'settings'} onClick={() => onTabChange('settings')} icon="user" label="我的" />
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => {
  const getIcon = () => {
    switch (icon) {
      case 'dashboard':
        return <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'gift':
        return <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
      case 'ai':
        return <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
      default:
        return <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
    >
      {getIcon()}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

export default Layout;
