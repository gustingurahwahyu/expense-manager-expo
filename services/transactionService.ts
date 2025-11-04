import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Transaction {
  id?: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  notes: string;
  date: Date;
  payment?: string;
  createdAt: Date;
}

const TRANSACTIONS_COLLECTION = "transactions";

// Tambah transaksi baru
export async function addTransaction(
  transaction: Omit<Transaction, "id" | "createdAt">
) {
  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      createdAt: Timestamp.now(),
      date: Timestamp.fromDate(transaction.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}

// Ambil semua transaksi user
export async function getUserTransactions(userId: string) {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        category: data.category,
        notes: data.notes,
        date: data.date.toDate(),
        payment: data.payment,
        createdAt: data.createdAt.toDate(),
      });
    });

    return transactions;
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
}

// Update transaksi
export async function updateTransaction(
  transactionId: string,
  updates: Partial<Transaction>
) {
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    await updateDoc(transactionRef, {
      ...updates,
      date: updates.date ? Timestamp.fromDate(updates.date) : undefined,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

// Hapus transaksi
export async function deleteTransaction(transactionId: string) {
  try {
    await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId));
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

// Hitung total income
export async function getTotalIncome(userId: string) {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", userId),
      where("type", "==", "income")
    );

    const querySnapshot = await getDocs(q);
    let total = 0;

    querySnapshot.forEach((doc) => {
      total += doc.data().amount;
    });

    return total;
  } catch (error) {
    console.error("Error calculating income:", error);
    throw error;
  }
}

// Hitung total expense
export async function getTotalExpense(userId: string) {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", userId),
      where("type", "==", "expense")
    );

    const querySnapshot = await getDocs(q);
    let total = 0;

    querySnapshot.forEach((doc) => {
      total += doc.data().amount;
    });

    return total;
  } catch (error) {
    console.error("Error calculating expense:", error);
    throw error;
  }
}
