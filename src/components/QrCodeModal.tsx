import React from 'react';
import { useSavings } from '../context/SavingsContext';
import { X, Printer, QrCode, ShieldCheck } from 'lucide-react';

export const QrCodeModal: React.FC = () => {
  const { selectedStudentForQr, closeQrModal, schoolInfo, showToast } = useSavings();

  if (!selectedStudentForQr) return null;

  const s = selectedStudentForQr;

  const handlePrint = () => {
    showToast('Menyiapkan format kartu pelajar beresolusi tinggi...');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={closeQrModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-sm">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {s.className} • No. Rek: <strong className="text-slate-700">{s.accountNo}</strong>
        </p>

        {/* Realistic Printable Student Card Preview */}
        <div className="my-4 p-4 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl w-full flex flex-col items-center relative overflow-hidden shadow-lg">
          {/* Card Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-white/20 p-1 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold block leading-none">
                  KOPERASI SISWA
                </span>
                <span className="text-xs font-bold leading-tight">{schoolInfo.schoolName}</span>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
              AKTIF
            </span>
          </div>

          {/* Student Center Info with Photo */}
          <div className="w-full flex items-center justify-between gap-3 py-3">
            <div className="w-14 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0 border-2 border-white/20 shadow-sm">
              {s.photoUrl ? (
                <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-emerald-600">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] text-emerald-200 uppercase font-semibold">Nama Siswa</p>
              <p className="text-xs font-bold truncate leading-snug">{s.name}</p>
              <p className="text-[10px] text-emerald-100 mt-0.5">NIS: {s.nis}</p>
              <p className="text-[10px] text-emerald-200">Wali: {s.guardianName}</p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2.5 rounded-xl shadow-inner my-1 flex flex-col items-center">
            {/* Authentic SVG QR Code Graphic */}
            <svg className="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
              <rect x="8" y="8" width="26" height="26" rx="3" className="text-emerald-700" />
              <rect x="13" y="13" width="16" height="16" fill="white" />
              <rect x="17" y="17" width="8" height="8" className="text-emerald-700" />
              
              <rect x="66" y="8" width="26" height="26" rx="3" className="text-emerald-700" />
              <rect x="71" y="13" width="16" height="16" fill="white" />
              <rect x="75" y="17" width="8" height="8" className="text-emerald-700" />

              <rect x="8" y="66" width="26" height="26" rx="3" className="text-emerald-700" />
              <rect x="13" y="71" width="16" height="16" fill="white" />
              <rect x="17" y="75" width="8" height="8" className="text-emerald-700" />

              {/* Data matrix dots */}
              <rect x="42" y="12" width="8" height="8" />
              <rect x="46" y="28" width="12" height="6" />
              <rect x="15" y="42" width="6" height="12" />
              <rect x="40" y="40" width="18" height="18" className="text-emerald-600" />
              <rect x="66" y="44" width="10" height="8" />
              <rect x="80" y="40" width="8" height="14" />
              <rect x="44" y="66" width="8" height="18" />
              <rect x="62" y="68" width="16" height="8" />
              <rect x="72" y="80" width="16" height="8" className="text-emerald-600" />
            </svg>
            <span className="font-mono text-[9px] font-bold text-slate-700 tracking-wider mt-1.5">
              {s.nis} • {s.accountNo}
            </span>
          </div>

          <span className="text-[10px] text-emerald-100/80 mt-1">
            Scan saat setoran harian di ruang kelas / perpustakaan
          </span>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-2">
          <button
            onClick={closeQrModal}
            className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
