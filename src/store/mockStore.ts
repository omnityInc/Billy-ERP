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
  addPayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteLorryReceipt: (id: string) => void;
  updateLorryReceipt: (id: string, updates: Partial<LorryReceipt>) => void;
}

export const useMockStore = create<MockState>((set) => ({
  parties,
  products,
  salesInvoices,
  purchaseInvoices,
  payments,
  lorryReceipts,
  addPayment: (payment) =>
    set((state) => {
      const newPayments = [...state.payments, payment];

      // Update the associated invoice's status
      const updateInvoice = (invoice: Invoice) => {
        if (invoice.id !== payment.invoiceId) return invoice;

        const totalPaid = newPayments
          .filter((p) => p.invoiceId === invoice.id)
          .reduce((sum, p) => sum + p.amountPaise, 0);

        let newStatus: Invoice["status"] = "UNPAID";
        if (totalPaid >= invoice.grandTotalPaise) newStatus = "PAID";
        else if (totalPaid > 0) newStatus = "PARTIAL";

        return { ...invoice, status: newStatus };
      };

      return {
        payments: newPayments,
        salesInvoices: state.salesInvoices.map(updateInvoice),
        purchaseInvoices: state.purchaseInvoices.map(updateInvoice),
      };
    }),
  deletePayment: (id) =>
    set((state) => {
      const paymentToDelete = state.payments.find((p) => p.id === id);
      if (!paymentToDelete) return state;

      const newPayments = state.payments.filter((p) => p.id !== id);

      // Update the associated invoice's status
      const updateInvoice = (invoice: Invoice) => {
        if (invoice.id !== paymentToDelete.invoiceId) return invoice;

        const totalPaid = newPayments
          .filter((p) => p.invoiceId === invoice.id)
          .reduce((sum, p) => sum + p.amountPaise, 0);

        let newStatus: Invoice["status"] = "UNPAID";
        if (totalPaid >= invoice.grandTotalPaise) newStatus = "PAID";
        else if (totalPaid > 0) newStatus = "PARTIAL";

        return { ...invoice, status: newStatus };
      };

      return {
        payments: newPayments,
        salesInvoices: state.salesInvoices.map(updateInvoice),
        purchaseInvoices: state.purchaseInvoices.map(updateInvoice),
      };
    }),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteLorryReceipt: (id) =>
    set((state) => ({
      lorryReceipts: state.lorryReceipts.filter((lr) => lr.id !== id),
    })),
  updateLorryReceipt: (id, updates) =>
    set((state) => ({
      lorryReceipts: state.lorryReceipts.map((lr) => (lr.id === id ? { ...lr, ...updates } : lr)),
    })),
}));
