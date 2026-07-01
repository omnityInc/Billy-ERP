/* ============================================================
   Billy ERP Mock Data Generator
   Domain: Plastic & E-Waste Recycling
   ============================================================ */

export type Paise = number & { readonly __brand: "Paise" };

export const toPaise = (rupees: number): Paise => Math.round(rupees * 100) as Paise;

export type PartyType = "CUSTOMER" | "VENDOR";

export type InventoryType = "NORMAL" | "BATCH" | "SERIAL";

export type PaymentType =
  | "CASH"
  | "CREDIT"
  | "UPI"
  | "CHEQUE"
  | "RTGS"
  | "NEFT";

export interface Party {
  id: string;
  type: PartyType;
  companyName: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  group: string;
  creditDays: number;
  creditLimitPaise: Paise;
  isActive: boolean;
}

export interface Product {
  id: string;
  itemType: "PRODUCT" | "SERVICE";
  name: string;
  barcode: string;
  hsnSac: string;
  uom: string;
  tax: number;
  cessPercent: number;
  cessAmountPaise: Paise;
  sellPricePaise: Paise;
  saleDiscount: number;
  purchasePricePaise: Paise;
  purchaseDiscount: number;
  inventoryType: InventoryType;
  availableQty: number;
  lowStock: number;
  group: string;
  isActive: boolean;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  uom: string;
  ratePaise: Paise;
  discountPercent: number;
  taxablePaise: Paise;
  taxPercent: number;
  taxAmountPaise: Paise;
  totalPaise: Paise;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceType: "SALES" | "PURCHASE";
  partyId: string;
  date: string;
  paymentType: PaymentType;
  dueDate: string;
  items: InvoiceItem[];
  taxableAmountPaise: Paise;
  taxAmountPaise: Paise;
  roundOffPaise: Paise;
  grandTotalPaise: Paise;
  status: "PAID" | "PARTIAL" | "UNPAID";
}

export interface Payment {
  id: string;
  receiptNo: string;
  invoiceId: string;
  partyId: string;
  amountPaise: Paise;
  paymentType: PaymentType;
  paymentDate: string;
  remarks: string;
}

export interface LorryReceipt {
  id: string;
  lrNo: string;
  invoiceId: string;
  transporter: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  from: string;
  to: string;
  freightPaise: Paise;
  weight: number;
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(array: T[]): T => array[random(0, array.length - 1)];

const chance = (percent: number) => Math.random() * 100 <= percent;

const pad = (n: number, len = 4) => n.toString().padStart(len, "0");

const randomDate = () => {
  const start = new Date("2025-04-01");
  const end = new Date("2026-03-31");
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().substring(0, 10);
};

const addDays = (date: string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().substring(0, 10);
};

const amount = (min: number, max: number) => random(min, max);

const states = [
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Madhya Pradesh",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Punjab",
  "Haryana",
  "Telangana",
];

const cities = [
  "Surat", "Ahmedabad", "Rajkot", "Vadodara", "Vapi", "Ankleshwar",
  "Mumbai", "Pune", "Thane", "Nashik", "Indore", "Jaipur",
  "Delhi", "Bengaluru", "Chennai", "Ludhiana", "Panipat", "Hyderabad",
];

const prefixes = [
  "Shree", "Om", "Sai", "Balaji", "Green", "Eco", "Royal", "Metro",
  "National", "Modern", "Supreme", "Galaxy", "Reliable", "Prime",
  "Perfect", "Sunrise", "Future", "Apex", "Unity", "Shakti",
];

const suffixes = [
  "Plastics", "Polymers", "Recyclers", "Industries", "Trading",
  "Scrap", "Resources", "Enterprises", "Solutions", "Corporation",
  "Technologies", "Recovery", "Manufacturing", "Granules",
  "Packaging", "Waste Management", "E-Waste", "Metal Works",
];

const roads = [
  "GIDC", "MIDC", "Industrial Estate", "Ring Road", "Transport Nagar",
  "GIDC Phase 2", "Textile Market", "Ring Road Extension", "Industrial Area",
  "Warehouse Zone", "SEZ Road", "Plot Area", "Sector 21", "Sector 8", "Industrial Park",
];

const uoms = ["KG", "PCS", "TON", "JOB", "BAG", "NOS"];

export const parties: Party[] = [];
export const products: Product[] = [];
export const salesInvoices: Invoice[] = [];
export const purchaseInvoices: Invoice[] = [];
export const payments: Payment[] = [];
export const lorryReceipts: LorryReceipt[] = [];

const partyGroups = [
  "Plastic Scrap Supplier", "Plastic Recycler", "Plastic Manufacturer",
  "E-Waste Supplier", "E-Waste Recycler", "Industrial Customer",
  "Municipality", "Transport", "Trader",
];

const plasticNames = [
  "PET", "HDPE", "LDPE", "PP", "PVC", "ABS", "HIPS", "Poly",
  "Eco", "Green", "Recycle", "Circular", "Nova", "Prime",
  "Shakti", "Earth", "Urban", "Metro", "Modern", "National",
];

function randomPAN() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    letters[random(0, 25)] +
    letters[random(0, 25)] +
    letters[random(0, 25)] +
    letters[random(0, 25)] +
    letters[random(0, 25)] +
    pad(random(1000, 9999), 4) +
    letters[random(0, 25)]
  );
}

