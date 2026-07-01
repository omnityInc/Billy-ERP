import { create } from 'zustand';
import { parties, products, salesInvoices, purchaseInvoices, payments, lorryReceipts } from '../data/mock';
import type { Party, Product, Invoice, Payment, LorryReceipt } from '../data/mock';

interface MockState {
  parties: Party[];
  products: Product[];
  salesInvoices: Invoice[];
  purchaseInvoices: Invoice[];
  payments: Payment[];
  lorryReceipts: LorryReceipt[];
}

export const useMockStore = create<MockState>(() => ({
  parties,
  products,
  salesInvoices,
  purchaseInvoices,
  payments,
  lorryReceipts,
}));
