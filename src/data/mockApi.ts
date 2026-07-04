import {
  lorryReceipts,
  parties,
  payments,
  products,
  purchaseInvoices,
  salesInvoices,
} from "./mock";

// TODO: Remove this artificial delay in the future. It is currently set to 2.5s so we can visually test the skeleton loaders.
const delay = (ms = 1100) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Queries
  getParties: async () => {
    await delay();
    return parties;
  },
  getPartyById: async (id: string) => {
    await delay();
    return parties.find((p) => p.id === id);
  },
  getProducts: async () => {
    await delay();
    return products;
  },
  getProductById: async (id: string) => {
    await delay();
    return products.find((p) => p.id === id);
  },
  getSales: async () => {
    await delay();
    return salesInvoices;
  },
  getSalesInvoices: async () => {
    await delay();
    return salesInvoices;
  },
  getPurchaseInvoices: async () => {
    await delay();
    return purchaseInvoices;
  },
  getInvoiceById: async (id: string) => {
    await delay();
    return (
      salesInvoices.find((i) => i.id === id) ||
      purchaseInvoices.find((i) => i.id === id)
    );
  },
  getPayments: async () => {
    await delay();
    return payments;
  },
  getLorryReceipts: async () => {
    await delay();
    return lorryReceipts;
  },
  getEwayBills: async () => {
    await delay();
    // Using lorryReceipts as mock data for eway bills for now
    return lorryReceipts;
  },
  getDashboardStats: async () => {
    await delay();
    return {
      totalSales: salesInvoices.length,
      totalPurchases: purchaseInvoices.length,
      totalParties: parties.length,
      totalProducts: products.length,
    };
  },

  // Mutations
  addPayment: async (payment: any) => {
    await delay();
    return { success: true, data: payment };
  },
  updateProduct: async (id: string, data: any) => {
    await delay();
    return { success: true, id, data };
  },
  adjustStock: async (productId: string, qty: number) => {
    await delay();
    return { success: true, productId, adjustedQty: qty };
  },
  addParty: async (party: any) => {
    await delay();
    return { success: true, data: party };
  },
  updateParty: async (id: string, data: any) => {
    await delay();
    return { success: true, id, data };
  },
  addInvoice: async (invoice: any) => {
    await delay();
    return { success: true, data: invoice };
  },
  updateInvoice: async (id: string, data: any) => {
    await delay();
    return { success: true, id, data };
  },
  deleteInvoice: async (id: string) => {
    await delay();
    return { success: true, id };
  },
};