function randomGST(stateCode: number, pan: string) {
  return stateCode.toString().padStart(2, "0") + pan + "1Z" + random(1, 9);
}

const stateCodes: Record<string, number> = {
  Gujarat: 24, Maharashtra: 27, Rajasthan: 8, "Madhya Pradesh": 23,
  Delhi: 7, Karnataka: 29, "Tamil Nadu": 33, Punjab: 3,
  Haryana: 6, Telangana: 36,
};

for (let i = 1; i <= 150; i++) {
  const state = pick(states);
  const city = pick(cities);
  const pan = randomPAN();
  const company = `${pick(prefixes)} ${pick(plasticNames)} ${pick(suffixes)}`;

  parties.push({
    id: `PTY${pad(i, 4)}`,
    type: chance(55) ? "CUSTOMER" : "VENDOR",
    companyName: company,
    gstin: randomGST(stateCodes[state], pan),
    pan,
    phone: `9${random(100000000, 999999999)}`,
    email: company.toLowerCase().replace(/ /g, "") + "@gmail.com",
    billingAddress: `Plot ${random(1, 250)}, ${pick(roads)}`,
    shippingAddress: `Plot ${random(1, 250)}, ${pick(roads)}`,
    city,
    state,
    pincode: random(100000, 999999).toString(),
    group: pick(partyGroups),
    creditDays: pick([0, 7, 15, 30, 45, 60, 90]),
    creditLimitPaise: toPaise(amount(50000, 5000000)),
    isActive: chance(96),
  });
}

const plasticProducts = [
  "PET Bottle Scrap Clear", "PET Bottle Scrap Green", "PET Bottle Scrap Blue", "PET Bottle Scrap Mixed",
  "PET Flakes Clear", "PET Flakes Green", "PET Flakes Blue", "PET Hot Washed Flakes",
  "HDPE Drum Scrap", "HDPE Milk Bottle Scrap", "HDPE Natural Scrap", "HDPE Mixed Scrap",
  "LDPE Film Scrap", "LDPE Agriculture Film", "LDPE Stretch Film", "LLDPE Film Scrap",
  "PP Jumbo Bag Scrap", "PP Raffia Scrap", "PP Woven Bag Scrap", "PP Battery Case Scrap",
  "ABS Computer Scrap", "ABS TV Scrap", "HIPS Refrigerator Scrap", "PVC Pipe Scrap",
  "Polycarbonate Scrap", "Nylon Scrap", "PC Water Jar Scrap",
  "PET Granules", "HDPE Granules Natural", "HDPE Granules Black", "PP Granules Natural",
  "PP Granules Black", "ABS Granules", "PVC Granules", "LDPE Granules",
];

const ewasteProducts = [
  "Motherboard Scrap", "Laptop Motherboard", "Mobile PCB", "Router PCB",
  "RAM Scrap", "CPU Scrap", "SMPS Scrap", "Hard Disk Scrap", "SSD Scrap",
  "Laptop Scrap", "Desktop Scrap", "Printer Scrap", "Keyboard Scrap",
  "Mouse Scrap", "LED TV Scrap", "CRT Monitor Scrap", "Copper Cable",
  "Mixed Cable", "Aluminium Heat Sink", "Copper Motor", "Brass Connector",
  "Lithium Battery", "Lead Acid Battery", "Mobile Charger",
];

const serviceProducts = [
  "Grinding Charges", "Washing Charges", "Sorting Charges", "Shredding Charges",
  "Transportation Charges", "Labour Charges", "Baling Charges", "Loading Charges",
];

const hsnMap: Record<string, string> = {
  Plastic: "39159000", Granules: "39012000", Metal: "74040022",
  EWaste: "85499000", Service: "998873",
};

const inventoryTypes: InventoryType[] = ["NORMAL", "BATCH", "SERIAL"];

