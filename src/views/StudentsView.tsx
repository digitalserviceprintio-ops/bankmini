import React, { useState, useMemo } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import { AddStudentModal } from '../components/AddStudentModal';
import { ManageClassesModal } from '../components/ManageClassesModal';
import {
  Search,
  UserPlus,
  QrCode,
  BookOpen,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  School,
  Building2,
  FolderOpen,
  Layers,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    selectedClassFilter,
    setSelectedClassFilter,
    setActiveStudent,
    setActiveTab,
    openQrModal,
    schoolInfo,
  } = useSavings();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageClassesOpen, setIsManageClassesOpen] = useState(false);

  // Dynamic classes extracted from configured classes and registered students
  const classList = useMemo(() => {
    const fromStudents = students.map(s => s.classId);
    const combined = Array.from(new Set([...classes, ...fromStudents])).filter(
      (c): c is string => Boolean(c && c !== '-')
    );
    const list = [{ id: 'all', label: 'Semua Rombel' }];
    combined.forEach(c => {
      const label =
        c.startsWith('Kelas') || c.startsWith('Santri') || c.startsWith('Kelompok')
          ? c
          : `Kelas ${c}`;
      list.push({ id: c, label });
    });
    return list;
  }, [students, classes]);

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.accountNo.toLowerCase().includes(search.toLowerCase());

    if (selectedClassFilter === 'all') return matchSearch;
    return matchSearch && s.classId.toLowerCase() === selectedClassFilter.toLowerCase();
  });

  const totalFilteredSavings = filteredStudents.reduce((acc, curr) => acc + curr.balance, 0);

  const handleSelectStudentForBook = (s: typeof students[0]) => {
    setActiveStudent(s);
    setActiveTab('buku');
  };

  const handleSelectStudentForDeposit = (s: typeof students[0]) => {
    setActiveStudent(s);
    setActiveTab('transaksi');
  };

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-3.5">
      {/* Top Banner with Student Count & Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">Daftar Rekening Siswa</h2>
          <p className="text-xs text-slate-500">
            {schoolInfo.schoolName} • Total {students.length} penabung
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManageClassesOpen(true)}
            className="h-10 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 active:scale-95 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
            title="Kelola Daftar Rombel / Kelas"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Atur Kelas</span>
            <span className="sm:hidden">Kelas</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Badge */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 rounded-2xl border border-emerald-200/60 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <School className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Rekap Kas {selectedClassFilter === 'all' ? 'Seluruh Kelas' : `Kelas ${selectedClassFilter}`}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {filteredStudents.length} Siswa Aktif Menabung
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Total Saldo Terhimpun</span>
          <span className="text-xs font-extrabold text-emerald-800">
            {formatRupiah(totalFilteredSavings)}
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari siswa berdasarkan nama, NIS, atau No Rek..."
          className="w-full h-11 pl-9 pr-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {/* Class Filter Horizontal Pill Carousel */}
      {classList.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar -mx-4 px-4">
          {classList.map(c => {
            const isSelected = selectedClassFilter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassFilter(c.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Student List */}
      <div className="space-y-2.5">
        {filteredStudents.map(s => {
          return (
            <div
              key={s.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {s.photoUrl ? (
                      <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-700 bg-emerald-100">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{s.name}</h4>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded">
                        {s.className}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      NIS: <strong className="text-slate-600">{s.nis}</strong> • Rek: {s.accountNo}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Wali: {s.guardianName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="text-[10px] text-slate-400">Saldo Tabungan</span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {formatRupiah(s.balance)}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full mt-1">
                    Buku: {s.bookNo}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => openQrModal(s)}
                  className="h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cetak Kartu</span>
                </button>

                <button
                  onClick={() => handleSelectStudentForDeposit(s)}
                  className="h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Setor Kas</span>
                </button>

                <button
                  onClick={() => handleSelectStudentForBook(s)}
                  className="h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buku Kas</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {students.length === 0 ? 'Buku Kas Masih Kosong' : 'Tidak Ada Siswa Ditemukan'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {students.length === 0
                ? `Belum ada siswa penabung yang terdaftar pada ${schoolInfo.schoolName}. Buka rekening siswa pertama sekarang!`
                : 'Tidak ada siswa yang sesuai dengan filter atau kata kunci pencarian.'}
            </p>
            {students.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 h-10 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Daftarkan Siswa Pertama</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Manage Classes Modal */}
      <ManageClassesModal
        isOpen={isManageClassesOpen}
        onClose={() => setIsManageClassesOpen(false)}
      />
    </div>
  );
};
