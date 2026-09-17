import React from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah, terbilangRupiah } from '../data/mockData';
import { Printer, Share2, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedTransactionForReceipt, closeReceiptModal, schoolInfo, showToast } = useSavings();

  if (!selectedTransactionForReceipt) return null;

  const tx = selectedTransactionForReceipt;
  const isDeposit = tx.type === 'deposit';

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*BUKTI TRANSAKSI TABUNGAN SISWA*\n${schoolInfo.schoolName} - ${schoolInfo.subName}\n----------------------------\nNo. Transaksi: ${tx.transactionCode}\nNama: ${tx.studentName}\nNIS: ${tx.studentNis} (${tx.className})\nTanggal: ${tx.date} ${tx.time}\nJenis: ${isDeposit ? 'Setoran Tabungan (+)' : 'Penarikan Kas (-)'}\nNominal: ${formatRupiah(tx.amount)}\nSaldo Terkini: ${formatRupiah(tx.finalBalance)}\nPetugas: ${tx.officerName}\n----------------------------\nTerima kasih telah rajin menabung untuk masa depan! ✨`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    showToast('Membuka WhatsApp untuk berbagi bukti...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Bukti Transaksi Resmi</h3>
              <p className="text-[11px] text-slate-400 font-medium">Buku Kas Digital Sekolah</p>
            </div>
          </div>
          <button
            onClick={closeReceiptModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Receipt Area */}
        <div id="printable-receipt" className="my-3 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col gap-3">
          {/* Receipt Brand */}
          <div className="text-center pb-2 border-b border-dashed border-slate-200">
            <span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase block">
              {schoolInfo.schoolName}
            </span>
            <h4 className="text-xs font-bold text-slate-800">{schoolInfo.subName}</h4>
            <span className="text-[9px] text-slate-400">T.A {schoolInfo.academicYear} • {schoolInfo.semester}</span>
          </div>

          {/* Transaction Summary Box */}
          <div className="text-center py-1 bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isDeposit ? 'Total Disetorkan' : 'Total Ditarik'}
            </span>
            <div className={`text-2xl font-extrabold tracking-tight mt-0.5 ${isDeposit ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isDeposit ? '+' : '-'} {formatRupiah(tx.amount)}
            </div>
            <p className="text-[10px] italic text-slate-500 mt-1">
              "{terbilangRupiah(tx.amount)}"
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>No. Ref:</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">{tx.transactionCode}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Waktu:</span>
              <span className="font-medium text-slate-700">{tx.date} • {tx.time}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Siswa:</span>
              <span className="font-bold text-slate-800">{tx.studentName}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>NIS / Kelas:</span>
              <span className="font-medium text-slate-700">{tx.studentNis} • {tx.className}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Pos Tabungan:</span>
              <span className="font-medium text-slate-700">{tx.category}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Keterangan:</span>
              <span className="font-medium text-slate-700 truncate max-w-[160px]">{tx.note}</span>
            </div>
            <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-baseline font-bold">
              <span className="text-slate-800">Saldo Akhir Baru:</span>
              <span className="text-sm text-emerald-700 font-extrabold">{formatRupiah(tx.finalBalance)}</span>
            </div>
          </div>

          {/* School Stamp Seal Visual */}
          <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-600/40 flex items-center justify-center -rotate-12 bg-emerald-50/50">
                <div className="text-center text-[7px] font-bold text-emerald-800 leading-tight">
                  <ShieldCheck className="w-3.5 h-3.5 mx-auto text-emerald-600" />
                  <span>SD SAH</span>
                </div>
              </div>
              <div className="flex flex-col text-[10px]">
                <span className="font-bold text-slate-700">Tercatat di Server</span>
                <span className="text-emerald-700 font-medium">Validasi Sah Sekolah</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <span className="block font-medium text-slate-600">{tx.officerName}</span>
              <span>Bendahara Kas</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handlePrint}
            className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kuitansi</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full h-11 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Kirim Bukti ke WhatsApp Wali Murid</span>
          </button>
        </div>
      </div>
    </div>
  );
};
