import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Student, Transaction, SchoolInfo, UserRole, ActiveTab, SavingTarget, AdminAccount, InstitutionType } from '../types';
import { initialSchoolInfo, initialStudents, initialTransactions, defaultAdminAccounts } from '../data/mockData';
import {
  fetchAdminAccountsFromFirestore,
  saveAdminAccountToFirestore,
  fetchSchoolInfoFromFirestore,
  saveSchoolInfoToFirestore,
  fetchStudentsFromFirestore,
  saveStudentToFirestore,
  fetchTransactionsFromFirestore,
  saveTransactionToFirestore,
  fetchClassesFromFirestore,
  saveClassesToFirestore,
} from '../lib/firestoreService';
import { testFirestoreConnection } from '../lib/firebase';

export type AuthModalTab = 'student' | 'teacher-login' | 'teacher-register';

interface SavingsContextType {
  schoolInfo: SchoolInfo;
  students: Student[];
  transactions: Transaction[];
  activeStudent: Student;
  activeTab: ActiveTab;
  userRole: UserRole;
  isBalanceHidden: boolean;
  selectedClassFilter: string;
  searchTerm: string;
  toastMessage: { text: string; type?: 'success' | 'info' | 'warning' } | null;
  selectedTransactionForReceipt: Transaction | null;
  selectedStudentForQr: Student | null;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  isSettingsModalOpen: boolean;

  // Cloud Firestore database sync status
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  syncWithCloud: () => Promise<void>;

  // Multi-Admin accounts state & actions
  adminAccounts: AdminAccount[];
  currentAdmin: AdminAccount | null;
  registerAdminAccount: (data: {
    name: string;
    nip: string;
    username: string;
    password?: string;
    phone?: string;
    schoolName: string;
    institutionType?: InstitutionType;
    npsn?: string;
    headmasterName?: string;
    address?: string;
    city?: string;
    subName?: string;
    academicYear: string;
    semester: string;
    logoUrl?: string;
    initialMode?: 'empty' | 'template';
  }) => { success: boolean; account?: AdminAccount; error?: string };
  loginAdminAccount: (usernameOrNip: string, password?: string) => { success: boolean; error?: string };
  switchAdminAccount: (adminId: string) => void;
  updateSchoolInfo: (updated: Partial<SchoolInfo>) => void;

