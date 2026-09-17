import React, { useState } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import { SavingsReportModal } from '../components/SavingsReportModal';
import {
  BookOpen,
  Printer,
  QrCode,
  Eye,
  EyeOff,
  Target,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Share2,
  FileText,
  Filter,
} from 'lucide-react';

export const PassbookView: React.FC = () => {
  const {
    activeStudent,
    transactions,
    schoolInfo,
    isBalanceHidden,
    toggleBalanceHidden,
    openReceiptModal,
    openQrModal,
    showToast,
  } = useSavings();

  const [filterMonth, setFilterMonth] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filter transactions for this student
  const studentTxs = transactions.filter(t => t.studentId === activeStudent.id);

  const totalDeposits = studentTxs
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalWithdrawals = studentTxs
    .filter(t => t.type === 'withdraw')
    .reduce((acc, t) => acc + t.amount, 0);

  const target = activeStudent.savingTarget || {
    id: 't-1',
    title: 'Beli Sepatu Sekolah Baru',
    targetAmount: 500000,
    currentAmount: activeStudent.balance,
    category: 'Perlengkapan Sekolah',
    icon: 'pedal_bike',
  };

  const targetPercent = Math.min(100, Math.round((activeStudent.balance / target.targetAmount) * 100));
  const remainingForTarget = Math.max(0, target.targetAmount - activeStudent.balance);

  const handlePrintPassbook = () => {
    showToast('Menyiapkan lembar mutasi buku tabungan siap cetak...', 'info');
    window.print();
  };

  const handleShareStatement = () => {
    const text = `*BUKU MUTASI TABUNGAN SISWA*\n${schoolInfo.schoolName}\nNama: ${activeStudent.name}\nNIS: ${activeStudent.nis} (${activeStudent.className})\nNo. Rekening: ${activeStudent.accountNo}\nSaldo Terkini: ${formatRupiah(activeStudent.balance)}\nTarget Impian: ${target.title} (${targetPercent}% tercapai)\nTerima kasih telah aktif menabung! ✨`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-4">
      {/* Top Passbook Identification Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 shadow-xl">
        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <BookOpen className="w-28 h-28 text-white" />
        </div>

        <div className="relative z-10 flex flex-col space-y-3">
          {/* Card Title & School Seal */}
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-emerald-100" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block leading-tight">
                  BUKU TABUNGAN DIGITAL
                </span>
                <span className="text-xs font-bold">{schoolInfo.schoolName}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/50 text-white px-2 py-0.5 rounded-full">
              Buku: {activeStudent.bookNo}
            </span>
          </div>

          {/* Student Center Info with Photo */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/30 shrink-0 shadow-sm">
                {activeStudent.photoUrl ? (
                  <img
                    src={activeStudent.photoUrl}
                    alt={activeStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-base text-white bg-emerald-600">
                    {activeStudent.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-emerald-900"></span>
              </div>

              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-bold truncate leading-snug">{activeStudent.name}</h3>
                <p className="text-[11px] text-emerald-100 mt-0.5">
                  {activeStudent.className} • NIS: <strong className="text-white">{activeStudent.nis}</strong>
                </p>
                <p className="text-[10px] text-emerald-200">
                  No. Rek: <strong className="text-white font-mono">{activeStudent.accountNo}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Balance Area */}
          <div className="pt-2 border-t border-white/15 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-medium text-emerald-200 block">
                Saldo Buku Tabungan
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold text-emerald-300">Rp</span>
                <span className="text-2xl font-extrabold tracking-tight font-display">
                  {isBalanceHidden ? '••••••••' : activeStudent.balance.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleBalanceHidden}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                title="Sembunyikan Saldo"
              >
                {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => openQrModal(activeStudent)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                title="QR Kartu Siswa"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Tabungan Impian (Savings Goal) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Target Tabungan Impian</h4>
              <p className="text-[10px] text-slate-400">Motivasi Menabung Mandiri Siswa</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {targetPercent}% Tercapai
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">{target.title}</span>
            <span className="font-bold text-emerald-700">{formatRupiah(target.targetAmount)}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${targetPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Terkumpul: <strong className="text-emerald-700">{formatRupiah(activeStudent.balance)}</strong></span>
            <span>
              {remainingForTarget > 0 ? (
                <>Sisa: <strong className="text-rose-600">{formatRupiah(remainingForTarget)}</strong></>
              ) : (
                <span className="text-emerald-700 font-bold">🎉 Target Tercapai!</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Total Setoran Masuk</span>
            <span className="text-xs font-bold text-emerald-700">{formatRupiah(totalDeposits)}</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Total Tarik Kas</span>
            <span className="text-xs font-bold text-rose-600">{formatRupiah(totalWithdrawals)}</span>
          </div>
        </div>
      </div>

      {/* Authentic Passbook Ledger Table (Lembar Mutasi Kas) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900">Lembar Rekapitulasi Mutasi</h4>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {studentTxs.length} Baris
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Buka Rekap Laporan Lengkap Sekolah"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rekap Laporan</span>
              <span className="sm:hidden">Rekap</span>
            </button>
            <button
              onClick={handleShareStatement}
              className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Kirim ke WA"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bagikan</span>
            </button>
            <button
              onClick={handlePrintPassbook}
              className="h-8 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
          </div>
        </div>

        {/* Ledger Entries List */}
        <div className="divide-y divide-slate-100">
          {studentTxs.map(tx => {
            const isDeposit = tx.type === 'deposit';
            return (
              <div
                key={tx.id}
                onClick={() => openReceiptModal(tx)}
                className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{tx.date}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({tx.time})</span>
                  </div>
                  <span
                    className={`font-extrabold ${
                      isDeposit ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isDeposit ? '+' : '-'} {formatRupiah(tx.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[190px]">{tx.note}</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="text-slate-400">Saldo:</span>
                    <span className="font-bold text-slate-800">{formatRupiah(tx.finalBalance)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Petugas: {tx.officerName}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Paraf Valid
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Seal */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dokumen Sah Buku Tabungan SimPel SD</span>
          </div>
          <span className="font-mono text-slate-400">T.A 2024/2025</span>
        </div>
      </div>

      {/* Savings Report Modal with Filtering & PDF Export */}
      <SavingsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
