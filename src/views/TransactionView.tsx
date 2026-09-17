import React, { useState, useEffect } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah, terbilangRupiah } from '../data/mockData';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Save,
  RotateCcw,
  Calendar,
  Bookmark,
  FileText,
  ShieldCheck,
  UserCheck,
  MessageCircle,
  Phone,
} from 'lucide-react';

export const TransactionView: React.FC = () => {
  const {
    students,
    activeStudent,
    setActiveStudent,
    transactions,
    addTransaction,
    showToast,
    openReceiptModal,
    schoolInfo,
    setActiveTab,
  } = useSavings();

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(25000);
  const [inputStr, setInputStr] = useState<string>('25.000');
  const [category, setCategory] = useState<'Tabungan Reguler' | 'Karyawisata 2025' | 'Buku Tematik' | 'Lainnya'>('Tabungan Reguler');
  const [note, setNote] = useState<string>('Tabungan mingguan rutin');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showStudentPicker, setShowStudentPicker] = useState<boolean>(false);
  const [guardianPhoneInput, setGuardianPhoneInput] = useState<string>(activeStudent.guardianPhone || '');

  // Synchronize guardian phone input when active student changes
  useEffect(() => {
    setGuardianPhoneInput(activeStudent.guardianPhone || '');
  }, [activeStudent.id, activeStudent.guardianPhone]);

  const isDeposit = mode === 'deposit';
  const previousBalance = activeStudent.balance;
  const finalBalance = isDeposit ? previousBalance + amount : previousBalance - amount;
  const isOverdraw = !isDeposit && amount > previousBalance;

  const handleAmountChange = (val: string) => {
    const rawNumber = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    setAmount(rawNumber);
    setInputStr(rawNumber ? rawNumber.toLocaleString('id-ID') : '0');
  };

  const handleQuickChip = (val: number) => {
    setAmount(val);
    setInputStr(val.toLocaleString('id-ID'));
  };

  const handleResetAmount = () => {
    setAmount(0);
    setInputStr('0');
  };

  // Helper to format WhatsApp phone number (normalize 08xx or +62xx to 62xx)
  const formatWhatsAppPhone = (phone?: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  // Send transaction receipt via WhatsApp
  const sendWhatsAppMutation = (tx: (typeof transactions)[0]) => {
    const isDep = tx.type === 'deposit';
    const actionText = isDep ? 'SETORAN TABUNGAN (+)' : 'PENARIKAN KAS (-)';
    const targetPhone = formatWhatsAppPhone(guardianPhoneInput || activeStudent.guardianPhone);

    const message =
`*BUKTI MUTASI TABUNGAN SISWA*
*${schoolInfo.schoolName.toUpperCase()}*
_${schoolInfo.subName || 'Buku Kas Digital Sekolah'}_
-------------------------------------------
Kepada Yth. Bapak/Ibu *${activeStudent.guardianName || 'Orang Tua / Wali'}*,
Berikut kami sampaikan rincian mutasi tabungan ananda:

👤 *Nama Siswa:* ${tx.studentName}
🆔 *NIS:* ${tx.studentNis} (${tx.className})
📖 *No. Rekening:* ${activeStudent.accountNo} (Buku: ${activeStudent.bookNo})
🔖 *No. Transaksi:* ${tx.transactionCode}
📅 *Waktu:* ${tx.date} • ${tx.time}

-------------------------------------------
📌 *Jenis Transaksi:* ${actionText}
💰 *Nominal:* *${isDep ? '+' : '-'} ${formatRupiah(tx.amount)}*
📝 *Terbilang:* _${terbilangRupiah(tx.amount)}_
📂 *Pos Tabungan:* ${tx.category}
💬 *Catatan:* ${tx.note}
-------------------------------------------

💵 *Saldo Sebelumnya:* ${formatRupiah(tx.previousBalance)}
💳 *SALDO AKHIR TERKINI:* *${formatRupiah(tx.finalBalance)}*

👨‍🏫 *Petugas / Bendahara:* ${tx.officerName}
-------------------------------------------
_Terima kasih telah membimbing ananda rajin menabung sejak dini. Simpan pesan ini sebagai bukti mutasi tabungan yang sah._ ✨`;

    const encoded = encodeURIComponent(message);
    const waUrl = targetPhone ? `https://wa.me/${targetPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp untuk mengirim bukti mutasi...', 'info');
  };

  // Send current balance statement via WhatsApp
  const sendCurrentSummaryWhatsApp = () => {
    const studentTxs = transactions
      .filter(t => t.studentId === activeStudent.id)
      .slice(0, 3);
    const targetPhone = formatWhatsAppPhone(guardianPhoneInput || activeStudent.guardianPhone);

    let txListText = '';
    if (studentTxs.length > 0) {
      txListText =
        `\n📋 *3 Mutasi Terakhir:*\n` +
        studentTxs
          .map(
            t =>
              `• ${t.date} (${t.type === 'deposit' ? '+' : '-'} ${formatRupiah(t.amount)}) - ${t.note}`
          )
          .join('\n') +
        `\n`;
    }

    const message =
`*RINGKASAN TABUNGAN SISWA*
*${schoolInfo.schoolName.toUpperCase()}*
-------------------------------------------
Kepada Yth. Bapak/Ibu *${activeStudent.guardianName || 'Orang Tua / Wali'}*,
Berikut adalah ringkasan saldo tabungan ananda:

👤 *Nama Siswa:* ${activeStudent.name}
🆔 *NIS:* ${activeStudent.nis} (${activeStudent.className})
📖 *No. Rekening:* ${activeStudent.accountNo}
💳 *Saldo Terkini:* *${formatRupiah(activeStudent.balance)}*
${txListText}
-------------------------------------------
_Terima kasih atas dukungan Ayah/Bunda mendampingi ananda aktif menabung._ ✨`;

    const encoded = encodeURIComponent(message);
    const waUrl = targetPhone ? `https://wa.me/${targetPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp untuk mengirim ringkasan saldo...', 'info');
  };

  const handleSubmit = (actionType: 'print' | 'save' | 'whatsapp') => {
    if (amount <= 0) {
      showToast('Nominal transaksi harus lebih dari 0!', 'warning');
      return;
    }

    if (isOverdraw) {
      showToast('Saldo tidak mencukupi untuk penarikan ini!', 'warning');
      return;
    }

    const res = addTransaction({
      studentId: activeStudent.id,
      type: mode,
      amount,
      category,
      note: note || (isDeposit ? 'Setoran Tabungan Rutin' : 'Penarikan Kas Siswa'),
      officerName: schoolInfo.treasurerName,
    });

    if (res.success && res.transaction) {
      showToast(
        `${isDeposit ? 'Setoran' : 'Penarikan'} ${formatRupiah(amount)} untuk ${activeStudent.name} berhasil!`,
        'success'
      );
      if (actionType === 'print') {
        openReceiptModal(res.transaction);
      } else if (actionType === 'whatsapp') {
        sendWhatsAppMutation(res.transaction);
      }
    } else {
      showToast(res.error || 'Gagal memproses transaksi', 'warning');
    }
  };

  const filteredStudents = students.filter(
    s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.nis.includes(searchQuery)
  );

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-3.5">
      {/* Friendly Context Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate">Pencatatan Kas Siswa</h3>
            <p className="text-[11px] text-slate-500 truncate">Siswa rajin menabung, masa depan gemilang!</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      {/* Segmented Control: Setoran vs Penarikan */}
      <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-inner">
        <button
          type="button"
          onClick={() => setMode('deposit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            isDeposit
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Setoran (Masuk)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('withdraw')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            !isDeposit
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Penarikan (Keluar)</span>
        </button>
      </div>

      {/* Student Identity Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Identitas Siswa
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('pindai')}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" /> Scan Kartu
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setShowStudentPicker(!showStudentPicker)}
              className="text-[11px] font-bold text-slate-600 hover:text-emerald-700"
            >
              {showStudentPicker ? 'Tutup' : 'Ganti Siswa'}
            </button>
          </div>
        </div>

        {/* Search Student Dropdown (Collapsible) */}
        {showStudentPicker && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 animate-in fade-in duration-150">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIS siswa..."
                className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
              {filteredStudents.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveStudent(st);
                    setShowStudentPicker(false);
                    setSearchQuery('');
                  }}
                  className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors ${
                    st.id === activeStudent.id
                      ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="block truncate">{st.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {st.className} • NIS: {st.nis}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 shrink-0 ml-2">
                    {formatRupiah(st.balance)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Selected Student Box */}
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 w-[52px] h-[52px] shadow-sm">
                {activeStudent.photoUrl ? (
                  <img
                    src={activeStudent.photoUrl}
                    alt={activeStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-sm text-slate-700 bg-emerald-100">
                    {activeStudent.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {activeStudent.name}
                </h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeStudent.className}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                NIS: <strong className="text-slate-700">{activeStudent.nis}</strong> • Wali: {activeStudent.guardianName}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px]">
                <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">
                  Buku: {activeStudent.bookNo}
                </span>
                <span className="bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  Rajin Menabung
                </span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Summary Trigger in Student Info */}
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                WA Wali:{' '}
                <strong className="text-slate-800 font-mono">
                  {guardianPhoneInput || activeStudent.guardianPhone || 'Belum diatur'}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={sendCurrentSummaryWhatsApp}
              className="h-6 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
              title="Kirim ringkasan saldo terkini siswa ke WhatsApp orang tua"
            >
              <MessageCircle className="w-3 h-3 text-emerald-700" />
              <span>Kirim Saldo ke WA</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Saldo Aktif Saat Ini</span>
            <span className="text-sm font-extrabold text-emerald-700">
              {formatRupiah(activeStudent.balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Nominal Input Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nominal Transaksi
          </label>
          <span className="text-[11px] font-bold text-emerald-700">
            Kelipatan Rp 1.000
          </span>
        </div>

        {/* Big Bold Currency Input */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {isDeposit ? 'Jumlah Disetorkan' : 'Jumlah Ditarik'}
          </span>
          <div className="flex items-baseline justify-center gap-1.5 w-full">
            <span className="text-xl font-bold text-slate-400">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputStr}
              onChange={e => handleAmountChange(e.target.value)}
              className="text-3xl font-extrabold text-slate-900 bg-transparent text-center outline-none w-full max-w-[240px] tracking-tight font-display"
            />
          </div>
          <p className="text-xs italic text-slate-500 mt-1 text-center font-medium">
            "{terbilangRupiah(amount)}"
          </p>
        </div>

        {/* Quick Amount Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Pilihan Nominal Cepat:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[5000, 10000, 20000, 25000, 50000, 100000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickChip(val)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  amount === val
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                +{(val / 1000)}rb
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetAmount}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Nominal
            </button>
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="rounded-2xl p-3 bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Saldo Sebelumnya</span>
            <span className="font-semibold text-slate-800">{formatRupiah(previousBalance)}</span>
          </div>

          <div className="flex justify-between text-xs font-bold">
            <span className={isDeposit ? 'text-emerald-700' : 'text-rose-600'}>
              {isDeposit ? '+ Setoran Baru' : '- Penarikan Kas'}
            </span>
            <span className={isDeposit ? 'text-emerald-700' : 'text-rose-600'}>
              {isDeposit ? '+' : '-'} {formatRupiah(amount)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
            <div>
              <span className="text-xs text-slate-800 block">Saldo Akhir Baru</span>
              <span className="text-[10px] text-slate-400 font-normal">Akan tercetak di buku</span>
            </div>
            <span
              className={`text-base font-extrabold ${
                isOverdraw ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {formatRupiah(Math.max(0, finalBalance))}
            </span>
          </div>

          {/* Validation Alert */}
          {isOverdraw ? (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Peringatan: Saldo tabungan tidak mencukupi untuk penarikan ini!</span>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Validasi aman: Rekening aktif & buku tabungan terverifikasi.</span>
            </div>
          )}
        </div>
      </div>

      {/* Categories & Transaction Notes Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        {/* Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tanggal Transaksi</span>
          </label>
          <div className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Hari ini (24 Oktober 2024)</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
              Otomatis
            </span>
          </div>
        </div>

        {/* Saving Categories */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Pos Tabungan Siswa</span>
          </label>
          <div className="flex gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {(['Tabungan Reguler', 'Karyawisata 2025', 'Buku Tematik', 'Lainnya'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  category === cat
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Keterangan / Catatan Transaksi</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Tuliskan catatan transaksi..."
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Officer Stamp */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800">{schoolInfo.treasurerName}</span>
              <span className="text-[10px] text-slate-400">Wali Kelas / Bendahara Sekolah</span>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* WhatsApp Parent Notification Target Section */}
      <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/90 flex flex-col gap-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Kirim Struk ke WhatsApp Orang Tua</h4>
              <p className="text-[10px] text-slate-500">
                Pesan WhatsApp terformat rapi berisi rincian saldo dan mutasi
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
            WhatsApp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={guardianPhoneInput}
              onChange={e => setGuardianPhoneInput(e.target.value)}
              placeholder="Nomor WA Orang Tua (contoh: 08123456789)"
              className="w-full h-9.5 pl-8 pr-3 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        </div>
        <p className="text-[10px] text-emerald-800/80 italic">
          *Pesan WhatsApp akan terkirim langsung ke wali murid (<strong>{activeStudent.guardianName}</strong>)
        </p>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Tombol Kirim via WhatsApp */}
        <button
          type="button"
          onClick={() => handleSubmit('whatsapp')}
          disabled={isOverdraw}
          className="w-full h-12.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span>Kirim via WhatsApp ({isDeposit ? 'Setoran' : 'Penarikan'})</span>
        </button>

        {/* Tombol Simpan & Cetak Bukti Fisik */}
        <button
          type="button"
          onClick={() => handleSubmit('print')}
          disabled={isOverdraw}
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Simpan & Cetak Struk Fisik</span>
        </button>

        {/* Tombol Simpan Saja */}
        <button
          type="button"
          onClick={() => handleSubmit('save')}
          disabled={isOverdraw}
          className="w-full h-10 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] disabled:opacity-50 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-slate-500" />
          <span>Simpan Saja (Tanpa Kirim/Cetak)</span>
        </button>
      </div>
    </div>
  );
};
