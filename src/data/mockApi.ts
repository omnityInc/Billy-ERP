import {
  parties,
  products,
  salesInvoices,
  purchaseInvoices,
  payments,
  lorryReceipts,
} from "./mock";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getParties: async () => {
    await delay();
    return parties;
  },
  getProducts: async () => {
    await delay();
    return products;
  },
  getSalesInvoices: async () => {
    await delay();
    return salesInvoices;
  },
  getPurchaseInvoices: async () => {
    await delay();
    return purchaseInvoices;
  },
  getPayments: async () => {
    await delay();
    return payments;
  },
  getLorryReceipts: async () => {
    await delay();
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
};
