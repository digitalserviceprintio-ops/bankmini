import React, { useState } from 'react';
import { useSavings } from '../context/SavingsContext';
import {
  Bell,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Check,
  Settings,
  UserPlus,
  Users,
  LogOut,
  Calendar,
  School,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    schoolInfo,
    activeTab,
    userRole,
    setUserRole,
    openAuthModal,
    openSettingsModal,
    showToast,
    currentAdmin,
    adminAccounts,
    switchAdminAccount,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
  } = useSavings();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return userRole === 'bendahara' ? 'Dashboard Beranda' : 'Beranda Siswa';
      case 'transaksi':
        return 'Transaksi';
      case 'siswa':
        return 'Data Siswa';
      case 'buku':
        return 'Buku Tabungan';
      case 'portal-ortu':
        return 'Portal Orang Tua';
      case 'pindai':
        return 'Pindai Kartu Siswa';
      default:
        return 'Buku Tabungan';
    }
  };

  const handleRoleSelect = (role: 'bendahara' | 'orangtua' | 'siswa') => {
    setUserRole(role);
    setShowRoleDropdown(false);
    showToast(`Beralih ke mode: ${role === 'bendahara' ? 'Bendahara / Guru' : role === 'orangtua' ? 'Orang Tua' : 'Siswa'}`);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left: Brand & Page Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src={schoolInfo.logoUrl}
              alt="Logo Tabungan Cilik SD"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                {schoolInfo.schoolName}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[10px] font-semibold text-emerald-800/90 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                {schoolInfo.institutionType || 'Sekolah'}
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 leading-tight truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Notifications & User Avatar with Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Cloud Sync Status Indicator */}
          <button
            onClick={() => {
              syncWithCloud();
              showToast('Menyinkronkan data dengan Google Cloud Firestore...', 'info');
            }}
            title={
              cloudSyncStatus === 'synced'
                ? `Cloud Firestore Terhubung (asia-southeast1)${lastSyncedAt ? ` • ${lastSyncedAt.toLocaleTimeString('id-ID')}` : ''}`
                : cloudSyncStatus === 'syncing'
                ? 'Sedang menyinkronkan data ke Cloud...'
                : 'Mode Offline (tersimpan di cache lokal)'
            }
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all border ${
              cloudSyncStatus === 'synced'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : cloudSyncStatus === 'syncing'
                ? 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
            ) : cloudSyncStatus === 'offline' ? (
              <CloudOff className="w-3 h-3 text-amber-600" />
            ) : (
              <Cloud className="w-3 h-3 text-emerald-600" />
            )}
            <span className="hidden xs:inline sm:inline">
              {cloudSyncStatus === 'synced' ? 'Cloud' : cloudSyncStatus === 'syncing' ? 'Sync...' : 'Offline'}
            </span>
            {cloudSyncStatus === 'synced' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              aria-label="Notifikasi"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Pemberitahuan Kas</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    3 Baru
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50/70 text-slate-700">
                    <p className="font-semibold text-emerald-900">Tahun Ajaran {schoolInfo.academicYear}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {schoolInfo.semester} aktif pada {schoolInfo.schoolName}.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                    <p className="font-semibold text-slate-800">Verifikator: {schoolInfo.treasurerName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Kuitansi dan pencatatan telah disinkronkan.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-emerald-700"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Role & Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(prev => !prev)}
              aria-label="Pilihan Profil & Pengaturan"
              className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors ring-2 ring-emerald-500/20"
            >
              <img
                src={
                  userRole === 'bendahara'
                    ? 'https://lh3.googleusercontent.com/aida/AEtjO1WASgEEma62ze2jmG7P6RplPizxCgWRM1AIkzrLpeH8I6ksYugdhbtO-HDDAJ0nig4LUfTiyn1LHDRoY93CJIQKocfiny_UEG68ZY7fWFBS4vlmn7qUkZw8b8Zg1EtLe9cir32LF89NFNEVdQtaloFyHdjdQSG6UHDjOQhJxjN78S1oBBW3eozcOF2X0TAm2zWdhk2yoL49xUP1pz66vqU2Dl0TKpEDM134aDJFTmK2M2y0p6DL3GBiJ2Q'
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJVJZ4nJnOfNN5bOZrDhfSkrRC9M7e2Rb-bTbjhwSiTWI4Kxl6hC1o_-05PAuTT2Dqu8e6oWZorUDkpeemv3A1qAg5RPOEoX7jVRLKm50018Omh7z74VhLAUcI8X9w86OWD-oE47FyqVm7WaUDVG7ShJwB47HqK2D34OQKQvjWtEgfxEkZtT6C65rDCtJKA5LwcVCup4AStiO2PYkJ_sb1tWGdqWxx4RFcy7rZmbrdaqR0a5c9b7HO'
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-sm"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Profile Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Active Admin Profile Card */}
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Akun Bendahara Aktif
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-md">
                      {schoolInfo.academicYear}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                    {schoolInfo.treasurerName}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">
                    {schoolInfo.schoolName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                    <span>NIP: {schoolInfo.treasurerNip || '-'}</span>
                    <span>•</span>
                    <span>{schoolInfo.semester}</span>
                  </div>
                </div>

                {/* Primary Action: Settings (Bendahara, Sekolah & Tahun Ajaran) */}
                <div className="space-y-1 pb-1.5 border-b border-slate-100">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      openSettingsModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-emerald-900 leading-none">
                        Setting Profil & Sekolah
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        Bendahara, sekolah, & tahun ajaran
                      </p>
                    </div>
                  </button>
                </div>

                {/* Multi-Admin Management */}
                <div className="py-1.5 space-y-1 border-b border-slate-100">
                  <div className="px-2 pt-0.5 pb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Akun Bendahara Terdaftar
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {adminAccounts.length}
                    </span>
                  </div>

                  {/* Registered admin list for fast switching */}
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-0.5">
                    {adminAccounts.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setShowRoleDropdown(false);
                          switchAdminAccount(acc.id);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          acc.id === currentAdmin?.id
                            ? 'bg-emerald-50/80 text-emerald-900 font-bold border border-emerald-200/80'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <p className="text-[11px] font-bold truncate leading-tight">{acc.name}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            <span className="font-semibold text-emerald-700">[{acc.institutionType || 'Sekolah'}]</span> {acc.schoolName}
                          </p>
                        </div>
                        {acc.id === currentAdmin?.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Register New Admin Account Shortcut */}
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      openAuthModal('teacher-register');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Daftarkan Akun Sekolah Baru</span>
                  </button>
                </div>

                {/* Role Switcher Mode */}
                <div className="py-1 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 pt-1">
                    Beralih Tampilan
                  </span>

                  <button
                    onClick={() => handleRoleSelect('bendahara')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      userRole === 'bendahara'
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Mode Bendahara Kas</span>
                    </div>
                    {userRole === 'bendahara' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('orangtua')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      userRole === 'orangtua'
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Mode Portal Orang Tua</span>
                    </div>
                    {userRole === 'orangtua' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>

                {/* Open Full Auth Modal */}
                <div className="pt-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      openAuthModal('teacher-login');
                    }}
                    className="w-full text-center py-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar / Ganti Akun Lain</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
