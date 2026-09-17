import React, { useState, useEffect, useRef } from 'react';
import { useSavings } from '../context/SavingsContext';
import { X, UserPlus, Check, Sparkles, School, Camera, Image as ImageIcon, Trash2, Upload } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, showToast, schoolInfo, classes } = useSavings();

  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [classId, setClassId] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('20000');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default avatar suggestions
  const avatarPresets = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  useEffect(() => {
    if (isOpen) {
      const defaultClass = classes[0] || '1A';
      setClassId(defaultClass);
      setIsCustomClass(false);
      setCustomClass('');
      setPhotoUrl('');
    }
  }, [isOpen, classes]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar (maksimal 2.5 MB)', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        setPhotoUrl(result);
        showToast('Foto profil siswa berhasil dimuat!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nis.trim()) {
      showToast('Nama dan NIS wajib diisi!', 'warning');
      return;
    }

    const finalClass = isCustomClass ? (customClass.trim() || 'Kelas 1') : classId;
    const depositNum = parseInt(initialDeposit.replace(/[^0-9]/g, ''), 10) || 0;

    const newStudent = addStudent({
      name: name.trim(),
      nis: nis.trim(),
      classId: finalClass,
      guardianName: guardianName.trim() || 'Wali Murid',
      guardianPhone: guardianPhone.trim() || '0812-xxxx-xxxx',
      initialDeposit: depositNum,
      photoUrl: photoUrl.trim() || undefined,
    });

    showToast(`Siswa baru ${newStudent.name} (${finalClass}) berhasil didaftarkan!`, 'success');
    onClose();

    // Reset form
    setName('');
    setNis('');
    setGuardianName('');
    setGuardianPhone('');
    setInitialDeposit('20000');
    setPhotoUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pendaftaran Siswa Baru</h3>
              <p className="text-[11px] text-slate-500">
                {schoolInfo.schoolName} ({schoolInfo.institutionType || 'Sekolah'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-3">
          {/* Foto Profil Siswa (Upload Galeri) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Foto Profil Siswa (Dari Galeri / File)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center border-2 border-dashed border-emerald-300">
                    <Camera className="w-6 h-6" />
                    <span className="text-[9px] font-bold mt-0.5">Foto</span>
                  </div>
                )}
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700"
                    title="Hapus Foto"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-9 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{photoUrl ? 'Ganti Foto dari Galeri' : 'Pilih Foto dari Galeri'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Atau pilih preset:</span>
                  <div className="flex gap-1">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(preset)}
                        className={`w-6 h-6 rounded-lg overflow-hidden border transition-all ${
                          photoUrl === preset ? 'border-emerald-500 scale-110' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Siswa / Santri <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Muhammad Farhan Alamsyah"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIS / ID Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nis}
                onChange={e => setNis(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="2024xxxx"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Kelas / Rombel
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomClass(!isCustomClass)}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  {isCustomClass ? 'Pilih Daftar' : '+ Ketik Baru'}
                </button>
              </div>

              {isCustomClass ? (
                <input
                  type="text"
                  value={customClass}
                  onChange={e => setCustomClass(e.target.value)}
                  placeholder="Ketik nama kelas/kamar"
                  className="w-full h-11 px-3 bg-emerald-50/50 border border-emerald-400 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white"
                  autoFocus
                />
              ) : (
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  className="w-full h-11 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  {classes.map(c => (
                    <option key={c} value={c}>
                      {c.startsWith('Kelas') || c.startsWith('Santri') || c.startsWith('Kelompok') ? c : `Kelas ${c}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Orang Tua / Wali Murid
            </label>
            <input
              type="text"
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              placeholder="Contoh: Bpk. Heru Wibowo"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. WhatsApp Wali (Pengiriman Bukti Kuitansi)
            </label>
            <input
              type="tel"
              value={guardianPhone}
              onChange={e => setGuardianPhone(e.target.value)}
              placeholder="Contoh: 0812-4455-6677"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Setoran Awal Buka Rekening
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="text"
                value={initialDeposit}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInitialDeposit(val);
                }}
                placeholder="20000"
                className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {['10000', '20000', '50000', '100000'].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setInitialDeposit(amt)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                    initialDeposit === amt
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  +{parseInt(amt, 10).toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 mt-1">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[10px] text-emerald-800 leading-tight">
              Foto profil, nomor rekening, kartu QR identitas, dan buku kas digital otomatis diterbitkan setelah pendaftaran.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Daftarkan Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
