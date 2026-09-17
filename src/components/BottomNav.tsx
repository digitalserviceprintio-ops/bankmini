import React from 'react';
import { useSavings } from '../context/SavingsContext';
import { ActiveTab } from '../types';
import { LayoutDashboard, ReceiptText, Users, BookOpen, UsersRound, QrCode } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useSavings();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Transaksi', icon: ReceiptText },
    { id: 'pindai', label: 'Pindai', icon: QrCode },
    { id: 'siswa', label: 'Siswa', icon: Users },
    { id: 'buku', label: 'Buku', icon: BookOpen },
    { id: 'portal-ortu', label: 'Portal Ortu', icon: UsersRound },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto h-16 px-2 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-50 text-emerald-700 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-emerald-800' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
