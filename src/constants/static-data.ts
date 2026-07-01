import { Paise } from "@/utils/format";

export const USER_DATA = {
  name: "Anees!",
  avatarUrl: require("../../assets/images/avatar.png"),
};

export const GST_LIABILITY = {
  total: 0 as Paise, // ₹0.00
  payable: 21470000000 as Paise, // ₹21.47 Cr
  refund: 7670000000 as Paise, // ₹7.67 Cr
};

export const SUMMARY_CARDS = {
  sales: {
    total: 2160000000 as Paise, // ₹2.16 Cr
    gst: 140100000 as Paise, // ₹14.01 L
  },
  purchase: {
    total: 11810000000 as Paise, // ₹11.81 Cr
    gst: 3510000000 as Paise, // ₹3.51 Cr
  },
};

export const LOW_STOCK_ALERTS = [
  { id: "1", name: " Cement Bag 50kg", leftCount: 4 },
  { id: "2", name: "Screws 1.5 inch (1 Box)", leftCount: 18 },
  { id: "3", name: "Teak Wood Board", leftCount: 25 },
];

export const LOW_STOCK_HIDDEN_COUNT = 2;

export const OVERDUE_PAYMENTS = [
  { id: "1", name: "M/s Sharma Builders", amount: 25000000 as Paise }, // ₹2.5 L
  { id: "2", name: "Ramesh Traders", amount: 4500000 as Paise }, // ₹45 K
];
