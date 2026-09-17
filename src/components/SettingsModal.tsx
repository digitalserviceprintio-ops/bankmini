import React, { useState, useEffect } from 'react';
import { useSavings } from '../context/SavingsContext';
import { InstitutionType } from '../types';
import {
  X,
  School,
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Phone,
  ShieldAlert,
  Sparkles,
  Building2,
  MapPin,
  Hash,
  User,
  Database,
  Server,
  Cloud,
  RefreshCw,
  Check,
} from 'lucide-react';

const PRESET_LOGOS = [
  {
    name: 'Lambang SimPel SD',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1VceHPI2tTkhJymkhwlFji8qLHYOY9gz899aZcYbu7a8m45Q-OZGH8fiQgVkK8v86cYGCtWu3PKYwFIQf_QMW3FPSerP1n8i5JhQnBhKUeQdxwUYtT72oSZEo_DBmaVFF373EhXLIn-676FdsuCape_2RXUAGqsLuk19SY9uWpD9Bqxqjp6fegkC42AXO3vSUCNClvkdYIyJdCFT1MFOc8ffzNZSMgJd7lAbILZSny89eC-L0dbl5pBT1M',
  },
  {
    name: 'Tut Wuri Handayani',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJVJZ4nJnOfNN5bOZrDhfSkrRC9M7e2Rb-bTbjhwSiTWI4Kxl6hC1o_-05PAuTT2Dqu8e6oWZorUDkpeemv3A1qAg5RPOEoX7jVRLKm50018Omh7z74VhLAUcI8X9w86OWD-oE47FyqVm7WaUDVG7ShJwB47HqK2D34OQKQvjWtEgfxEkZtT6C65rDCtJKA5LwcVCup4AStiO2PYkJ_sb1tWGdqWxx4RFcy7rZmbrdaqR0a5c9b7HO',
  },
  {
    name: 'Mascot Celengan Hijau',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDB68YZ6sEG8DDhgamabqnd1TtjNJbFmBaK85DUBPvXSlIOuSA2D0CBdtFKeAcNgeqY1ZCrjsEPRGdQ-htoIYzM8yoYDdpLycnkz1hxdi0-9083CF17Ghtl4Dl7BiVi09UISPKv33gFic2XOwpAzyb9jAOpAcvd1tB3GGZ3c94_aCJ5lvf8kLSazqjIGY9aXzrFieMd6if-DznBVt1pl1ylGAaWp_QOIGg5W2EAEUvVVq2sIdMKOB',
  },
];

