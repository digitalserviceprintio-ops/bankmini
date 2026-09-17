import React, { useState, useMemo } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import {
  X,
  Printer,
  FileText,
  Filter,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Building2,
  School,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface SavingsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsReportModal: React.FC<SavingsReportModalProps> = ({ isOpen, onClose }) => {
  const { schoolInfo, students, transactions, classes } = useSavings();

  // Filter States
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [dateMode, setDateMode] = useState<'all' | 'specific'>('all');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [reportType, setReportType] = useState<'all' | 'deposit' | 'withdraw'>('all');

  // Available Years extracted from transactions + current year
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    const currentYear = new Date().getFullYear().toString();
    yearsSet.add(currentYear);
    yearsSet.add((new Date().getFullYear() - 1).toString());

    transactions.forEach(t => {
      // date format: DD/MM/YYYY
      const parts = t.date.split('/');
      if (parts.length === 3) {
        yearsSet.add(parts[2]);
      }
    });

    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Months array
  const months = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Combined class list
  const allClassOptions = useMemo(() => {
    const fromStd = students.map(s => s.classId);
    return Array.from(new Set([...classes, ...fromStd])).filter(
      (c): c is string => Boolean(c && c !== '-')
    );
  }, [classes, students]);

  // Filtered transactions based on class, date, month, year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Filter Class
      if (selectedClass !== 'all') {
        const student = students.find(s => s.id === t.studentId);
        const matchesClass =
          (student && student.classId.toLowerCase() === selectedClass.toLowerCase()) ||
          t.className.toLowerCase().includes(selectedClass.toLowerCase());
        if (!matchesClass) return false;
      }

      // 2. Filter Type
      if (reportType !== 'all' && t.type !== reportType) {
        return false;
      }

      // Parse date: DD/MM/YYYY
      const dateParts = t.date.split('/');
      if (dateParts.length !== 3) return true;
      const [tDay, tMonth, tYear] = dateParts;

      // 3. Filter Year
      if (selectedYear !== 'all' && tYear !== selectedYear) {
        return false;
      }

      // 4. Filter Month
      if (selectedMonth !== 'all' && tMonth !== selectedMonth) {
        return false;
      }

      // 5. Filter Specific Date (YYYY-MM-DD to DD/MM/YYYY)
      if (dateMode === 'specific' && specificDate) {
        const [specYear, specMonth, specDay] = specificDate.split('-');
        if (tDay !== specDay || tMonth !== specMonth || tYear !== specYear) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, students, selectedClass, reportType, selectedYear, selectedMonth, dateMode, specificDate]);

  // Filtered Students list (according to class filter)
  const targetStudents = useMemo(() => {
    let list = students;
    if (selectedClass !== 'all') {
      list = list.filter(s => s.classId.toLowerCase() === selectedClass.toLowerCase());
    }
    return list;
  }, [students, selectedClass]);

  // Aggregate Student Report Rows
  const reportRows = useMemo(() => {
    return targetStudents.map((student, idx) => {
      const studentTxs = filteredTransactions.filter(t => t.studentId === student.id);
      const totalDeposit = studentTxs
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWithdraw = studentTxs
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        no: idx + 1,
        student,
        txCount: studentTxs.length,
        totalDeposit,
        totalWithdraw,
        finalBalance: student.balance,
      };
    });
  }, [targetStudents, filteredTransactions]);

  // Overall Totals
  const grandTotalDeposit = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const grandTotalWithdraw = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const grandTotalBalance = useMemo(() => {
    return targetStudents.reduce((sum, s) => sum + s.balance, 0);
  }, [targetStudents]);

  if (!isOpen) return null;

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Kelas',
      'No. Rekening',
      'Total Setoran (Rp)',
      'Total Penarikan (Rp)',
      'Saldo Akhir (Rp)',
      'Jumlah Transaksi',
    ];

    const rows = reportRows.map(r => [
      r.no,
      `'${r.student.nis}`,
      `"${r.student.name}"`,
      `"${r.student.className}"`,
      `'${r.student.accountNo}`,
      r.totalDeposit,
      r.totalWithdraw,
      r.finalBalance,
      r.txCount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Tabungan_${schoolInfo.schoolName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Period Label for Document Kop
  const getPeriodLabel = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    const monthName = monthObj && selectedMonth !== 'all' ? monthObj.label : 'Semua Bulan';
    const yearName = selectedYear !== 'all' ? selectedYear : 'Semua Tahun';

    if (dateMode === 'specific' && specificDate) {
      return `Tanggal: ${specificDate}`;
    }
    return `Periode: ${monthName} ${yearName}`;
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible print:z-auto">
      <div className="bg-slate-100 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 print:bg-white print:shadow-none print:max-h-none print:overflow-visible print:w-full print:rounded-none">
        
        {/* Top Action Bar (Screen Only - Hidden on Print) */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Rekap Laporan Tabungan Siswa
              </h3>
              <p className="text-[11px] text-slate-500">
                {schoolInfo.schoolName} • TA {schoolInfo.academicYear} ({schoolInfo.semester})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="h-9 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
              title="Ekspor ke format Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="h-9 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Cetak lembar laporan resmi atau simpan sebagai PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak PDF Resmi</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar (Screen Only - Hidden on Print) */}
        <div className="bg-white/95 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center gap-3 shrink-0 print:hidden text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter Rekap:</span>
          </div>

          {/* Filter Kelas */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Kelas:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer"
            >
              <option value="all">Semua Rombel</option>
              {allClassOptions.map(cls => (
                <option key={cls} value={cls}>
                  {cls.startsWith('Kelas') || cls.startsWith('Santri') || cls.startsWith('Kelompok')
                    ? cls
                    : `Kelas ${cls}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tahun */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Tahun:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Bulan */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Bulan:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tanggal */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Tanggal:</span>
            <select
              value={dateMode}
              onChange={e => setDateMode(e.target.value as 'all' | 'specific')}
              className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer mr-1"
            >
              <option value="all">Semua Tanggal</option>
              <option value="specific">Pilih Tanggal</option>
            </select>
            {dateMode === 'specific' && (
              <input
                type="date"
                value={specificDate}
                onChange={e => setSpecificDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-1.5 py-0.5 text-[11px] text-slate-800 font-medium outline-none"
              />
            )}
          </div>

          {/* Filter Tipe Transaksi */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Mutasi:</span>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as 'all' | 'deposit' | 'withdraw')}
              className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer"
            >
              <option value="all">Semua Mutasi</option>
              <option value="deposit">Hanya Setoran</option>
              <option value="withdraw">Hanya Penarikan</option>
            </select>
          </div>

          {/* Reset button */}
          {(selectedClass !== 'all' ||
            selectedYear !== 'all' ||
            selectedMonth !== 'all' ||
            dateMode !== 'all' ||
            reportType !== 'all') && (
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedYear('all');
                setSelectedMonth('all');
                setDateMode('all');
                setSpecificDate('');
                setReportType('all');
              }}
              className="text-[11px] font-bold text-rose-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Scrollable Report Sheet Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
          
          {/* Printable Official Document Container */}
          <div
            id="printable-savings-report"
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-4 print:max-w-none print:m-0 text-slate-900"
          >
            {/* 1. KOP SURAT RESMI KEDINASAN / SEKOLAH */}
            <div className="border-b-4 border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-4 sm:gap-6 justify-between">
                {/* Logo Sekolah */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  {schoolInfo.logoUrl ? (
                    <img
                      src={schoolInfo.logoUrl}
                      alt="Logo Sekolah"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl">
                      <School className="w-9 h-9" />
                    </div>
                  )}
                </div>

                {/* Kop Text Info */}
                <div className="flex-1 text-center">
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-700">
                    {schoolInfo.subName || 'DINAS PENDIDIKAN & KEBUDAYAAN'}
                  </h4>
                  <h2 className="text-base sm:text-xl font-extrabold tracking-tight uppercase text-slate-950 mt-0.5">
                    {schoolInfo.schoolName}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    NPSN: <span className="font-semibold">{schoolInfo.npsn || '-'}</span> • Jenjang:{' '}
                    <span className="font-semibold">{schoolInfo.institutionType || 'Sekolah'}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 italic mt-0.5">
                    {schoolInfo.address || 'Alamat Lembaga Pendidikan Resmi'}, {schoolInfo.city || 'Indonesia'}
                  </p>
                </div>

                <div className="w-16 sm:w-20 hidden sm:block shrink-0"></div>
              </div>
            </div>

            {/* 2. JUDUL DOKUMEN LAPORAN */}
            <div className="text-center my-4">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide underline underline-offset-4 text-slate-900">
                LAPORAN REKAPITULASI BUKU TABUNGAN & KAS SISWA
              </h3>
              <p className="text-xs text-slate-700 mt-1 font-semibold">
                {getPeriodLabel()} • Kelas:{' '}
                {selectedClass === 'all'
                  ? 'Semua Rombongan Belajar'
                  : `Kelas ${selectedClass}`}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tahun Ajaran {schoolInfo.academicYear} ({schoolInfo.semester})
              </p>
            </div>

            {/* 3. RINGKASAN DATA KAS (Metric Highlights) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="p-2 border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Total Siswa Terdata
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  {targetStudents.length} Siswa
                </span>
              </div>
              <div className="p-2 border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                  Total Setoran (+)
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-800">
                  {formatRupiah(grandTotalDeposit)}
                </span>
              </div>
              <div className="p-2 border-r border-slate-200 last:border-none">
                <span className="text-[10px] text-rose-700 uppercase font-bold block">
                  Total Penarikan (-)
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-rose-700">
                  {formatRupiah(grandTotalWithdraw)}
                </span>
              </div>
              <div className="p-2">
                <span className="text-[10px] text-slate-600 uppercase font-bold block">
                  Total Saldo Terhimpun
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-950">
                  {formatRupiah(grandTotalBalance)}
                </span>
              </div>
            </div>

            {/* 4. TABEL DETAIL REKAPITULASI */}
            <div className="overflow-x-auto my-4 border border-slate-300 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                    <th className="py-2 px-2 text-center w-8 border-r border-slate-300">No</th>
                    <th className="py-2 px-2.5 border-r border-slate-300">NIS</th>
                    <th className="py-2 px-3 border-r border-slate-300">Nama Siswa</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-center">Kelas</th>
                    <th className="py-2 px-2.5 border-r border-slate-300">No. Rek</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 text-right">
                      Setoran (+)
                    </th>
                    <th className="py-2 px-2.5 border-r border-slate-300 text-right">
                      Penarikan (-)
                    </th>
                    <th className="py-2 px-3 text-right border-r border-slate-300">
                      Saldo Akhir
                    </th>
                    <th className="py-2 px-2 text-center w-16">Paraf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportRows.map(row => (
                    <tr key={row.student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2 text-center text-slate-500 border-r border-slate-200 font-medium">
                        {row.no}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-slate-700 border-r border-slate-200">
                        {row.student.nis}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                        {row.student.name}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-200">
                        <span className="font-semibold">{row.student.classId}</span>
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500 border-r border-slate-200">
                        {row.student.accountNo}
                      </td>
                      <td className="py-2 px-2.5 text-right font-medium text-emerald-800 border-r border-slate-200">
                        {row.totalDeposit > 0 ? formatRupiah(row.totalDeposit) : '-'}
                      </td>
                      <td className="py-2 px-2.5 text-right font-medium text-rose-700 border-r border-slate-200">
                        {row.totalWithdraw > 0 ? formatRupiah(row.totalWithdraw) : '-'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-950 border-r border-slate-200">
                        {formatRupiah(row.finalBalance)}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-300 font-mono text-[10px]">
                        [ ... ]
                      </td>
                    </tr>
                  ))}

                  {reportRows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-400">
                        Tidak ada data siswa atau transaksi yang sesuai filter yang dipilih.
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Grand Total Row */}
                {reportRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-400 text-slate-900">
                      <td
                        colSpan={5}
                        className="py-2.5 px-3 text-center uppercase tracking-wide border-r border-slate-300"
                      >
                        TOTAL REKAPITULASI KAS SISWA
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-emerald-800 border-r border-slate-300 font-mono">
                        {formatRupiah(grandTotalDeposit)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-rose-700 border-r border-slate-300 font-mono">
                        {formatRupiah(grandTotalWithdraw)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-950 font-mono border-r border-slate-300">
                        {formatRupiah(grandTotalBalance)}
                      </td>
                      <td className="py-2.5 px-2 text-center text-[10px] text-slate-400">
                        SAH
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* 5. BLOK TANDA TANGAN & PENGESAHAN RESMI */}
            <div className="pt-6 mt-4 border-t border-slate-200">
              <div className="flex justify-between items-start text-xs text-slate-800">
                {/* Kolom Kiri: Kepala Sekolah */}
                <div className="text-center w-56">
                  <p className="font-semibold text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900 uppercase">
                    Kepala Sekolah / Pimpinan
                  </p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 italic">
                      (Tanda tangan & Stempel Lembaga)
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline uppercase">
                    {schoolInfo.headmasterName || 'Drs. H. Mulyadi, M.Pd'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    NIP. {schoolInfo.homeroomTeacherNip || '19700512 199603 1 002'}
                  </p>
                </div>

                {/* Kolom Kanan: Bendahara Sekolah */}
                <div className="text-center w-56">
                  <p className="font-semibold text-slate-600">
                    {schoolInfo.city || 'Indonesia'}, {currentDateFormatted}
                  </p>
                  <p className="font-bold text-slate-900 uppercase">
                    Bendahara / Petugas Tabungan
                  </p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 italic">
                      (Tanda tangan Petugas)
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline uppercase">
                    {schoolInfo.treasurerName || 'Ibu Siti Nurhaliza, S.Pd'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    NIP. {schoolInfo.treasurerNip || '19850314 200902 2 003'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info (Screen Only) */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 print:hidden">
          <span>
            Menampilkan <strong className="text-slate-800">{reportRows.length}</strong> siswa dan{' '}
            <strong className="text-slate-800">{filteredTransactions.length}</strong> mutasi transaksi.
          </span>
          <button
            onClick={onClose}
            className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Tutup Lembar Rekap
          </button>
        </div>

      </div>
    </div>
  );
};
