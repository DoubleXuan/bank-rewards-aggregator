
import React, { useState } from 'react';
import { UserCard, BankName } from '../types';

interface SettingsProps {
  userCards: UserCard[];
  setUserCards: React.Dispatch<React.SetStateAction<UserCard[]>>;
}

const Settings: React.FC<SettingsProps> = ({ userCards, setUserCards }) => {
  const [newCardBank, setNewCardBank] = useState<BankName>(BankName.ICBC);
  const [newCardLastFour, setNewCardLastFour] = useState('');

  const addCard = () => {
    if (newCardLastFour.length !== 4) return alert('请输入卡号后四位');
    const newCard: UserCard = {
      id: Date.now().toString(),
      bank: newCardBank,
      lastFour: newCardLastFour,
      nickname: `${newCardBank}新卡`
    };
    setUserCards([...userCards, newCard]);
    setNewCardLastFour('');
  };

  const removeCard = (id: string) => {
    setUserCards(userCards.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          安装到手机桌面
        </h3>
        <p className="text-xs text-blue-100 mb-4 leading-relaxed">
          iOS: 点击 Safari 底部「分享」图标，选择「添加到主屏幕」。<br/>
          Android: 点击 Chrome 菜单「安装应用」。
        </p>
        <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-[10px]">
          安装后可获得沉浸式体验，支持离线打开
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">我的银行卡 ({userCards.length})</h3>
        <div className="space-y-3">
          {userCards.map(card => (
            <div key={card.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold border border-slate-200">
                  {card.bank.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{card.nickname}</h4>
                  <p className="text-xs text-slate-500">{card.bank} (**** {card.lastFour})</p>
                </div>
              </div>
              <button onClick={() => removeCard(card.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-4">添加新卡片</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <select 
              value={newCardBank}
              onChange={(e) => setNewCardBank(e.target.value as BankName)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(BankName).map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            <input 
              type="text" 
              maxLength={4}
              placeholder="后四位 (如 8888)"
              value={newCardLastFour}
              onChange={(e) => setNewCardLastFour(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={addCard}
            className="w-full py-2 bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            确认添加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">系统设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">自动提醒每日签到</span>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative">
               <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">深色模式</span>
            <div className="w-10 h-5 bg-slate-200 rounded-full relative">
               <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest pb-8">
        LootMaster AI v1.0.5 • PWA Enabled
      </p>
    </div>
  );
};

export default Settings;
