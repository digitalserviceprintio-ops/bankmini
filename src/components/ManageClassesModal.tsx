import React, { useState } from 'react';
import { useSavings } from '../context/SavingsContext';
import {
  X,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  School,
  Users,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatRupiah } from '../data/mockData';

interface ManageClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageClassesModal: React.FC<ManageClassesModalProps> = ({ isOpen, onClose }) => {
  const { classes, addClass, deleteClass, renameClass, students, schoolInfo, showToast } =
    useSavings();

  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast('Masukkan nama kelas baru', 'warning');
      return;
    }
    const success = addClass(newClassName.trim());
    if (success) {
      setNewClassName('');
    }
  };

  const startEdit = (cls: string) => {
    setEditingClass(cls);
    setEditingValue(cls);
  };

  const saveEdit = (oldCls: string) => {
    if (!editingValue.trim()) {
      showToast('Nama kelas tidak boleh kosong', 'warning');
      return;
    }
    const res = renameClass(oldCls, editingValue.trim());
    if (!res.success) {
      showToast(res.error || 'Gagal mengubah nama kelas', 'warning');
      return;
    }
    setEditingClass(null);
  };

  const handleDelete = (cls: string) => {
    const res = deleteClass(cls);
    if (!res.success) {
      showToast(res.error || 'Gagal menghapus kelas', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Pengaturan Rombongan Belajar / Kelas
              </h3>
              <p className="text-[11px] text-slate-500">
                {schoolInfo.schoolName} ({schoolInfo.institutionType || 'Sekolah'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-2.5 my-3">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-900 leading-snug">
            Kelola daftar kelas/rombel resmi sekolah. Setiap perubahan nama kelas akan otomatis
            memperbarui data buku kas seluruh siswa yang terdaftar.
          </p>
        </div>

        {/* Add Class Form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={newClassName}
              onChange={e => setNewClassName(e.target.value)}
              placeholder="Ketik nama kelas/rombel baru (misal: 1C, 7 Unggulan, Santri A)..."
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </form>

        {/* Classes List */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1">
            <span>Daftar Kelas Aktif ({classes.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Jumlah Siswa & Total Kas
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto border border-slate-200 rounded-2xl p-1 bg-white">
            {classes.map(cls => {
              const enrolled = students.filter(
                s => s.classId.toLowerCase() === cls.toLowerCase()
              );
              const totalClassBalance = enrolled.reduce((acc, curr) => acc + curr.balance, 0);
              const isEditing = editingClass === cls;

              return (
                <div
                  key={cls}
                  className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {cls.slice(0, 3)}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={e => setEditingValue(e.target.value)}
                          className="h-8 px-2.5 bg-white border border-emerald-500 rounded-lg text-xs font-bold text-slate-800 outline-none w-full"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(cls);
                            if (e.key === 'Escape') setEditingClass(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(cls)}
                          className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0"
                          title="Simpan"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingClass(null)}
                          className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0"
                          title="Batal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {cls.startsWith('Kelas') ||
                            cls.startsWith('Santri') ||
                            cls.startsWith('Kelompok')
                              ? cls
                              : `Kelas ${cls}`}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400">
                            ({cls})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-emerald-800">
                            {enrolled.length} siswa
                          </span>{' '}
                          • Kas: {formatRupiah(totalClassBalance)}
                        </p>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(cls)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                        title="Ubah Nama Kelas"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cls)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          enrolled.length > 0
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        }`}
                        title={
                          enrolled.length > 0
                            ? `Tidak dapat dihapus (${enrolled.length} siswa masih terdaftar)`
                            : 'Hapus Kelas'
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {classes.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-xs">
                Belum ada kelas terdaftar. Tambahkan kelas pertama di atas.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Selesai Mengatur Kelas
          </button>
        </div>
      </div>
    </div>
  );
};