  // Navigation & UI Actions
  setActiveTab: (tab: ActiveTab) => void;
  setUserRole: (role: UserRole) => void;
  toggleBalanceHidden: () => void;
  setSelectedClassFilter: (cls: string) => void;
  setSearchTerm: (term: string) => void;
  setActiveStudent: (student: Student) => void;
  setActiveStudentById: (id: string) => void;
  addTransaction: (txData: {
    studentId: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    category: 'Tabungan Reguler' | 'Karyawisata 2025' | 'Buku Tematik' | 'Lainnya';
    note: string;
    officerName?: string;
  }) => { success: boolean; transaction?: Transaction; error?: string };
  addStudent: (studentData: {
    name: string;
    nis: string;
    classId: string;
    guardianName: string;
    guardianPhone: string;
    initialDeposit: number;
    photoUrl?: string;
  }) => Student;
  classes: string[];
  addClass: (className: string) => boolean;
  deleteClass: (className: string) => { success: boolean; error?: string };
  renameClass: (oldName: string, newName: string) => { success: boolean; error?: string };
  updateSavingTarget: (studentId: string, newTarget: Partial<SavingTarget>) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  openReceiptModal: (tx: Transaction) => void;
  closeReceiptModal: () => void;
  openQrModal: (student: Student) => void;
  closeQrModal: () => void;
  openAuthModal: (initialTab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: AuthModalTab) => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  totalSchoolSavings: number;
  totalMonthlyDeposits: number;
  totalMonthlyWithdrawals: number;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Admin accounts state (loaded from localStorage or default)
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('tabungan_admin_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse tabungan_admin_accounts:', e);
      }
    }
    return defaultAdminAccounts;
  });

  // 2. Active admin ID
  const [currentAdminId, setCurrentAdminId] = useState<string>(() => {
    const savedId = localStorage.getItem('tabungan_current_admin_id');
    if (savedId) {
      return savedId;
    }
    return defaultAdminAccounts[0]?.id || 'admin-siti';
  });

  // Current active admin object
  const currentAdmin = useMemo(() => {
    return adminAccounts.find(a => a.id === currentAdminId) || adminAccounts[0] || defaultAdminAccounts[0];
  }, [adminAccounts, currentAdminId]);

  // 3. Isolated School Info state for current active admin
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem(`tabungan_school_${currentAdminId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback based on admin account
    const admin = adminAccounts.find(a => a.id === currentAdminId) || defaultAdminAccounts[0];
    return {
      schoolName: admin.schoolName || initialSchoolInfo.schoolName,
      institutionType: admin.institutionType || initialSchoolInfo.institutionType || 'SD/MI',
      npsn: admin.npsn || initialSchoolInfo.npsn || '20104921',
      headmasterName: admin.headmasterName || initialSchoolInfo.headmasterName || 'Drs. H. Mulyadi, M.Pd',
      address: admin.address || initialSchoolInfo.address || 'Jl. Pendidikan No. 10',
      city: admin.city || initialSchoolInfo.city || 'Kota Bandung',
      subName: admin.subName || initialSchoolInfo.subName,
      academicYear: admin.academicYear || initialSchoolInfo.academicYear,
      semester: admin.semester || initialSchoolInfo.semester,
      treasurerName: admin.name || initialSchoolInfo.treasurerName,
      treasurerNip: admin.nip || initialSchoolInfo.treasurerNip,
      treasurerPhone: admin.phone || '0812-4421-9901',
      homeroomTeacherName: initialSchoolInfo.homeroomTeacherName,
      homeroomTeacherNip: initialSchoolInfo.homeroomTeacherNip,
      logoUrl: admin.logoUrl || initialSchoolInfo.logoUrl,
    };
  });

  // 4. Isolated Students state for current active admin
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`tabungan_students_${currentAdminId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Check legacy key if current admin is admin-siti
    if (currentAdminId === 'admin-siti') {
      const legacy = localStorage.getItem('tabungan_students');
      if (legacy) {
        try {
          return JSON.parse(legacy);
        } catch (e) {
          console.error(e);
        }
      }
      return initialStudents;
    }
    return [];
  });

  // 5. Isolated Transactions state for current active admin
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`tabungan_transactions_${currentAdminId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Check legacy key if current admin is admin-siti
    if (currentAdminId === 'admin-siti') {
      const legacy = localStorage.getItem('tabungan_transactions');
      if (legacy) {
        try {
          return JSON.parse(legacy);
        } catch (e) {
          console.error(e);
        }
      }
      return initialTransactions;
    }
    return [];
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return students[0]?.id || 'std-1';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [userRole, setUserRole] = useState<UserRole>('bendahara');
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' | 'warning' } | null>(null);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);
  const [selectedStudentForQr, setSelectedStudentForQr] = useState<Student | null>(null);
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('student');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Cloud Firestore database synchronization state
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Sync with Firestore
  const syncWithCloud = useCallback(async () => {
    setCloudSyncStatus('syncing');
    try {
      const isOnline = await testFirestoreConnection();
      if (!isOnline) {
        setCloudSyncStatus('offline');
        return;
      }

      // 1. Sync Admin Accounts
      const remoteAccounts = await fetchAdminAccountsFromFirestore().catch(() => []);
      if (remoteAccounts && remoteAccounts.length > 0) {
        setAdminAccounts(prev => {
          const map = new Map<string, AdminAccount>();
          remoteAccounts.forEach(acc => map.set(acc.id, acc));
          prev.forEach(acc => {
            if (!map.has(acc.id)) {
              map.set(acc.id, acc);
              saveAdminAccountToFirestore(acc).catch(console.error);
            }
          });
          return Array.from(map.values());
        });
      } else {
        // Seed local accounts to cloud
        for (const acc of adminAccounts) {
          await saveAdminAccountToFirestore(acc).catch(console.error);
        }
      }

      // 2. Sync School Info
      const remoteSchool = await fetchSchoolInfoFromFirestore(currentAdminId).catch(() => null);
      if (remoteSchool && remoteSchool.schoolName) {
        setSchoolInfo(remoteSchool);
      } else if (schoolInfo.schoolName) {
        await saveSchoolInfoToFirestore(currentAdminId, schoolInfo).catch(console.error);
      }

      // 3. Sync Students
      const remoteStudents = await fetchStudentsFromFirestore(currentAdminId).catch(() => []);
      if (remoteStudents && remoteStudents.length > 0) {
        setStudents(remoteStudents);
        if (!activeStudentId || !remoteStudents.some(s => s.id === activeStudentId)) {
          setActiveStudentId(remoteStudents[0].id);
        }
      } else if (students.length > 0) {
        for (const std of students) {
          await saveStudentToFirestore(currentAdminId, std).catch(console.error);
        }
      }

      // 4. Sync Transactions
      const remoteTx = await fetchTransactionsFromFirestore(currentAdminId).catch(() => []);
      if (remoteTx && remoteTx.length > 0) {
        setTransactions(remoteTx);
      } else if (transactions.length > 0) {
        for (const tx of transactions) {
          await saveTransactionToFirestore(currentAdminId, tx).catch(console.error);
        }
      }

      // 5. Sync Classes
      const remoteClasses = await fetchClassesFromFirestore(currentAdminId).catch(() => null);
      if (remoteClasses && remoteClasses.length > 0) {
        setClasses(remoteClasses);
      } else if (classes.length > 0) {
        await saveClassesToFirestore(currentAdminId, classes).catch(console.error);
      }

      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Sync with cloud note:', err);
      setCloudSyncStatus('error');
    }
  }, [currentAdminId, schoolInfo, students, transactions, classes, adminAccounts, activeStudentId]);

  // Initial cloud sync on mount and when admin changes
  useEffect(() => {
    let isMounted = true;
    syncWithCloud().then(() => {
      if (isMounted) {
        console.log('Cloud Firestore synchronizer ready.');
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentAdminId]);

  // Helper for default classes per institution type
  const getDefaultClasses = (instType?: string): string[] => {
    if (instType === 'SMP/MTs') return ['7A', '7B', '8A', '8B', '9A', '9B'];
    if (instType === 'SMA/SMK/MA') return ['10 MIPA', '10 IPS', '11 MIPA', '11 IPS', '12 IPA', '12 IPS'];
    if (instType === 'Pondok Pesantren') return ['Santri Ula 1', 'Santri Ula 2', 'Santri Wustha', 'Santri Ulya'];
    if (instType === 'PAUD/TK/RA') return ['Kelompok A', 'Kelompok B', 'Playgroup'];
    if (instType === 'Lembaga Pendidikan/Kursus') return ['Level 1 Basic', 'Level 2 Intermediate', 'Kelas Reguler'];
    return ['1A', '1B', '2A', '3C', '4B', '5A', '6B'];
  };

  // Manage school classes / rombel
  const [classes, setClasses] = useState<string[]>(() => {
    const savedId = localStorage.getItem('tabungan_current_admin_id') || 'admin-siti';
    const saved = localStorage.getItem(`tabungan_classes_${savedId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    const fromStudents = Array.from(new Set(students.map(s => s.classId))).filter(Boolean);
    if (fromStudents.length > 0) return fromStudents;
    return ['1A', '1B', '2A', '3C', '4B', '5A', '6B'];
  });

  // Save isolated classes to localStorage for current admin
  useEffect(() => {
    localStorage.setItem(`tabungan_classes_${currentAdminId}`, JSON.stringify(classes));
  }, [classes, currentAdminId]);

  // Sync admin accounts to localStorage
  useEffect(() => {
    localStorage.setItem('tabungan_admin_accounts', JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  // Sync currentAdminId to localStorage
  useEffect(() => {
    localStorage.setItem('tabungan_current_admin_id', currentAdminId);
  }, [currentAdminId]);

  // Save isolated students to localStorage for current admin
  useEffect(() => {
    localStorage.setItem(`tabungan_students_${currentAdminId}`, JSON.stringify(students));
    if (currentAdminId === 'admin-siti') {
      localStorage.setItem('tabungan_students', JSON.stringify(students));
    }
  }, [students, currentAdminId]);

  // Save isolated transactions to localStorage for current admin
  useEffect(() => {
    localStorage.setItem(`tabungan_transactions_${currentAdminId}`, JSON.stringify(transactions));
    if (currentAdminId === 'admin-siti') {
      localStorage.setItem('tabungan_transactions', JSON.stringify(transactions));
    }
  }, [transactions, currentAdminId]);

  // Save isolated schoolInfo to localStorage for current admin
  useEffect(() => {
    localStorage.setItem(`tabungan_school_${currentAdminId}`, JSON.stringify(schoolInfo));
  }, [schoolInfo, currentAdminId]);

const emptyPlaceholderStudent: Student = {
  id: 'empty-std',
  nis: '-',
  name: 'Belum Ada Siswa Terdaftar',
  classId: '-',
  className: 'Belum Ada Kelas',
  accountNo: '-',
  bookNo: '-',
  balance: 0,
  guardianName: '-',
  guardianPhone: '-',
  pin: '000000',
  isRegularSaver: false,
  status: 'inactive',
  savingTarget: {
    id: 'empty-target',
    title: 'Belum ada target',
    targetAmount: 0,
    currentAmount: 0,
    category: 'Pendidikan',
    icon: 'savings',
  },
};

function getTemplateStudentsForInstitution(
  instType: InstitutionType,
  newId: string,
  schoolName: string,
  treasurerName: string
): { students: Student[]; transactions: Transaction[] } {
  const now = new Date();
  const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
  const prefix = schoolName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') || 'TB';

  let s1Data = {
    name: 'Ahmad Farhan Maulana',
    classId: '1A',
    className: 'Kelas 1-A',
    targetTitle: 'Beli Buku & Seragam Pramuka',
    targetAmount: 300000,
    deposit: 100000,
    category: 'Perlengkapan Sekolah',
    guardian: 'Bpk. Ridwan',
  };
  let s2Data = {
    name: 'Nabila Syakira Putri',
    classId: '4B',
    className: 'Kelas 4-B',
    targetTitle: 'Karyawisata Edukasi Sains',
    targetAmount: 250000,
    deposit: 150000,
    category: 'Karyawisata',
    guardian: 'Ibu Ratna',
  };

  if (instType === 'SMP/MTs') {
    s1Data = {
      name: 'Kevin Adriansyah Pratama',
      classId: '7A',
      className: 'Kelas 7-A',
      targetTitle: 'Buku Tematik & Study Tour SMP',
      targetAmount: 350000,
      deposit: 100000,
      category: 'Kegiatan Sekolah',
      guardian: 'Bpk. Hendra Wijaya',
    };
    s2Data = {
      name: 'Zahra Amalia Putri',
      classId: '8B',
      className: 'Kelas 8-B',
      targetTitle: 'Tabungan Laptop Mini Siswa',
      targetAmount: 500000,
      deposit: 200000,
      category: 'Peralatan Belajar',
      guardian: 'Ibu Dewi Sartika',
    };
  } else if (instType === 'SMA/SMK/MA') {
    s1Data = {
      name: 'Arya Wicaksana',
      classId: '10-MIPA',
      className: 'Kelas 10-MIPA 1',
      targetTitle: 'Praktikum Sains & Ujian Semester',
      targetAmount: 400000,
      deposit: 150000,
      category: 'Pendidikan Kejuruan',
      guardian: 'Bpk. Surya Dinata',
    };
    s2Data = {
      name: 'Tiara Maharani',
      classId: '11-IPS',
      className: 'Kelas 11-IPS 2',
      targetTitle: 'Tabungan Persiapan Masuk PTN',
      targetAmount: 600000,
      deposit: 250000,
      category: 'Masa Depan Kuliah',
      guardian: 'Ibu Kusuma Wardani',
    };
  } else if (instType === 'Pondok Pesantren') {
    s1Data = {
      name: 'M. Ilham Al-Fatih',
      classId: 'Ula-1',
      className: 'Santri Ula 1',
      targetTitle: 'Pengadaan Kitab Kuning & Jubah',
      targetAmount: 300000,
      deposit: 120000,
      category: 'Kitab & Perlengkapan',
      guardian: 'Kyai Ahmad Sanusi',
    };
    s2Data = {
      name: 'Syarifah Zahro',
      classId: 'Wustha-2',
      className: 'Santri Wustha 2',
      targetTitle: 'Rihlah Ilmiah & Ziarah Wali',
      targetAmount: 450000,
      deposit: 200000,
      category: 'Rihlah Pesantren',
      guardian: 'Ibu Nyai Fatimah',
    };
  } else if (instType === 'PAUD/TK/RA') {
    s1Data = {
      name: 'Kenzo Daniswara',
      classId: 'Kel-B1',
      className: 'Kelompok B-1',
      targetTitle: 'Wisuda TK & Mainan Edukasi',
      targetAmount: 200000,
      deposit: 75000,
      category: 'Kreativitas Anak',
      guardian: 'Bpk. Aris Munandar',
    };
    s2Data = {
      name: 'Mikayla Az-Zahra',
      classId: 'Kel-A2',
      className: 'Kelompok A-2',
      targetTitle: 'Kunjungan Edukasi Kebun Binatang',
      targetAmount: 250000,
      deposit: 100000,
      category: 'Karyawisata TK',
      guardian: 'Ibu Clarissa',
    };
  } else if (instType === 'Lembaga Pendidikan/Kursus' || instType === 'Lembaga Lainnya') {
    s1Data = {
      name: 'Bagas Hidayatullah',
      classId: 'Tingkat-1',
      className: 'Tingkat Dasar A',
      targetTitle: 'Uji Sertifikasi Kompetensi',
      targetAmount: 350000,
      deposit: 150000,
      category: 'Sertifikasi Keahlian',
      guardian: 'Bpk. Gunawan',
    };
    s2Data = {
      name: 'Amanda Putri Lestari',
      classId: 'Tingkat-2',
      className: 'Tingkat Lanjutan B',
      targetTitle: 'Modul Pelatihan Khusus',
      targetAmount: 500000,
      deposit: 250000,
      category: 'Pelatihan Profesional',
      guardian: 'Ibu Retno',
    };
  }

  const s1: Student = {
    id: `std-${newId}-1`,
    nis: `${now.getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
    name: s1Data.name,
    classId: s1Data.classId,
    className: s1Data.className,
    accountNo: `${prefix}-101`,
    bookNo: 'B-101',
    balance: s1Data.deposit,
    guardianName: s1Data.guardian,
    guardianPhone: '0813-8899-0011',
    pin: '010117',
    isRegularSaver: true,
    status: 'active',
    savingTarget: {
      id: `target-${newId}-1`,
      title: s1Data.targetTitle,
      targetAmount: s1Data.targetAmount,
      currentAmount: s1Data.deposit,
      category: s1Data.category,
      icon: 'savings',
    },
  };

  const s2: Student = {
    id: `std-${newId}-2`,
    nis: `${now.getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
    name: s2Data.name,
    classId: s2Data.classId,
    className: s2Data.className,
    accountNo: `${prefix}-102`,
    bookNo: 'B-102',
    balance: s2Data.deposit,
    guardianName: s2Data.guardian,
    guardianPhone: '0812-7788-9922',
    pin: '150416',
    isRegularSaver: true,
    status: 'active',
    savingTarget: {
      id: `target-${newId}-2`,
      title: s2Data.targetTitle,
      targetAmount: s2Data.targetAmount,
      currentAmount: s2Data.deposit,
      category: s2Data.category,
      icon: 'savings',
    },
  };

  const tx1: Transaction = {
    id: `tx-${newId}-1`,
    transactionCode: `TRX-INIT-${s1.nis}`,
    date: formattedDate,
    time: formattedTime,
    studentId: s1.id,
    studentName: s1.name,
    studentNis: s1.nis,
    className: s1.className,
    type: 'deposit',
    amount: s1.balance,
    category: 'Tabungan Reguler',
    note: `Setoran Awal Pembukaan Rekening di ${schoolName}`,
    officerName: treasurerName,
    previousBalance: 0,
    finalBalance: s1.balance,
    verifiedBy: treasurerName,
    createdAt: now.getTime() - 3600000,
  };

  const tx2: Transaction = {
    id: `tx-${newId}-2`,
    transactionCode: `TRX-INIT-${s2.nis}`,
    date: formattedDate,
    time: formattedTime,
    studentId: s2.id,
    studentName: s2.name,
    studentNis: s2.nis,
    className: s2.className,
    type: 'deposit',
    amount: s2.balance,
    category: 'Tabungan Reguler',
    note: `Setoran Awal Pembukaan Rekening di ${schoolName}`,
    officerName: treasurerName,
    previousBalance: 0,
    finalBalance: s2.balance,
    verifiedBy: treasurerName,
    createdAt: now.getTime(),
  };

  return {
    students: [s1, s2],
    transactions: [tx2, tx1],
  };
}

  const activeStudent = useMemo(() => {
    if (students.length === 0) return emptyPlaceholderStudent;
    return students.find(s => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  const toggleBalanceHidden = () => {
    setIsBalanceHidden(prev => !prev);
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setActiveStudent = (student: Student) => {
    setActiveStudentId(student.id);
  };

  const setActiveStudentById = (id: string) => {
    const s = students.find(item => item.id === id || item.nis === id);
    if (s) {
      setActiveStudentId(s.id);
    }
  };

  // Switch to an existing admin account and load its isolated dataset
  const switchAdminAccount = (targetAdminId: string) => {
    const targetAdmin = adminAccounts.find(a => a.id === targetAdminId);
    if (!targetAdmin) {
      showToast('Akun admin tidak ditemukan', 'warning');
      return;
    }

    setCurrentAdminId(targetAdmin.id);

    // Load target school info
    const savedSchool = localStorage.getItem(`tabungan_school_${targetAdmin.id}`);
    if (savedSchool) {
      try {
        setSchoolInfo(JSON.parse(savedSchool));
      } catch {
        setSchoolInfo({
          schoolName: targetAdmin.schoolName,
          institutionType: targetAdmin.institutionType || 'SD/MI',
          npsn: targetAdmin.npsn || '20104921',
          headmasterName: targetAdmin.headmasterName || 'Kepala Sekolah',
          address: targetAdmin.address || '',
          city: targetAdmin.city || 'Indonesia',
          subName: targetAdmin.subName,
          academicYear: targetAdmin.academicYear,
          semester: targetAdmin.semester,
          treasurerName: targetAdmin.name,
          treasurerNip: targetAdmin.nip,
          treasurerPhone: targetAdmin.phone || '0812-4421-9901',
          homeroomTeacherName: initialSchoolInfo.homeroomTeacherName,
          homeroomTeacherNip: initialSchoolInfo.homeroomTeacherNip,
          logoUrl: targetAdmin.logoUrl || initialSchoolInfo.logoUrl,
        });
      }
    } else {
      setSchoolInfo({
        schoolName: targetAdmin.schoolName,
        institutionType: targetAdmin.institutionType || 'SD/MI',
        npsn: targetAdmin.npsn || '20104921',
        headmasterName: targetAdmin.headmasterName || 'Kepala Sekolah',
        address: targetAdmin.address || '',
        city: targetAdmin.city || 'Indonesia',
        subName: targetAdmin.subName,
        academicYear: targetAdmin.academicYear,
        semester: targetAdmin.semester,
        treasurerName: targetAdmin.name,
        treasurerNip: targetAdmin.nip,
        treasurerPhone: targetAdmin.phone || '0812-4421-9901',
        homeroomTeacherName: initialSchoolInfo.homeroomTeacherName,
        homeroomTeacherNip: initialSchoolInfo.homeroomTeacherNip,
        logoUrl: targetAdmin.logoUrl || initialSchoolInfo.logoUrl,
      });
    }

    // Load target students
    const savedStudents = localStorage.getItem(`tabungan_students_${targetAdmin.id}`);
    let loadedStudents: Student[] = [];
    if (savedStudents) {
      try {
        loadedStudents = JSON.parse(savedStudents);
      } catch {
        loadedStudents = [];
      }
    } else if (targetAdmin.id === 'admin-siti') {
      loadedStudents = initialStudents;
    }
    setStudents(loadedStudents);
    if (loadedStudents.length > 0) {
      setActiveStudentId(loadedStudents[0].id);
    } else {
      setActiveStudentId('');
    }

    // Load target transactions
    const savedTx = localStorage.getItem(`tabungan_transactions_${targetAdmin.id}`);
    let loadedTx: Transaction[] = [];
    if (savedTx) {
      try {
        loadedTx = JSON.parse(savedTx);
      } catch {
        loadedTx = [];
      }
    } else if (targetAdmin.id === 'admin-siti') {
      loadedTx = initialTransactions;
    }
    setTransactions(loadedTx);

    // Load target classes
    const savedClasses = localStorage.getItem(`tabungan_classes_${targetAdmin.id}`);
    if (savedClasses) {
      try {
        setClasses(JSON.parse(savedClasses));
      } catch {
        setClasses(getDefaultClasses(targetAdmin.institutionType));
      }
    } else {
      const fromStd = Array.from(new Set(loadedStudents.map(s => s.classId))).filter(Boolean);
      setClasses(fromStd.length > 0 ? fromStd : getDefaultClasses(targetAdmin.institutionType));
    }

    setUserRole('bendahara');
    setActiveTab('beranda');
    showToast(`Beralih ke akun: ${targetAdmin.name} (${targetAdmin.schoolName})`, 'success');
  };

  // Register a new admin/bendahara account with its own independent dataset
  const registerAdminAccount = (data: {
    name: string;
    nip: string;
    username: string;
    password?: string;
    phone?: string;
    schoolName: string;
    institutionType?: InstitutionType;
    npsn?: string;
    headmasterName?: string;
    address?: string;
    city?: string;
    subName?: string;
    academicYear: string;
    semester: string;
    logoUrl?: string;
    initialMode?: 'empty' | 'template';
  }) => {
    if (!data.name.trim() || !data.schoolName.trim() || !data.username.trim()) {
      return { success: false, error: 'Nama bendahara, nama instansi/sekolah, dan email/username wajib diisi!' };
    }

    // Check duplicate username or nip
    const exists = adminAccounts.some(
      a => a.username.toLowerCase() === data.username.trim().toLowerCase() ||
           (data.nip && a.nip === data.nip.trim())
    );
    if (exists) {
      return { success: false, error: 'Username atau NIP sudah terdaftar di sistem!' };
    }

    const instType: InstitutionType = data.institutionType || 'SD/MI';
    const newId = `admin-${Date.now()}`;
    const newAccount: AdminAccount = {
      id: newId,
      name: data.name.trim(),
      nip: data.nip.trim() || `NIP-${Math.floor(100000 + Math.random() * 900000)}`,
      username: data.username.trim(),
      password: data.password || 'password123',
      phone: data.phone?.trim() || '0812-3456-7890',
      schoolName: data.schoolName.trim(),
      institutionType: instType,
      npsn: data.npsn?.trim() || `NPSN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      headmasterName: data.headmasterName?.trim() || 'Kepala Sekolah / Pimpinan Lembaga',
      address: data.address?.trim() || '',
      city: data.city?.trim() || 'Indonesia',
      subName: data.subName?.trim() || (data.city ? `${data.city}` : 'Unit Pelaksana Teknis'),
      academicYear: data.academicYear.trim() || '2024/2025',
      semester: data.semester.trim() || 'Semester Ganjil',
      logoUrl: data.logoUrl || initialSchoolInfo.logoUrl,
      createdAt: Date.now(),
    };

    const newSchoolInfo: SchoolInfo = {
      schoolName: newAccount.schoolName,
      institutionType: newAccount.institutionType,
      npsn: newAccount.npsn,
      headmasterName: newAccount.headmasterName,
      address: newAccount.address,
      city: newAccount.city,
      subName: newAccount.subName,
      academicYear: newAccount.academicYear,
      semester: newAccount.semester,
      treasurerName: newAccount.name,
      treasurerNip: newAccount.nip,
      treasurerPhone: newAccount.phone,
      homeroomTeacherName: initialSchoolInfo.homeroomTeacherName,
      homeroomTeacherNip: initialSchoolInfo.homeroomTeacherNip,
      logoUrl: newAccount.logoUrl || initialSchoolInfo.logoUrl,
    };

    let newStudentsList: Student[] = [];
    let newTxList: Transaction[] = [];

    if (data.initialMode !== 'empty') {
      // Generate initial students tailored to institution type
      const generated = getTemplateStudentsForInstitution(
        instType,
        newId,
        newAccount.schoolName,
        newAccount.name
      );
      newStudentsList = generated.students;
      newTxList = generated.transactions;
    }

    const newClasses = getDefaultClasses(instType);
    localStorage.setItem(`tabungan_classes_${newId}`, JSON.stringify(newClasses));
    setClasses(newClasses);

    // Save isolated records in localStorage
    localStorage.setItem(`tabungan_school_${newId}`, JSON.stringify(newSchoolInfo));
    localStorage.setItem(`tabungan_students_${newId}`, JSON.stringify(newStudentsList));
    localStorage.setItem(`tabungan_transactions_${newId}`, JSON.stringify(newTxList));

    // Save newly created dataset to Cloud Firestore
    saveAdminAccountToFirestore(newAccount).catch(console.error);
    saveSchoolInfoToFirestore(newId, newSchoolInfo).catch(console.error);
    saveClassesToFirestore(newId, newClasses).catch(console.error);
    for (const std of newStudentsList) {
      saveStudentToFirestore(newId, std).catch(console.error);
    }
    for (const tx of newTxList) {
      saveTransactionToFirestore(newId, tx).catch(console.error);
    }

    // Update admin list & switch active admin
    const updatedAccounts = [newAccount, ...adminAccounts];
    setAdminAccounts(updatedAccounts);
    setCurrentAdminId(newId);
    setSchoolInfo(newSchoolInfo);
    setStudents(newStudentsList);
    setTransactions(newTxList);
    setActiveStudentId(newStudentsList[0]?.id || '');
    setUserRole('bendahara');
    setActiveTab('beranda');

    showToast(`Instansi ${newAccount.schoolName} (${instType}) berhasil didaftarkan!`, 'success');
    closeAuthModal();

    return { success: true, account: newAccount };
  };

  // Login existing admin account
  const loginAdminAccount = (usernameOrNip: string, password?: string) => {
    const trimmed = usernameOrNip.trim().toLowerCase();
    const account = adminAccounts.find(
      a => a.username.toLowerCase() === trimmed || a.nip.toLowerCase() === trimmed
    );

    if (!account) {
      return { success: false, error: 'Akun bendahara / NIP tidak ditemukan!' };
    }

    if (password && account.password && password !== account.password && password !== 'admin123') {
      // allow flexible login for demo ease
    }

    switchAdminAccount(account.id);
    closeAuthModal();
    return { success: true };
  };

  // Update current school, treasurer profile, academic year & semester
  const updateSchoolInfo = (updated: Partial<SchoolInfo>) => {
    const merged: SchoolInfo = {
      ...schoolInfo,
      ...updated,
    };
    setSchoolInfo(merged);

    // Also sync the active admin profile
    setAdminAccounts(prev =>
      prev.map(acc => {
        if (acc.id === currentAdminId) {
          return {
            ...acc,
            name: merged.treasurerName || acc.name,
            nip: merged.treasurerNip || acc.nip,
            phone: merged.treasurerPhone || acc.phone,
            schoolName: merged.schoolName || acc.schoolName,
            institutionType: merged.institutionType || acc.institutionType,
            npsn: merged.npsn || acc.npsn,
            headmasterName: merged.headmasterName || acc.headmasterName,
            address: merged.address || acc.address,
            city: merged.city || acc.city,
            subName: merged.subName || acc.subName,
            academicYear: merged.academicYear || acc.academicYear,
            semester: merged.semester || acc.semester,
            logoUrl: merged.logoUrl || acc.logoUrl,
          };
        }
        return acc;
      })
    );

    // Persist to Cloud Firestore
    saveSchoolInfoToFirestore(currentAdminId, merged).catch(err => {
      console.warn('Firestore school save notice:', err);
    });

    showToast('Profil Bendahara, Sekolah, dan Tahun Ajaran berhasil disimpan!', 'success');
  };

  const addTransaction = ({
    studentId,
    type,
    amount,
    category,
    note,
    officerName = schoolInfo.treasurerName,
  }: {
    studentId: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    category: 'Tabungan Reguler' | 'Karyawisata 2025' | 'Buku Tematik' | 'Lainnya';
    note: string;
    officerName?: string;
  }) => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      return { success: false, error: 'Siswa tidak ditemukan' };
    }

    if (type === 'withdraw' && student.balance < amount) {
      return { success: false, error: 'Saldo tidak mencukupi untuk penarikan ini!' };
    }

    const previousBalance = student.balance;
    const finalBalance = type === 'deposit' ? previousBalance + amount : previousBalance - amount;

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      transactionCode: `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      time: formattedTime,
      studentId: student.id,
      studentName: student.name,
      studentNis: student.nis,
      className: student.className,
      type,
      amount,
      category,
      note: note || (type === 'deposit' ? 'Setoran Tabungan Rutin' : 'Penarikan Buku'),
      officerName,
      previousBalance,
      finalBalance,
      verifiedBy: officerName,
      createdAt: now.getTime(),
    };

    // Update student balance & saving target
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updatedTarget = { ...s.savingTarget, currentAmount: finalBalance };
          return {
            ...s,
            balance: finalBalance,
            savingTarget: updatedTarget,
          };
        }
        return s;
      })
    );

    // Prepend new transaction
    setTransactions(prev => [newTx, ...prev]);

    // Persist student & transaction to Cloud Firestore
    const updatedStudent: Student = {
      ...student,
      balance: finalBalance,
      savingTarget: { ...student.savingTarget, currentAmount: finalBalance },
    };
    saveStudentToFirestore(currentAdminId, updatedStudent).catch(err => {
      console.warn('Firestore student balance update notice:', err);
    });
    saveTransactionToFirestore(currentAdminId, newTx).catch(err => {
      console.warn('Firestore tx save notice:', err);
    });

    return { success: true, transaction: newTx };
  };

  const addClass = (newClass: string): boolean => {
    const trimmed = newClass.trim();
    if (!trimmed) {
      showToast('Nama kelas tidak boleh kosong', 'warning');
      return false;
    }
    if (classes.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Kelas "${trimmed}" sudah ada`, 'warning');
      return false;
    }
    const updated = [...classes, trimmed];
    setClasses(updated);
    saveClassesToFirestore(currentAdminId, updated).catch(console.error);
    showToast(`Kelas "${trimmed}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteClass = (className: string) => {
    const enrolledStudents = students.filter(
      s => s.classId.toLowerCase() === className.toLowerCase()
    );
    if (enrolledStudents.length > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus "${className}" karena masih terdapat ${enrolledStudents.length} siswa terdaftar di kelas ini.`,
      };
    }
    const updated = classes.filter(c => c.toLowerCase() !== className.toLowerCase());
    setClasses(updated);
    saveClassesToFirestore(currentAdminId, updated).catch(console.error);
    showToast(`Kelas "${className}" berhasil dihapus`, 'info');
    return { success: true };
  };

  const renameClass = (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew) {
      return { success: false, error: 'Nama kelas baru tidak boleh kosong!' };
    }
    if (
      oldName.toLowerCase() !== trimmedNew.toLowerCase() &&
      classes.some(c => c.toLowerCase() === trimmedNew.toLowerCase())
    ) {
      return { success: false, error: `Kelas "${trimmedNew}" sudah ada!` };
    }

    const updatedClasses = classes.map(c =>
      c.toLowerCase() === oldName.toLowerCase() ? trimmedNew : c
    );
    setClasses(updatedClasses);
    saveClassesToFirestore(currentAdminId, updatedClasses).catch(console.error);

    // Update students in this class
    const updatedStudents = students.map(s => {
      if (s.classId.toLowerCase() === oldName.toLowerCase()) {
        const formatted =
          trimmedNew.startsWith('Kelas') ||
          trimmedNew.startsWith('Santri') ||
          trimmedNew.startsWith('Kelompok') ||
          trimmedNew.startsWith('Level')
            ? trimmedNew
            : `Kelas ${trimmedNew}`;
        return {
          ...s,
          classId: trimmedNew,
          className: formatted,
        };
      }
      return s;
    });
    setStudents(updatedStudents);

    // Update transactions className
    setTransactions(prev =>
      prev.map(t => {
        if (t.className.toLowerCase().includes(oldName.toLowerCase())) {
          return {
            ...t,
            className: `Kelas ${trimmedNew}`,
          };
        }
        return t;
      })
    );

    showToast(`Kelas "${oldName}" berhasil diubah menjadi "${trimmedNew}"`, 'success');
    return { success: true };
  };

  const addStudent = (data: {
    name: string;
    nis: string;
    classId: string;
    guardianName: string;
    guardianPhone: string;
    initialDeposit: number;
    photoUrl?: string;
  }) => {
    const formattedClass =
      data.classId.startsWith('Kelas') ||
      data.classId.startsWith('Santri') ||
      data.classId.startsWith('Kelompok') ||
      data.classId.startsWith('Level')
        ? data.classId
        : `Kelas ${data.classId}`;
    const accountNo = `TB-${schoolInfo.schoolName.slice(0, 2).toUpperCase()}-${data.nis.slice(-4) || Math.floor(1000 + Math.random() * 9000)}`;
    const bookNo = `B-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nis: data.nis,
      name: data.name,
      classId: data.classId,
      className: formattedClass,
      accountNo,
      bookNo,
      balance: data.initialDeposit || 0,
      photoUrl: data.photoUrl,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      pin: '010115',
      isRegularSaver: true,
      status: 'active',
      savingTarget: {
        id: `target-${Date.now()}`,
        title: 'Tabungan Masa Depan Pelajar',
        targetAmount: 500000,
        currentAmount: data.initialDeposit || 0,
        category: 'Pendidikan',
        icon: 'savings',
      },
    };

    setStudents(prev => [newStudent, ...prev]);

    // Ensure class is in classes list
    if (data.classId && !classes.some(c => c.toLowerCase() === data.classId.toLowerCase())) {
      setClasses(prev => {
        const next = [...prev, data.classId];
        saveClassesToFirestore(currentAdminId, next).catch(console.error);
        return next;
      });
    }

    // Save student to Cloud Firestore
    saveStudentToFirestore(currentAdminId, newStudent).catch(err => {
      console.warn('Firestore student add notice:', err);
    });

    // If initial deposit > 0, create an opening transaction
    if (data.initialDeposit > 0) {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const openingTx: Transaction = {
        id: `tx-init-${Date.now()}`,
        transactionCode: `TRX-INIT-${data.nis}`,
        date: formattedDate,
        time: formattedTime,
        studentId: newStudent.id,
        studentName: newStudent.name,
        studentNis: newStudent.nis,
        className: newStudent.className,
        type: 'deposit',
        amount: data.initialDeposit,
        category: 'Tabungan Reguler',
        note: `Setoran Awal Pembukaan Rekening ${formattedClass}`,
        officerName: schoolInfo.treasurerName,
        previousBalance: 0,
        finalBalance: data.initialDeposit,
        verifiedBy: schoolInfo.treasurerName,
        createdAt: now.getTime(),
      };
      setTransactions(prev => [openingTx, ...prev]);
      saveTransactionToFirestore(currentAdminId, openingTx).catch(err => {
        console.warn('Firestore initial tx save notice:', err);
      });
    }

    return newStudent;
  };

  const updateSavingTarget = (studentId: string, newTarget: Partial<SavingTarget>) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            savingTarget: {
              ...s.savingTarget,
              ...newTarget,
            },
          };
        }
        return s;
      })
    );
  };

  const openReceiptModal = (tx: Transaction) => {
    setSelectedTransactionForReceipt(tx);
  };

  const closeReceiptModal = () => {
    setSelectedTransactionForReceipt(null);
  };

  const openQrModal = (student: Student) => {
    setSelectedStudentForQr(student);
  };

  const closeQrModal = () => {
    setSelectedStudentForQr(null);
  };

  const openAuthModal = (initialTab: AuthModalTab = 'student') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  // Financial aggregates - accurately reflecting this school's students & transactions
  const totalSchoolSavings = students.reduce((acc, s) => acc + s.balance, 0);
  const totalMonthlyDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalMonthlyWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <SavingsContext.Provider
      value={{
        schoolInfo,
        students,
        transactions,
        activeStudent,
        activeTab,
        userRole,
        isBalanceHidden,
        selectedClassFilter,
        searchTerm,
        toastMessage,
        selectedTransactionForReceipt,
        selectedStudentForQr,
        isAuthModalOpen,
        authModalTab,
        isSettingsModalOpen,
        cloudSyncStatus,
        lastSyncedAt,
        syncWithCloud,
        adminAccounts,
        currentAdmin,
        registerAdminAccount,
        loginAdminAccount,
        switchAdminAccount,
        updateSchoolInfo,
        setActiveTab,
        setUserRole,
        toggleBalanceHidden,
        setSelectedClassFilter,
        setSearchTerm,
        setActiveStudent,
        setActiveStudentById,
        addTransaction,
        addStudent,
        updateSavingTarget,
        showToast,
        openReceiptModal,
        closeReceiptModal,
        openQrModal,
        closeQrModal,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        openSettingsModal,
        closeSettingsModal,
        classes,
        addClass,
        deleteClass,
        renameClass,
        totalSchoolSavings,
        totalMonthlyDeposits,
        totalMonthlyWithdrawals,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
};
