export type UserRole = 'bendahara' | 'guru' | 'orangtua' | 'siswa';

export type ActiveTab = 'beranda' | 'transaksi' | 'siswa' | 'buku' | 'portal-ortu' | 'pindai';

export interface SavingTarget {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  icon?: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  classId: string;
  className: string;
  accountNo: string;
  bookNo: string;
  balance: number;
  photoUrl?: string;
  guardianName: string;
  guardianPhone: string;
  pin: string;
  savingTarget: SavingTarget;
  isRegularSaver: boolean;
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  transactionCode: string;
  date: string; // e.g. "2024-10-24" or "24/10/2024"
  time: string; // e.g. "08:15 WIB"
  studentId: string;
  studentName: string;
  studentNis: string;
  className: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  category: 'Tabungan Reguler' | 'Karyawisata 2025' | 'Buku Tematik' | 'Lainnya';
  note: string;
  officerName: string;
  previousBalance: number;
  finalBalance: number;
  verifiedBy: string;
  createdAt: number;
}

export type InstitutionType =
  | 'SD/MI'
  | 'SMP/MTs'
  | 'SMA/SMK/MA'
  | 'PAUD/TK/RA'
  | 'Pondok Pesantren'
  | 'Lembaga Pendidikan/Kursus'
  | 'Lembaga Lainnya';

export interface SchoolInfo {
  schoolName: string;
  institutionType?: InstitutionType;
  npsn?: string;
  headmasterName?: string;
  address?: string;
  city?: string;
  subName: string;
  academicYear: string;
  semester: string;
  treasurerName: string;
  treasurerNip: string;
  treasurerPhone?: string;
  homeroomTeacherName?: string;
  homeroomTeacherNip?: string;
  logoUrl: string;
}

export interface AdminAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  nip: string;
  phone?: string;
  schoolName: string;
  institutionType?: InstitutionType;
  npsn?: string;
  headmasterName?: string;
  address?: string;
  city?: string;
  subName: string;
  academicYear: string;
  semester: string;
  logoUrl?: string;
  createdAt: number;
}
