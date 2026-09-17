import React, { useState } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import {
  UsersRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Target,
  Sparkles,
  Bell,
  MessageCircle,
  FileCheck,
  Award,
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const ParentPortalView: React.FC = () => {
  const {
    activeStudent,
    students,
    setActiveStudent,
    transactions,
    isBalanceHidden,
    toggleBalanceHidden,
    openReceiptModal,
    schoolInfo,
    showToast,
  } = useSavings();

  const [waNotification, setWaNotification] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(true);

  const studentTxs = transactions.filter(t => t.studentId === activeStudent.id);
  const target = activeStudent.savingTarget;
  const targetPercent = target
    ? Math.min(100, Math.round((activeStudent.balance / target.targetAmount) * 100))
    : 95;

  const handleContactTeacher = () => {
    const text = `Halo Ibu ${schoolInfo.treasurerName}, saya ${activeStudent.guardianName} (Wali dari ${activeStudent.name}, ${activeStudent.className}). Ingin menanyakan perihal tabungan sekolah ananda. Terima kasih.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-4">
      {/* Guardian Header Profile */}
      <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            <UsersRound className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                PORTAL RESMI WALI MURID
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {activeStudent.guardianName}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Wali dari <strong className="text-slate-800">{activeStudent.name}</strong> ({activeStudent.className})
            </p>
          </div>
        </div>

        {/* Child Selector dropdown */}
        <select
          value={activeStudent.id}
          onChange={e => {
            const chosen = students.find(s => s.id === e.target.value);
            if (chosen) {
              setActiveStudent(chosen);
              showToast(`Menampilkan tabungan ananda ${chosen.name}`, 'info');
            }
          }}
          className="text-xs font-bold bg-slate-50 border border-slate-200 text-emerald-800 rounded-xl px-2 py-1.5 outline-none"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name.split(' ')[0]} ({s.classId})
            </option>
          ))}
        </select>
      </div>

      {/* Child Savings Card with Real Balance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 shadow-xl">
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-xs font-semibold text-emerald-100">
                Saldo Tabungan Ananda di Sekolah
              </span>
            </div>
            <button
              onClick={toggleBalanceHidden}
              className="text-white/80 hover:text-white p-1"
            >
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-emerald-300">Rp</span>
              <span className="text-3xl font-extrabold tracking-tight font-display">
                {isBalanceHidden ? '••••••••' : activeStudent.balance.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 mt-1">
              Tercatat aman di pembukuan kas {schoolInfo.schoolName}
            </p>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-white">Penabung Berprestasi Bulan Ini</span>
            </div>
            <span className="text-emerald-200 text-[11px]">
              No. Rek: {activeStudent.accountNo}
            </span>
          </div>
        </div>
      </div>

      {/* Target Impian Ananda */}
      {target && (
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Impian Menabung Ananda</h4>
                <p className="text-[10px] text-slate-400">Target yang ditetapkan bersama wali kelas</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {targetPercent}% Tercapai
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">{target.title}</span>
              <span className="font-bold text-emerald-700">{formatRupiah(target.targetAmount)}</span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${targetPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Terkumpul: <strong className="text-emerald-700">{formatRupiah(activeStudent.balance)}</strong></span>
              <span>Sisa: <strong className="text-rose-600">{formatRupiah(Math.max(0, target.targetAmount - activeStudent.balance))}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Habit Streak Badge */}
      <div className="p-3.5 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50/40 rounded-2xl border border-emerald-200/60 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-inner">
            ⭐
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Kebiasaan Positif Siswa
            </span>
            <h4 className="text-xs font-bold text-slate-900">
              4x Menabung Rutin Tanpa Putus!
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ananda sangat disiplin menyisihkan uang jajan setiap hari Senin & Kamis.
            </p>
          </div>
        </div>
      </div>

      {/* Live Transaction Feed for Guardian */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900">Riwayat Setoran Terkini</h4>
          <span className="text-[11px] text-slate-400">Terpantau Real-time</span>
        </div>

        <div className="divide-y divide-slate-100">
          {studentTxs.slice(0, 4).map(tx => (
            <div
              key={tx.id}
              onClick={() => openReceiptModal(tx)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-1 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{tx.note}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} • {tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-700 block">
                  +{formatRupiah(tx.amount)}
                </span>
                <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                  Lihat Kuitansi
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences Toggle */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-slate-900">Pengaturan Notifikasi Orang Tua</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Notifikasi WhatsApp Setiap Setoran</span>
              <span className="text-[10px] text-slate-400">Kirim struk otomatis ke nomor {activeStudent.guardianPhone}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setWaNotification(!waNotification);
                showToast(`Notifikasi WhatsApp ${!waNotification ? 'Diaktifkan' : 'Dinonaktifkan'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                waNotification ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  waNotification ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Laporan Rekap Akhir Bulan</span>
              <span className="text-[10px] text-slate-400">Dapatkan e-rekapitulasi PDF setiap tanggal 30</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMonthlyReport(!monthlyReport);
                showToast(`Laporan bulanan ${!monthlyReport ? 'Diaktifkan' : 'Dinonaktifkan'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                monthlyReport ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  monthlyReport ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Article for Parents */}
      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 flex items-start gap-3">
        <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <h4 className="text-xs font-bold text-emerald-900">Tips Finansial untuk Orang Tua</h4>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            Berikan apresiasi saat anak berhasil menabung konsisten. Kebiasaan mengelola uang saku sejak dini terbukti melatih disiplin dan kemandirian anak hingga dewasa.
          </p>
        </div>
      </div>

      {/* Direct Contact Button */}
      <button
        onClick={handleContactTeacher}
        className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Hubungi Wali Kelas / Bendahara ({schoolInfo.treasurerName})</span>
      </button>
    </div>
  );
};
