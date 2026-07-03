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
}));
