import React from 'react';
import { SavingsProvider, useSavings } from './context/SavingsContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ReceiptModal } from './components/ReceiptModal';
import { QrCodeModal } from './components/QrCodeModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { TransactionView } from './views/TransactionView';
import { StudentsView } from './views/StudentsView';
import { PassbookView } from './views/PassbookView';
import { ParentPortalView } from './views/ParentPortalView';
import { QrScannerView } from './views/QrScannerView';

const MainContent: React.FC = () => {
  const { activeTab } = useSavings();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'beranda':
        return <DashboardView />;
      case 'transaksi':
        return <TransactionView />;
      case 'siswa':
        return <StudentsView />;
      case 'buku':
        return <PassbookView />;
      case 'portal-ortu':
        return <ParentPortalView />;
      case 'pindai':
        return <QrScannerView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile-constrained app container */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col relative shadow-2xl border-x border-slate-200/80">
        {/* Sticky Header */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 pt-16 flex flex-col">
          {renderCurrentView()}
        </main>

        {/* Sticky Bottom Navigation */}
        <BottomNav />

        {/* Overlay Modals & Notification Toasts */}
        <ReceiptModal />
        <QrCodeModal />
        <AuthModal />
        <SettingsModal />
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SavingsProvider>
      <MainContent />
    </SavingsProvider>
  );
}
