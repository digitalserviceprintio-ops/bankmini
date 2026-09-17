import React, { useState, useEffect } from 'react';
import { useSavings } from '../context/SavingsContext';
import { InstitutionType } from '../types';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  QrCode,
  UserPlus,
  LogIn,
  School,
  Building,
  Calendar,
  Phone,
  Check,
  Building2,
  MapPin,
  User,
  Hash,
  BookOpen,
  Baby,
  Landmark,
  Layers,
  Database,
} from 'lucide-react';

interface QuickPreset {
  label: string;
  type: InstitutionType;
  schoolName: string;
  npsn: string;
  headmaster: string;
  city: string;
  treasurerName: string;
  nip: string;
  username: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    label: '🏛️ SMP Negeri',
    type: 'SMP/MTs',
    schoolName: 'SMP Negeri 1 Merdeka',
    npsn: '20231940',
    headmaster: 'Drs. H. Bambang Irawan, M.Pd.',
    city: 'Kota Bandung',
    treasurerName: 'Ibu Ratna Dewi, S.E.',
    nip: '19870412 201101 2 006',
    username: 'bendahara.smpn1@merdeka.sch.id',
  },
  {
    label: '🎓 SMK Kejuruan',
    type: 'SMA/SMK/MA',
    schoolName: 'SMK Teknologi Grafika',
    npsn: '20304911',
    headmaster: 'Ir. Hendra Kusuma, M.T.',
    city: 'Kota Surabaya',
    treasurerName: 'Bpk. Ahmad Fauzi, S.Kom.',
    nip: '19890615 201503 1 004',
    username: 'kasir.smktg@sekolah.sch.id',
  },
  {
    label: '🕌 Pesantren',
    type: 'Pondok Pesantren',
    schoolName: 'Pondok Pesantren Darul Falah',
    npsn: '51003204',
    headmaster: 'K.H. Mansyur Hidayat, Lc.',
    city: 'Kab. Jombang',
    treasurerName: 'Ust. Ridwan Al-Farizi',
    nip: 'NUPTK: 7842-1983-021',
    username: 'keuangan.darulfalah@pesantren.id',
  },
  {
    label: '🧸 PAUD / TK',
    type: 'PAUD/TK/RA',
    schoolName: 'TK Pertiwi Ceria',
    npsn: '69018432',
    headmaster: 'Hj. Endang Sulastri, S.Pd.AUD.',
    city: 'Kota Yogyakarta',
    treasurerName: 'Ibu Maya Anggraini',
    nip: '19920811 201802 2 008',
    username: 'admin.tkpertiwi@ceriasekolah.id',
  },
];