function productGroup(name: string) {
  if (name.includes("Granules")) return "Plastic Granules";
  if (name.includes("Flakes")) return "Plastic Flakes";
  if (name.includes("Copper") || name.includes("Brass") || name.includes("Aluminium")) return "Metal Scrap";
  if (name.includes("Charges")) return "Services";
  if (name.includes("PCB") || name.includes("Laptop") || name.includes("Battery") ||
      name.includes("CPU") || name.includes("RAM") || name.includes("Motherboard") ||
      name.includes("Monitor") || name.includes("Printer")) return "E-Waste";
  return "Plastic Scrap";
}

function hsnFor(name: string) {
  if (name.includes("Charges")) return hsnMap.Service;
  if (name.includes("Copper") || name.includes("Brass") || name.includes("Aluminium")) return hsnMap.Metal;
  if (name.includes("PCB") || name.includes("Laptop") || name.includes("Battery") ||
      name.includes("CPU") || name.includes("RAM") || name.includes("Motherboard")) return hsnMap.EWaste;
  if (name.includes("Granules")) return hsnMap.Granules;
  return hsnMap.Plastic;
}

const allProducts = [...plasticProducts, ...ewasteProducts, ...serviceProducts];

for (let i = 1; i <= 300; i++) {
  const base = pick(allProducts);
  const name = `${base} ${i > allProducts.length ? `Grade ${String.fromCharCode(65 + random(0, 4))}` : ""}`.trim();
  const isService = name.includes("Charges");
  const purchasePrice = isService ? 0 : amount(18, 900);
  const sellPrice = isService ? amount(500, 8000) : Number((purchasePrice * (1.08 + Math.random() * 0.35)).toFixed(2));

  products.push({
    id: `PRD${pad(i, 4)}`,
    itemType: isService ? "SERVICE" : "PRODUCT",
    name,
    barcode: `890${random(100000000, 999999999)}`,
    hsnSac: hsnFor(name),
    uom: isService ? "JOB" : pick(["KG", "TON", "PCS", "BAG"]),
    tax: pick([5, 12, 18]),
    cessPercent: 0,
    cessAmountPaise: toPaise(0),
    sellPricePaise: toPaise(sellPrice),
    saleDiscount: pick([0, 2, 5, 10]),
    purchasePricePaise: toPaise(purchasePrice),
    purchaseDiscount: pick([0, 2, 5]),
    inventoryType: isService ? "NORMAL" : pick(inventoryTypes),
    availableQty: isService ? 999999 : amount(0, 25000),
    lowStock: isService ? 0 : amount(100, 3000),
    group: productGroup(name),
    isActive: chance(98),
  });
}

const salesCustomers = parties.filter((p) => p.type === "CUSTOMER");
const paymentTypes: PaymentType[] = ["CASH", "CREDIT", "UPI", "CHEQUE", "RTGS", "NEFT"];

const invoiceStatus = (payment: PaymentType): "PAID" | "PARTIAL" | "UNPAID" => {
  if (payment !== "CREDIT") return "PAID";
  const r = random(1, 100);
  if (r <= 45) return "PAID";
  if (r <= 75) return "PARTIAL";
  return "UNPAID";
};

for (let i = 1; i <= 500; i++) {
  const party = pick(salesCustomers);
  const paymentType = pick(paymentTypes);
  const date = randomDate();
  const dueDate = paymentType === "CREDIT" ? addDays(date, party.creditDays || 30) : date;
  
  const items: InvoiceItem[] = [];
  let totalTaxablePaise = 0;
  let totalTaxPaise = 0;

  const numItems = random(1, 5);
  for (let j = 1; j <= numItems; j++) {
    const product = pick(products);
    const qty = random(1, 50);
    const ratePaise = product.sellPricePaise;
    const discountPercent = product.saleDiscount || 0;
    
    const basePaise = qty * ratePaise;
    const discountPaise = Math.round(basePaise * (discountPercent / 100));
    const taxablePaise = basePaise - discountPaise;
    
    const taxPercent = product.tax;
    const taxPaise = Math.round(taxablePaise * (taxPercent / 100));
    const totalPaise = taxablePaise + taxPaise;

    totalTaxablePaise += taxablePaise;
    totalTaxPaise += taxPaise;

    items.push({
      id: `INV-ITM-${i}-${j}`,
      productId: product.id,
      productName: product.name,
      qty,
      uom: product.uom,
      ratePaise: ratePaise,
      discountPercent,
      taxablePaise: taxablePaise as Paise,
      taxPercent,
      taxAmountPaise: taxPaise as Paise,
      totalPaise: totalPaise as Paise,
    });
  }

  const grandTotalRaw = totalTaxablePaise + totalTaxPaise;
  // Round to nearest Rupee (100 paise)
  const grandTotalRounded = Math.round(grandTotalRaw / 100) * 100;
  const roundOffPaise = grandTotalRounded - grandTotalRaw;

  salesInvoices.push({
    id: `SI${pad(i, 5)}`,
    invoiceNo: `SI-25-26-${pad(i, 5)}`,
    invoiceType: "SALES",
    partyId: party.id,
    date,
    paymentType,
    dueDate,
    items,
    taxableAmountPaise: totalTaxablePaise as Paise,
    taxAmountPaise: totalTaxPaise as Paise,
    roundOffPaise: roundOffPaise as Paise,
    grandTotalPaise: grandTotalRounded as Paise,
    status: invoiceStatus(paymentType),
  });
}