const INSTITUTION_OPTIONS: { type: InstitutionType; icon: string; title: string }[] = [
  { type: 'SD/MI', icon: '🏫', title: 'SD / MI' },
  { type: 'SMP/MTs', icon: '🏛️', title: 'SMP / MTs' },
  { type: 'SMA/SMK/MA', icon: '🎓', title: 'SMA / SMK / MA' },
  { type: 'Pondok Pesantren', icon: '🕌', title: 'Pesantren' },
  { type: 'PAUD/TK/RA', icon: '🧸', title: 'PAUD / TK' },
  { type: 'Lembaga Pendidikan/Kursus', icon: '🏢', title: 'Kursus / Bimbel' },
];

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    schoolInfo,
    updateSchoolInfo,
    showToast,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
    currentAdmin,
  } = useSavings();

  const [activeTab, setActiveTab] = useState<'treasurer' | 'school' | 'academic' | 'database'>('treasurer');
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  // Form states initialized from schoolInfo
  const [treasurerName, setTreasurerName] = useState('');
  const [treasurerNip, setTreasurerNip] = useState('');
  const [treasurerPhone, setTreasurerPhone] = useState('');
  const [homeroomTeacherName, setHomeroomTeacherName] = useState('');

  const [schoolName, setSchoolName] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('SD/MI');
  const [npsn, setNpsn] = useState('');
  const [headmasterName, setHeadmasterName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [subName, setSubName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('Semester Ganjil');

  // Populate form when modal opens or schoolInfo changes
  useEffect(() => {
    if (isSettingsModalOpen) {
      setTreasurerName(schoolInfo.treasurerName || '');
      setTreasurerNip(schoolInfo.treasurerNip || '');
      setTreasurerPhone(schoolInfo.treasurerPhone || '');
      setHomeroomTeacherName(schoolInfo.homeroomTeacherName || '');
      
      setSchoolName(schoolInfo.schoolName || '');
      setInstitutionType(schoolInfo.institutionType || 'SD/MI');
      setNpsn(schoolInfo.npsn || '');
      setHeadmasterName(schoolInfo.headmasterName || '');
      setCity(schoolInfo.city || '');
      setAddress(schoolInfo.address || '');
      setSubName(schoolInfo.subName || '');
      setLogoUrl(schoolInfo.logoUrl || PRESET_LOGOS[0].url);

      setAcademicYear(schoolInfo.academicYear || '2024/2025');
      setSemester(schoolInfo.semester || 'Semester Ganjil');
    }
  }, [isSettingsModalOpen, schoolInfo]);

  if (!isSettingsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!treasurerName.trim()) {
      showToast('Nama bendahara tidak boleh kosong!', 'warning');
      setActiveTab('treasurer');
      return;
    }
    if (!schoolName.trim()) {
      showToast('Nama sekolah tidak boleh kosong!', 'warning');
      setActiveTab('school');
      return;
    }

    updateSchoolInfo({
      treasurerName: treasurerName.trim(),
      treasurerNip: treasurerNip.trim(),
      treasurerPhone: treasurerPhone.trim(),
      homeroomTeacherName: homeroomTeacherName.trim(),
      schoolName: schoolName.trim(),
      institutionType,
      npsn: npsn.trim(),
      headmasterName: headmasterName.trim(),
      city: city.trim(),
      address: address.trim(),
      subName: subName.trim(),
      logoUrl: logoUrl.trim(),
      academicYear: academicYear.trim(),
      semester,
    });

    closeSettingsModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Pengaturan Profil & Instansi Sekolah
              </h3>
              <p className="text-[11px] text-slate-500">
                Profil bendahara, identitas sekolah, & tahun ajaran
              </p>
            </div>
          </div>
          <button
            onClick={closeSettingsModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl my-3">
          <button
            type="button"
            onClick={() => setActiveTab('treasurer')}
            className={`py-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'treasurer'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Bendahara</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('school')}
            className={`py-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'school'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Identitas Sekolah</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'academic'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tahun Ajaran</span>
          </button>
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* TAB 1: BENDAHARA PROFIL */}
          {activeTab === 'treasurer' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Nama dan NIP bendahara tercetak secara otomatis pada kuitansi resmi setoran & penarikan kas tabungan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Bendahara / Petugas Kas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={treasurerName}
                  onChange={e => setTreasurerName(e.target.value)}
                  placeholder="Contoh: Ibu Siti Nurhaliza, S.Pd"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK Petugas
                </label>
                <input
                  type="text"
                  value={treasurerNip}
                  onChange={e => setTreasurerNip(e.target.value)}
                  placeholder="Contoh: 19850314 200902 2 003"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Dinas / Kasir
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={treasurerPhone}
                    onChange={e => setTreasurerPhone(e.target.value)}
                    placeholder="Contoh: 0812-4421-9901"
                    className="w-full h-11 px-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Digunakan sebagai nomor pengirim bukti kuitansi digital ke orang tua murid.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guru Wali / Verifikator Tambahan
                </label>
                <input
                  type="text"
                  value={homeroomTeacherName}
                  onChange={e => setHomeroomTeacherName(e.target.value)}
                  placeholder="Contoh: Siti Rahmawati, S.Pd."
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SEKOLAH PROFIL */}
          {activeTab === 'school' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-150">
              {/* Institution Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenjang / Tipe Lembaga Pendidikan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {INSTITUTION_OPTIONS.map(opt => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setInstitutionType(opt.type)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all ${
                        institutionType === opt.type
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span className="text-[11px] truncate">{opt.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah / Lembaga <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMP Negeri 1 Surabaya / Ponpes Al-Hikmah"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN / Kode Lembaga
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={npsn}
                      onChange={e => setNpsn(e.target.value)}
                      placeholder="Contoh: 20104921"
                      className="w-full h-10 px-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota / Kabupaten
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Contoh: Kota Surabaya"
                      className="w-full h-10 px-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kepala Sekolah / Pimpinan
                  </label>
                  <input
                    type="text"
                    value={headmasterName}
                    onChange={e => setHeadmasterName(e.target.value)}
                    placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Nama / Gugus / Wilayah
                  </label>
                  <input
                    type="text"
                    value={subName}
                    onChange={e => setSubName(e.target.value)}
                    placeholder="Contoh: Gugus Melati • Kec. Coblong"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Instansi
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Diponegoro No. 45, Surabaya"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Logo Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilihan Logo Instansi Sekolah
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {PRESET_LOGOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(p.url)}
                      className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                        logoUrl === p.url
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-9 h-9 p-1 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-1">
                        <img src={p.url} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar logo eksternal"
                    className="w-full h-10 px-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TAHUN AJARAN & SEMESTER */}
          {activeTab === 'academic' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran Aktif
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {['2024/2025', '2025/2026', '2026/2027'].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setAcademicYear(yr)}
                      className={`h-9 rounded-xl text-xs font-bold transition-all border ${
                        academicYear === yr
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  placeholder="Ketik manual, contoh: 2024/2025"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester Berjalan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Semester Ganjil', sub: 'Juli - Desember' },
                    { label: 'Semester Genap', sub: 'Januari - Juni' },
                  ].map(sem => (
                    <button
                      key={sem.label}
                      type="button"
                      onClick={() => setSemester(sem.label)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        semester === sem.label
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{sem.label}</span>
                        {semester === sem.label && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{sem.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Perubahan semester & tahun ajaran akan otomatis diperbarui di seluruh buku tabungan siswa.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={closeSettingsModal}
              className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Sekolah</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
