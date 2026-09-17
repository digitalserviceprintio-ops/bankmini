import React from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import {
  Wallet,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  PlusCircle,
  MinusCircle,
  QrCode,
  FolderKanban,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronRight,
  Settings,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    schoolInfo,
    students,
    transactions,
    isBalanceHidden,
    toggleBalanceHidden,
    setActiveTab,
    openReceiptModal,
    openSettingsModal,
    totalSchoolSavings,
    totalMonthlyDeposits,
    totalMonthlyWithdrawals,
    selectedClassFilter,
    setSelectedClassFilter,
    showToast,
  } = useSavings();

  const handleQuickAction = (action: string) => {
    if (action === 'setor') {
      setActiveTab('transaksi');
    } else if (action === 'tarik') {
      setActiveTab('transaksi');
    } else if (action === 'scan') {
      setActiveTab('pindai');
    } else if (action === 'rekap') {
      setActiveTab('siswa');
    }
  };

  const classList = [
    { id: 'all', label: 'Semua Kelas' },
    { id: '1A', label: 'Kelas 1A' },
    { id: '2A', label: 'Kelas 2A' },
    { id: '2B', label: 'Kelas 2B' },
    { id: '3C', label: 'Kelas 3C' },
    { id: '4B', label: 'Kelas 4B' },
    { id: '5A', label: 'Kelas 5A' },
    { id: '6B', label: 'Kelas 6' },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (selectedClassFilter === 'all') return true;
    return t.className.toLowerCase().includes(selectedClassFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-4">
      {/* Teacher Greeting & Cute Mascot Cheer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              T.A {schoolInfo.academicYear} • {schoolInfo.semester}
            </span>
            <button
              onClick={openSettingsModal}
              title="Ubah Profil Bendahara, Sekolah & Tahun Ajaran"
              className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <Settings className="w-2.5 h-2.5" />
              <span>Setting</span>
            </button>
          </div>
          <h2 className="text-lg font-bold text-slate-900 truncate">
            Halo, {schoolInfo.treasurerName}! 👋
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Bendahara • {schoolInfo.schoolName}
          </p>
        </div>

        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 border border-emerald-200 p-1.5 flex items-center justify-center shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGDB68YZ6sEG8DDhgamabqnd1TtjNJbFmBaK85DUBPvXSlIOuSA2D0CBdtFKeAcNgeqY1ZCrjsEPRGdQ-htoIYzM8yoYDdpLycnkz1hxdi0-9083CF17Ghtl4Dl7BiVi09UISPKv33gFic2XOwpAzyb9jAOpAcvd1tB3GGZ3c94_aCJ5lvf8kLSazqjIGY9aXzrFieMd6if-DznBVt1pl1ylGAaWp_QOIGg5W2EAEUvVVq2sIdMKOB"
              alt="Mascot Celengan SD"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Balance Card (Buku Kas Utama Sekolah) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white shadow-xl shadow-emerald-900/15">
        {/* Ambient Piggy Bank SVG Watermark */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none blur-2xl"></div>
        <div className="absolute top-3 right-4 opacity-10 pointer-events-none">
          <Wallet className="w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-xs font-semibold text-emerald-100 tracking-wide">
                Total Kas Tabungan Seluruh Siswa
              </span>
            </div>
            <button
              onClick={toggleBalanceHidden}
              aria-label="Sembunyikan Saldo"
              className="text-white/80 hover:text-white p-1 transition-colors"
            >
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-emerald-300">Rp</span>
              <span className="text-3xl font-extrabold tracking-tight text-white font-display">
                {isBalanceHidden ? '••••••••' : (totalSchoolSavings).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs">
            <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-semibold text-white">+12% dari bulan lalu</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-200 text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>{students.length} Siswa Terdaftar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick 3-Metric Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Setoran */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">Setoran</span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 leading-tight">
              {(totalMonthlyDeposits / 1000000).toFixed(2).replace('.', ',')} Jt
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Bulan ini</p>
          </div>
        </div>

        {/* Penarikan */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">Tarik Kas</span>
            <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-rose-600 leading-tight">
              {(totalMonthlyWithdrawals / 1000000).toFixed(2).replace('.', ',')} Jt
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Pengeluaran</p>
          </div>
        </div>

        {/* Siswa Aktif */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">Siswa Aktif</span>
            <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-700">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-sky-700 leading-tight">{students.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Penabung rajin</p>
          </div>
        </div>
      </div>

      {/* Quick Cashier Action Grid (Aksi Cepat Kasir) */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-800">Aksi Cepat Kasir</h3>
          <span className="text-[10px] font-medium text-slate-400">Pintasan Bendahara</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Input Setoran */}
          <button
            onClick={() => handleQuickAction('setor')}
            className="group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all active:scale-95 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100/70 group-hover:bg-emerald-200/80 flex items-center justify-center text-emerald-800 mb-1.5 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Input Setoran
            </span>
          </button>

          {/* Input Penarikan */}
          <button
            onClick={() => handleQuickAction('tarik')}
            className="group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all active:scale-95 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100/70 group-hover:bg-amber-200/80 flex items-center justify-center text-amber-800 mb-1.5 transition-colors">
              <MinusCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Input Tarik
            </span>
          </button>

          {/* Scan QR Kartu */}
          <button
            onClick={() => handleQuickAction('scan')}
            className="group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all active:scale-95 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-100/70 group-hover:bg-sky-200/80 flex items-center justify-center text-sky-800 mb-1.5 transition-colors">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Scan Kartu
            </span>
          </button>

          {/* Rekap Kelas */}
          <button
            onClick={() => handleQuickAction('rekap')}
            className="group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all active:scale-95 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-100/70 group-hover:bg-purple-200/80 flex items-center justify-center text-purple-800 mb-1.5 transition-colors">
              <FolderKanban className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Rekap Kelas
            </span>
          </button>
        </div>
      </div>

      {/* Educational Nurture Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200/80 p-3 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqOigi8yZ8wbkhTdMUSsVYa1DOXS-cr4wsvGk-TVFPso4Hmd9XsMg1FqMS_kVjD2uWIYz1rT8_HHfl08XcWwH9MnY2nud8z_SYWYRz047mJa0uOTu5QmlEdr4bzb-QkORUdWnFf7Sf4ykJMSQ2nIuK3mAFjXcU-BkoaSzxvzsBvdVoWAnp5ZFLykMqgrdCeWRAvt-Y9C_QHebUmd8acL7bFwVTdLZfW4T6UoyuG-reG07ASjUedYbr"
            alt="Tips Guru"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              Tips Guru Pekan Ini
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium line-clamp-2">
            Program Gemar Menabung Sejak Dini: Siswa diajak mencatat impian kecil mereka di lembar celengan kreatif!
          </p>
        </div>
        <button
          onClick={() => showToast('Membuka materi literasi finansial guru...', 'info')}
          aria-label="Buka tips"
          className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-700 shrink-0 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Rekapitulasi Kelas Carousel */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-800">Filter Rekapitulasi Kelas</h3>
          <button
            onClick={() => setActiveTab('siswa')}
            className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar -mx-4 px-4">
          {classList.map(item => {
            const isSelected = selectedClassFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedClassFilter(item.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-slate-800">Transaksi Terbaru</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Hari Ini
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {filteredTransactions.length} Aktivitas
          </span>
        </div>

        <div className="space-y-2">
          {filteredTransactions.slice(0, 6).map(tx => {
            const isDeposit = tx.type === 'deposit';
            const student = students.find(s => s.id === tx.studentId);
            return (
              <div
                key={tx.id}
                onClick={() => openReceiptModal(tx)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    {student?.photoUrl ? (
                      <img src={student.photoUrl} alt={tx.studentName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-700 bg-emerald-100">
                        {tx.studentName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        isDeposit ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {isDeposit ? (
                        <ArrowDownLeft className="w-2.5 h-2.5" />
                      ) : (
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {tx.studentName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                        {tx.className.replace('Kelas ', '')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                      <span>{tx.time}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium truncate max-w-[120px]">
                        {tx.note}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span
                    className={`text-xs font-extrabold ${
                      isDeposit ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isDeposit ? '+' : '-'} {formatRupiah(tx.amount)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Lunas</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classroom Milestone / Discipline Award Badge */}
      <div className="rounded-2xl bg-white border border-slate-100 p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-slate-900">Kelas Paling Disiplin</h4>
            <p className="text-[11px] text-slate-500">Kelas 4B • 100% siswa menabung minggu ini</p>
          </div>
        </div>
        <span className="text-2xl">🏆</span>
      </div>
    </div>
  );
};
