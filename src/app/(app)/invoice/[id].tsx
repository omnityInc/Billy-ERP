import { RecordPaymentModal } from "@/components/shared/RecordPaymentModal";
import { useMockStore } from "@/store/mockStore";
import { formatINR } from "@/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Download,
  Phone,
  Printer,
  Share2,
} from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 1. Fetch data from mock store
  const salesInvoices = useMockStore((state) => state.salesInvoices);
  const purchaseInvoices = useMockStore((state) => state.purchaseInvoices);
  const parties = useMockStore((state) => state.parties);
  const products = useMockStore((state) => state.products);
  const payments = useMockStore((state) => state.payments);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // Search across both sales and purchases to find the invoice
  const invoice =
    salesInvoices.find((i) => i.id === id) ||
    purchaseInvoices.find((i) => i.id === id);
  const party = invoice ? parties.find((p) => p.id === invoice.partyId) : null;

  if (!invoice || !party) {
    return (
      <SafeAreaView className="flex-1 bg-natural-50 justify-center items-center">
        <Text className="text-natural-500 font-medium">Invoice not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-black rounded-lg"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // 2. Compute status styling
  const getStatusStyle = () => {
    switch (invoice.status) {
      case "PAID":
        return { bg: "bg-[#DCFCE7]", text: "text-[#166534]" };
      case "UNPAID":
        return { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" };
      case "PARTIAL":
        return { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" };
      default:
        return { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" };
    }
  };
  const statusStyle = getStatusStyle();

  // 3. Line Items & Payments logic
  // Calculate Outstanding Balance
  const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id);
  const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amountPaise, 0);
  const outstandingAmountPaise = invoice.grandTotalPaise - totalPaid;

  // Check if any item has discount to conditionally show column
  const hasDiscount = invoice.items.some((item) => item.discountPercent > 0);

  // Combine items with product catalog info (e.g., hsnSac)
  const enrichedItems = invoice.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      hsnSac: product?.hsnSac || "-",
    };
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
        <View className="flex-row items-center flex-1">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeft size={24} color="#0F172A" />
          </Pressable>
          <View>
            <Text className="text-lg font-bold text-black">
              {invoice.invoiceNo}
            </Text>
            <Text className="text-xs text-natural-500 font-medium">
              Invoice Details
            </Text>
          </View>
        </View>
        <View className="flex-row gap-x-4">
          <Pressable>
            <Share2 size={20} color="#0F172A" />
          </Pressable>
          <Pressable>
            <Download size={20} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* CARD 1: SUMMARY */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-sm font-semibold text-natural-500 mb-1 tracking-wider uppercase">
                Invoice Amount
              </Text>
              <Text className="text-3xl font-bold text-black">
                {formatINR(invoice.grandTotalPaise)}
              </Text>
            </View>
            <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}
              >
                {invoice.status}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between pt-4 border-t border-natural-100">
            <View>
              <Text className="text-xs text-natural-500 mb-0.5 font-medium">
                DATE
              </Text>
              <Text className="text-sm font-bold text-black">
                {invoice.date}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-natural-500 mb-0.5 font-medium">
                DUE DATE
              </Text>
              <Text className="text-sm font-bold text-black">
                {invoice.dueDate}
              </Text>
            </View>
          </View>
        </View>

        {/* CARD 2: BILL TO */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-xs font-semibold text-natural-500 tracking-wider uppercase">
              Bill To
            </Text>
            <Pressable
              onPress={() =>
                party.phone && Linking.openURL(`tel:${party.phone}`)
              }
              className="p-2 bg-[#DBEAFE] border border-[#93C5FD] rounded-full -mt-2 -mr-2"
            >
              <Phone size={16} color="#1E40AF" />
            </Pressable>
          </View>
          <Text className="text-lg font-bold text-black mb-1">
            {party.companyName}
          </Text>
          <Text className="text-sm text-natural-600 mb-2 leading-5">
            {party.billingAddress}, {party.city}, {party.state} -{" "}
            {party.pincode}
          </Text>
          <View className="flex-row justify-between items-center bg-natural-50 p-3 rounded-lg border border-natural-100">
            <View>
              <Text className="text-xs text-natural-500 mb-0.5">GSTIN</Text>
              <Text className="text-sm font-bold text-black">
                {party.gstin}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-natural-500 mb-0.5">Phone</Text>
              <Text className="text-sm font-bold text-black">
                {party.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* CARD 3: LINE ITEMS (Horizontal Scrollable Table) */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <Text className="text-xs font-semibold text-natural-500 mb-3 tracking-wider uppercase">
            Line Items
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View>
              {/* Table Header */}
              <View className="flex-row border-b border-natural-200 pb-2 mb-2">
                <Text className="text-xs font-bold text-natural-500 w-8">
                  #
                </Text>
                <Text className="text-xs font-bold text-natural-500 w-32">
                  Description
                </Text>
                <Text className="text-xs font-bold text-natural-500 w-24">
                  HSN/SAC
                </Text>
                <Text className="text-xs font-bold text-natural-500 w-16 text-right">
                  Qty
                </Text>
                <Text className="text-xs font-bold text-natural-500 w-24 text-right">
                  Rate
                </Text>
                {hasDiscount && (
                  <Text className="text-xs font-bold text-natural-500 w-16 text-right">
                    Disc %
                  </Text>
                )}
                <Text className="text-xs font-bold text-natural-500 w-24 text-right">
                  Amount
                </Text>
              </View>

              {/* Table Rows */}
              {enrichedItems.map((item, index) => (
                <View
                  key={item.id}
                  className="flex-row py-2 border-b border-natural-100"
                >
                  <Text className="text-xs font-medium text-black w-8">
                    {index + 1}
                  </Text>
                  <Text
                    className="text-xs font-medium text-black w-32"
                    numberOfLines={2}
                  >
                    {item.productName}
                  </Text>
                  <Text className="text-xs text-natural-600 w-24">
                    {item.hsnSac}
                  </Text>
                  <Text className="text-xs font-medium text-black w-16 text-right">
                    {item.qty} {item.uom}
                  </Text>
                  <Text className="text-xs font-medium text-black w-24 text-right">
                    {formatINR(item.ratePaise)}
                  </Text>
                  {hasDiscount && (
                    <Text className="text-xs text-natural-600 w-16 text-right">
                      {item.discountPercent}%
                    </Text>
                  )}
                  <Text className="text-xs font-bold text-black w-24 text-right">
                    {formatINR(item.totalPaise)}
                  </Text>
                </View>
              ))}

              {/* Table Totals */}
              <View className="flex-row py-3 mt-1">
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-bold text-natural-500 text-right">
                    Subtotal:
                  </Text>
                  <Text className="text-xs font-bold text-natural-500 text-right mt-1">
                    Tax Amount:
                  </Text>
                  <Text className="text-sm font-bold text-black text-right mt-2">
                    Grand Total:
                  </Text>
                </View>
                <View className="w-24">
                  <Text className="text-xs font-bold text-black text-right">
                    {formatINR(invoice.taxableAmountPaise)}
                  </Text>
                  <Text className="text-xs font-bold text-black text-right mt-1">
                    {formatINR(invoice.taxAmountPaise)}
                  </Text>
                  <Text className="text-sm font-bold text-black text-right mt-2">
                    {formatINR(invoice.grandTotalPaise)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* CARD 4: SCAN & PAY (UPI QR) */}
        <View className="bg-white rounded-2xl p-6 mb-8 border border-natural-200 shadow-sm items-center">
          {outstandingAmountPaise > 0 ? (
            <>
              <Text className="text-lg font-bold text-black mb-1">
                Scan & Pay via UPI
              </Text>
              <Text className="text-sm text-natural-500 mb-6 text-center">
                Use any UPI app like GPay, PhonePe, or Paytm to pay this invoice
                instantly.
              </Text>
              <View className="p-4 bg-white border border-natural-200 rounded-xl shadow-sm mb-4">
                <QRCode
                  value={`upi://pay?pa=merchant@upi&pn=${encodeURIComponent(party.companyName)}&am=${outstandingAmountPaise / 100}&cu=INR`}
                  size={180}
                  color="#0F172A"
                  backgroundColor="#FFFFFF"
                />
              </View>
              <Text className="text-xs font-bold text-natural-500 tracking-wider">
                UPI ID: merchant@upi
              </Text>
            </>
          ) : (
            <View className="p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl w-full items-center">
              <Text className="text-[#166534] font-bold text-lg mb-1">
                Fully Paid!
              </Text>
              <Text className="text-[#15803D] text-sm text-center">
                There is no outstanding balance for this invoice.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 py-4 flex-row gap-x-3 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable
          onPress={() => setIsPaymentModalVisible(true)}
          className="flex-1 flex-row items-center justify-center py-4 bg-[#DCFCE7] border border-[#86EFAC] rounded-xl shadow-sm"
        >
          <Text className="font-bold text-[#166534]">Record Payment</Text>
        </Pressable>
        <Pressable className="flex-1 flex-row items-center justify-center py-4 bg-black border border-natural-300 rounded-xl">
          <Printer size={18} color="#ffffff" />
          <Text className="ml-2 font-bold text-white">Download PDF</Text>
        </Pressable>
      </View>

      <RecordPaymentModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        invoiceId={invoice.id}
        partyId={party.id}
        partyName={party.companyName}
        outstandingAmountPaise={outstandingAmountPaise}
      />
    </SafeAreaView>
  );
}