const INSTITUTION_OPTIONS: { type: InstitutionType; icon: string; title: string; subtitle: string }[] = [
  {
    type: 'SD/MI',
    icon: '🏫',
    title: 'SD / MI',
    subtitle: 'Sekolah Dasar & Madrasah Ibtidaiyah',
  },
  {
    type: 'SMP/MTs',
    icon: '🏛️',
    title: 'SMP / MTs',
    subtitle: 'Sekolah Menengah Pertama & Tsanawiyah',
  },
  {
    type: 'SMA/SMK/MA',
    icon: '🎓',
    title: 'SMA / SMK / MA',
    subtitle: 'Sekolah Lanjutan Tingkat Atas & Kejuruan',
  },
  {
    type: 'Pondok Pesantren',
    icon: '🕌',
    title: 'Pondok Pesantren',
    subtitle: 'Santri, Asrama & Madrasah Diniyah',
  },
  {
    type: 'PAUD/TK/RA',
    icon: '🧸',
    title: 'PAUD / TK / RA',
    subtitle: 'Pendidikan Anak Usia Dini & Taman Kanak-Kanak',
  },
  {
    type: 'Lembaga Pendidikan/Kursus',
    icon: '🏢',
    title: 'Lembaga Kursus / Bimbel',
    subtitle: 'PKBM, Pusat Pelatihan & Les Privat',
  },
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    setUserRole,
    setActiveStudentById,
    showToast,
    schoolInfo,
    adminAccounts,
    currentAdmin,
    registerAdminAccount,
    switchAdminAccount,
    loginAdminAccount,
    authModalTab,
  } = useSavings();

  // Active view: 'student' | 'teacher-login' | 'teacher-register'
  const [activeTab, setActiveTab] = useState<'student' | 'teacher-login' | 'teacher-register'>('student');

  // Sync initial tab from context when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalTab === 'student') {
        setActiveTab('student');
      } else if (authModalTab === 'teacher-register') {
        setActiveTab('teacher-register');
      } else {
        setActiveTab('teacher-login');
      }
    }
  }, [isAuthModalOpen, authModalTab]);

  // Student form state
  const [nis, setNis] = useState('20240912');
  const [pin, setPin] = useState('050815');
  const [isPinVisible, setIsPinVisible] = useState(false);

  // Teacher login state
  const [loginIdentifier, setLoginIdentifier] = useState('19850314 200902 2 003');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Institution Register State
  const [regInstitutionType, setRegInstitutionType] = useState<InstitutionType>('SD/MI');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regNpsn, setRegNpsn] = useState('');
  const [regHeadmasterName, setRegHeadmasterName] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regSubName, setRegSubName] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [regAcademicYear, setRegAcademicYear] = useState('2024/2025');
  const [regSemester, setRegSemester] = useState('Semester Ganjil');
  const [regInitialMode, setRegInitialMode] = useState<'template' | 'empty'>('template');

  if (!isAuthModalOpen) return null;

  // Student Numpad handlers
  const handleNumpadPress = (val: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPin('');
  };

  const handleQuickFillStudent = () => {
    setNis('20240912');
    setPin('050815');
    showToast('Data Contoh Dimuat: M. Rizky Pratama (20240912)', 'info');
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nis.length < 4) {
      showToast('Masukkan NIS yang valid', 'warning');
      return;
    }
    if (pin.length < 6) {
      showToast('PIN harus 6 digit angka', 'warning');
      return;
    }

    setActiveStudentById(nis);
    setUserRole('orangtua');
    showToast('Berhasil masuk ke Portal Siswa & Wali Murid!', 'success');
    closeAuthModal();
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Masukkan NIP atau Email akun bendahara', 'warning');
      return;
    }

    const res = loginAdminAccount(loginIdentifier, loginPassword);
    if (!res.success) {
      showToast(res.error || 'Akun tidak ditemukan', 'warning');
      return;
    }
  };

  const applyPreset = (preset: QuickPreset) => {
    setRegInstitutionType(preset.type);
    setRegSchoolName(preset.schoolName);
    setRegNpsn(preset.npsn);
    setRegHeadmasterName(preset.headmaster);
    setRegCity(preset.city);
    setRegSubName(`Wilayah ${preset.city}`);
    setRegName(preset.treasurerName);
    setRegNip(preset.nip);
    setRegUsername(preset.username);
    setRegPhone('0812-4421-9901');
    setRegPassword('admin123');
    showToast(`Form diisi dengan template ${preset.label}`, 'info');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regSchoolName.trim()) {
      showToast('Nama instansi/sekolah wajib diisi!', 'warning');
      return;
    }
    if (!regName.trim()) {
      showToast('Nama bendahara/petugas kas wajib diisi!', 'warning');
      return;
    }
    if (!regUsername.trim()) {
      showToast('Email atau username bendahara wajib diisi!', 'warning');
      return;
    }

    const res = registerAdminAccount({
      schoolName: regSchoolName.trim(),
      institutionType: regInstitutionType,
      npsn: regNpsn.trim() || '20104921',
      headmasterName: regHeadmasterName.trim() || 'Kepala Sekolah',
      address: regAddress.trim() || (regCity ? `Jl. Raya Pendidikan, ${regCity}` : ''),
      city: regCity.trim() || 'Indonesia',
      subName: regSubName.trim() || (regCity ? `Wilayah ${regCity}` : 'Kabupaten/Kota'),
      name: regName.trim(),
      nip: regNip.trim() || '19900101 202001 1 001',
      phone: regPhone.trim() || '0812-3456-7890',
      username: regUsername.trim(),
      password: regPassword || 'password123',
      academicYear: regAcademicYear,
      semester: regSemester,
      initialMode: regInitialMode,
    });

    if (!res.success) {
      showToast(res.error || 'Gagal mendaftarkan akun', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center shrink-0">
              <img
                src={schoolInfo.logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider truncate">
                  {schoolInfo.schoolName}
                </span>
                <span className="text-[9px] font-semibold text-emerald-800/80 bg-emerald-100 px-1.5 py-0.2 rounded">
                  {schoolInfo.institutionType || 'Sekolah'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Aplikasi Buku Tabungan Digital Multi-Instansi
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Main Tabs: Siswa & Wali, Masuk Bendahara, Daftar Instansi Baru */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl my-3 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'student'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Siswa & Wali</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('teacher-login')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'teacher-login'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Kasir</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacher-register')}
            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 relative ${
              activeTab === 'teacher-register'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/70'
            }`}
          >
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>Daftar Sekolah</span>
            </div>
            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
              activeTab === 'teacher-register' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Semua Instansi
            </span>
          </button>
        </div>

        {/* ================= 1. STUDENT / PARENT VIEW ================= */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="flex flex-col gap-3 animate-in fade-in duration-150">
            {/* Quick Demo Pill */}
            <button
              type="button"
              onClick={handleQuickFillStudent}
              className="w-full bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/60 rounded-xl p-2.5 flex items-center justify-between text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Coba Akun Contoh Siswa</span>
                  <span className="text-xs font-semibold text-slate-800">M. Rizky Pratama • NIS: 20240912</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            {/* NIS Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Nomor Induk Siswa (NIS)</label>
                <span className="text-[10px] font-medium text-slate-400">Wajib Diisi</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={nis}
                  onChange={e => setNis(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 20240912"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => showToast('Gunakan kartu barcode atau ketik NIS siswa', 'info')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 p-1"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PIN Slots */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">PIN Keamanan Siswa (6 Angka)</label>
                <button
                  type="button"
                  onClick={() => setIsPinVisible(!isPinVisible)}
                  className="text-[10px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{isPinVisible ? 'Tutup' : 'Lihat'}</span>
                </button>
              </div>

              {/* 6 Boxes */}
              <div className="grid grid-cols-6 gap-1.5 my-1">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <div
                    key={idx}
                    className={`h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${
                      idx < pin.length
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {idx < pin.length ? (isPinVisible ? pin[idx] : '●') : ''}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                💡 <span className="font-semibold text-slate-600">Tips:</span> PIN standar 6 digit tanggal lahir (contoh: lahir 05-08-2015 ketik <strong className="text-emerald-700">050815</strong>).
              </p>
            </div>

            {/* Compact Numeric Keypad */}
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 my-1">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleNumpadPress(k)}
                    className="h-10 bg-white hover:bg-slate-100 active:bg-emerald-50 rounded-xl text-sm font-bold text-slate-800 border border-slate-200 shadow-xs flex items-center justify-center transition-all"
                  >
                    {k}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearPin}
                  className="h-10 bg-white hover:bg-slate-100 rounded-xl text-[11px] font-semibold text-rose-500 border border-slate-200 flex items-center justify-center"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadPress('0')}
                  className="h-10 bg-white hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-800 border border-slate-200 shadow-xs flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-10 bg-white hover:bg-slate-100 rounded-xl text-[11px] font-semibold text-slate-600 border border-slate-200 flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk & Buka Rekening Siswa</span>
            </button>
          </form>
        )}

        {/* ================= 2. TEACHER LOGIN VIEW ================= */}
        {activeTab === 'teacher-login' && (
          <form onSubmit={handleTeacherLogin} className="flex flex-col gap-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIP, NUPTK atau Email Login
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                placeholder="Contoh: 19850314 200902 2 003 / bendahara@sekolah.sch.id"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Akun
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard Kasir</span>
            </button>

            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('teacher-register')}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Ingin mendaftarkan sekolah atau lembaga baru? <strong>Daftar di sini</strong>
              </button>
            </div>
          </form>
        )}

        {/* ================= 3. MULTI-INSTITUTION REGISTRATION VIEW ================= */}
        {activeTab === 'teacher-register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5 animate-in fade-in duration-150">
            {/* Banner: Open to all schools */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-900 leading-snug">
                  Pendaftaran Buku Kas Tabungan Semua Instansi
                </p>
                <p className="text-[11px] text-emerald-800/90 mt-0.5">
                  Bisa digunakan untuk seluruh jenjang: SD/MI, SMP/MTs, SMA/SMK/MA, Pondok Pesantren, PAUD/TK, dan Lembaga Kursus. Setiap akun memiliki penyimpanan terpisah & mandiri.
                </p>
              </div>
            </div>

            {/* Quick Demo Templates / Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Isi Otomatis Contoh Instansi (Uji Coba Cepat):
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {QUICK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
                  >
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-800 block truncate">
                      {p.label}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {p.schoolName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: Pilih Jenjang Instansi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. Pilih Jenjang / Tipe Instansi Sekolah <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INSTITUTION_OPTIONS.map(opt => {
                  const isSelected = regInstitutionType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setRegInstitutionType(opt.type)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-lg leading-none shrink-0">{opt.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">{opt.title}</p>
                        <p className="text-[9px] text-slate-500 truncate mt-0.5">{opt.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Identitas Instansi & Sekolah */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                2. Data Resmi Sekolah / Lembaga
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Resmi Sekolah / Lembaga <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={e => setRegSchoolName(e.target.value)}
                    placeholder="Contoh: SMP Negeri 1 Surabaya / Ponpes Al-Hikmah"
                    className="w-full h-10 px-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                  <School className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    NPSN / Kode Lembaga
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regNpsn}
                      onChange={e => setRegNpsn(e.target.value)}
                      placeholder="Contoh: 20104921"
                      className="w-full h-10 px-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kota / Kabupaten
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regCity}
                      onChange={e => setRegCity(e.target.value)}
                      placeholder="Contoh: Kota Surabaya"
                      className="w-full h-10 px-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kepala Sekolah / Pimpinan
                  </label>
                  <input
                    type="text"
                    value={regHeadmasterName}
                    onChange={e => setRegHeadmasterName(e.target.value)}
                    placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kecamatan / Wilayah
                  </label>
                  <input
                    type="text"
                    value={regSubName}
                    onChange={e => setRegSubName(e.target.value)}
                    placeholder="Contoh: Gugus Melati • Kec. Sukolilo"
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: Bendahara & Akun Login */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                3. Profil Bendahara & Kredensial Login Kasir
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Lengkap Bendahara / Petugas Kas <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Contoh: Ibu Siti Aminah, S.E."
                    className="w-full h-10 px-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    NIP / NUPTK / ID Staf
                  </label>
                  <input
                    type="text"
                    value={regNip}
                    onChange={e => setRegNip(e.target.value)}
                    placeholder="19890514 201402 2 003"
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    No. WhatsApp Bendahara
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full h-10 px-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email / Username Login <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="bendahara@sekolah.sch.id"
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Buat sandi akun"
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tahun Ajaran
                  </label>
                  <select
                    value={regAcademicYear}
                    onChange={e => setRegAcademicYear(e.target.value)}
                    className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Semester
                  </label>
                  <select
                    value={regSemester}
                    onChange={e => setRegSemester(e.target.value)}
                    className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="Semester Ganjil">Ganjil</option>
                    <option value="Semester Genap">Genap</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 4: Mode Awal Pembukuan Kas (Template Siswa vs Bersih) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                4. Opsi Setup Awal Buku Kas
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegInitialMode('template')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    regInitialMode === 'template'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Muat Contoh Siswa
                    </span>
                    {regInitialMode === 'template' && (
                      <Check className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Otomatis menyediakan 2 siswa contoh sesuai jenjang ({regInstitutionType}) & saldo awal untuk langsung uji coba.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegInitialMode('empty')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    regInitialMode === 'empty'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      Mulai Kas Bersih (0 Siswa)
                    </span>
                    {regInitialMode === 'empty' && (
                      <Check className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Buku kas dimulai dengan saldo Rp 0 dan tanpa data sampel, siap diisi daftar siswa riil sekolah Anda.
                  </p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftarkan Instansi & Buka Buku Kas Sekolah</span>
            </button>

            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('teacher-login')}
                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700"
              >
                Sudah punya akun bendahara? <strong>Masuk di sini</strong>
              </button>
            </div>
          </form>
        )}

        {/* Security Badge */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Pembukuan Kas Digital Sekolah Terisolasi & Aman</span>
        </div>
      </div>
    </div>
  );
};
