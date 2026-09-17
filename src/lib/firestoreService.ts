import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Student, Transaction, SchoolInfo, AdminAccount } from '../types';

/**
 * Save or update Admin Account in Firestore.
 */
export async function saveAdminAccountToFirestore(account: AdminAccount): Promise<void> {
  const path = `adminAccounts/${account.id}`;
  try {
    const docRef = doc(db, 'adminAccounts', account.id);
    await setDoc(
      docRef,
      {
        ...account,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all registered Admin Accounts from Firestore.
 */
export async function fetchAdminAccountsFromFirestore(): Promise<AdminAccount[]> {
  const path = 'adminAccounts';
  try {
    const snapshot = await getDocs(collection(db, path));
    const accounts: AdminAccount[] = [];
    snapshot.forEach(docSnap => {
      accounts.push(docSnap.data() as AdminAccount);
    });
    return accounts;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save School Profile to Firestore.
 */
export async function saveSchoolInfoToFirestore(adminId: string, school: SchoolInfo): Promise<void> {
  const path = `schools/${adminId}`;
  try {
    const docRef = doc(db, 'schools', adminId);
    await setDoc(
      docRef,
      {
        adminId,
        ...school,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch School Profile from Firestore for a specific admin.
 */
export async function fetchSchoolInfoFromFirestore(adminId: string): Promise<SchoolInfo | null> {
  const path = `schools/${adminId}`;
  try {
    const docRef = doc(db, 'schools', adminId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SchoolInfo;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save or update a student record in Firestore.
 */
export async function saveStudentToFirestore(adminId: string, student: Student): Promise<void> {
  const path = `students/${student.id}`;
  try {
    const docRef = doc(db, 'students', student.id);
    await setDoc(
      docRef,
      {
        adminId,
        ...student,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a student record from Firestore.
 */
export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  const path = `students/${studentId}`;
  try {
    await deleteDoc(doc(db, 'students', studentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetch all students belonging to an admin from Firestore.
 */
export async function fetchStudentsFromFirestore(adminId: string): Promise<Student[]> {
  const path = 'students';
  try {
    const q = query(collection(db, path), where('adminId', '==', adminId));
    const snapshot = await getDocs(q);
    const students: Student[] = [];
    snapshot.forEach(docSnap => {
      students.push(docSnap.data() as Student);
    });
    return students;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save a new transaction to Firestore.
 */
export async function saveTransactionToFirestore(adminId: string, tx: Transaction): Promise<void> {
  const path = `transactions/${tx.id}`;
  try {
    const docRef = doc(db, 'transactions', tx.id);
    await setDoc(docRef, {
      adminId,
      ...tx,
      createdAtIso: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch transactions belonging to an admin from Firestore.
 */
export async function fetchTransactionsFromFirestore(adminId: string): Promise<Transaction[]> {
  const path = 'transactions';
  try {
    const q = query(collection(db, path), where('adminId', '==', adminId));
    const snapshot = await getDocs(q);
    const txs: Transaction[] = [];
    snapshot.forEach(docSnap => {
      txs.push(docSnap.data() as Transaction);
    });
    // Sort descending by createdAt
    return txs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save classes list to Firestore.
 */
export async function saveClassesToFirestore(adminId: string, classes: string[]): Promise<void> {
  const path = `classes/${adminId}`;
  try {
    const docRef = doc(db, 'classes', adminId);
    await setDoc(
      docRef,
      {
        adminId,
        classes,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch classes list from Firestore.
 */
export async function fetchClassesFromFirestore(adminId: string): Promise<string[] | null> {
  const path = `classes/${adminId}`;
  try {
    const docRef = doc(db, 'classes', adminId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.classes)) return data.classes;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