const vendorParties = parties.filter((p) => p.type === "VENDOR");

for (let i = 1; i <= 300; i++) {
  const party = pick(vendorParties);
  const paymentType = pick(paymentTypes);
  const date = randomDate();
  const dueDate = paymentType === "CREDIT" ? addDays(date, party.creditDays || 30) : date;
  
  const items: InvoiceItem[] = [];
  let totalTaxablePaise = 0;
  let totalTaxPaise = 0;

  const numItems = random(1, 5);
  for (let j = 1; j <= numItems; j++) {
    const product = pick(products);
    const qty = random(1, 50);
    const ratePaise = product.purchasePricePaise;
    const discountPercent = product.purchaseDiscount || 0;
    
    const basePaise = qty * ratePaise;
    const discountPaise = Math.round(basePaise * (discountPercent / 100));
    const taxablePaise = basePaise - discountPaise;
    
    const taxPercent = product.tax;
    const taxPaise = Math.round(taxablePaise * (taxPercent / 100));
    const totalPaise = taxablePaise + taxPaise;

    totalTaxablePaise += taxablePaise;
    totalTaxPaise += taxPaise;

    items.push({
      id: `PUR-ITM-${i}-${j}`,
      productId: product.id,
      productName: product.name,
      qty,
      uom: product.uom,
      ratePaise: ratePaise,
      discountPercent,
      taxablePaise: taxablePaise as Paise,
      taxPercent,
      taxAmountPaise: taxPaise as Paise,
      totalPaise: totalPaise as Paise,
    });
  }

  const grandTotalRaw = totalTaxablePaise + totalTaxPaise;
  const grandTotalRounded = Math.round(grandTotalRaw / 100) * 100;
  const roundOffPaise = grandTotalRounded - grandTotalRaw;

  purchaseInvoices.push({
    id: `PI${pad(i, 5)}`,
    invoiceNo: `PI-25-26-${pad(i, 5)}`,
    invoiceType: "PURCHASE",
    partyId: party.id,
    date,
    paymentType,
    dueDate,
    items,
    taxableAmountPaise: totalTaxablePaise as Paise,
    taxAmountPaise: totalTaxPaise as Paise,
    roundOffPaise: roundOffPaise as Paise,
    grandTotalPaise: grandTotalRounded as Paise,
    status: invoiceStatus(paymentType),
  });
}

const allInvoices = [...salesInvoices, ...purchaseInvoices];
for (let i = 1; i <= 600; i++) {
  const inv = pick(allInvoices);
  payments.push({
    id: `PAY${pad(i, 5)}`,
    receiptNo: `REC-${pad(i, 5)}`,
    invoiceId: inv.id,
    partyId: inv.partyId,
    amountPaise: inv.grandTotalPaise,
    paymentType: pick(paymentTypes),
    paymentDate: addDays(inv.date, random(1, 10)),
    remarks: "Payment received",
  });
}

const transporters = ["VRL Logistics", "Patel Roadways", "Shree Maruti", "Gati", "TCI Freight"];
for (let i = 1; i <= 200; i++) {
  const inv = pick(salesInvoices);
  lorryReceipts.push({
    id: `LR${pad(i, 5)}`,
    lrNo: `LR-${random(1000, 9999)}`,
    invoiceId: inv.id,
    transporter: pick(transporters),
    vehicleNo: `GJ05XX${random(1000, 9999)}`,
    driverName: "Driver Name",
    driverPhone: `98${random(10000000, 99999999)}`,
    from: "Surat",
    to: "Mumbai",
    freightPaise: toPaise(random(500, 5000)),
    weight: random(100, 5000),
  });
}
