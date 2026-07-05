import { RecordPaymentModal } from "@/components/shared/RecordPaymentModal";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Skeleton } from "@/components/shared/Skeleton";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Paise } from "@/data/mock";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import { InvoiceHeaderCard } from "@/components/invoice/InvoiceHeaderCard";
import { InvoicePartyCard } from "@/components/invoice/InvoicePartyCard";
import { InvoiceItemsList } from "@/components/invoice/InvoiceItemsList";

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const { data: invoice, isLoading: isLoadingInvoice, isError: isErrorInvoice } = useQuery({ 
    queryKey: ["invoice", id], 
    queryFn: () => mockApi.getInvoiceById(id as string) 
  });

  const { data: party, isLoading: isLoadingParty, isError: isErrorParty } = useQuery({ 
    queryKey: ["party", invoice?.partyId], 
    queryFn: () => mockApi.getPartyById(invoice?.partyId as string),
    enabled: !!invoice?.partyId
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({ queryKey: ["products"], queryFn: mockApi.getProducts });
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({ queryKey: ["payments"], queryFn: mockApi.getPayments });

  if (isLoadingInvoice || isLoadingParty || isLoadingProducts || isLoadingPayments) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={() => router.back()} className="mr-3 p-1">
              <ArrowLeft size={24} color="#0F172A" />
            </Pressable>
            <View>
              <Skeleton height={28} width={100} className="mb-1" />
              <Text className="text-caption text-natural-500">Invoice Details</Text>
            </View>
          </View>
          <View className="flex-row gap-x-4">
            <Share2 size={20} color="#94A3B8" />
            <Download size={20} color="#94A3B8" />
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-4">
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-body-strong text-natural-500 mb-1 tracking-wider uppercase">Invoice Amount</Text>
                <Skeleton height={36} width={140} />
              </View>
              <Skeleton height={24} width={70} borderRadius={12} />
            </View>
            <View className="flex-row justify-between pt-4 border-t border-natural-100">
              <View>
                <Text className="text-caption text-natural-500 mb-0.5">DATE</Text>
                <Skeleton height={20} width={90} />
              </View>
              <View className="items-end">
                <Text className="text-caption text-natural-500 mb-0.5">DUE DATE</Text>
                <Skeleton height={20} width={90} />
              </View>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Bill To</Text>
              <Skeleton height={32} width={32} borderRadius={16} className="-mt-2 -mr-2" />
            </View>
            <Skeleton height={24} width={180} className="mb-2" />
            <Skeleton height={16} width={120} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isErrorInvoice || isErrorParty) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load invoice details.</Text>
      </SafeAreaView>
    );
  }

  if (!invoice || !party) {
    return (
      <SafeAreaView className="flex-1 bg-natural-50 justify-center items-center">
        <Text className="text-natural-500">Invoice not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-black rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id);
  const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amountPaise, 0);
  const outstandingAmountPaise = (invoice.grandTotalPaise - totalPaid) as Paise;

  const hasDiscount = invoice.items.some((item) => item.discountPercent > 0);

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
            <Text className="text-h3 text-black">
              {invoice.invoiceNo}
            </Text>
            <Text className="text-caption text-natural-500">
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
        <InvoiceHeaderCard invoice={invoice} />
        <InvoicePartyCard party={party} />
        <InvoiceItemsList invoice={invoice} enrichedItems={enrichedItems} hasDiscount={hasDiscount} />

        {/* CARD 4: SCAN & PAY (UPI QR) */}
        <View className="bg-white rounded-2xl p-6 mb-8 border border-natural-200 shadow-sm items-center">
          {outstandingAmountPaise > 0 ? (
            <>
              <Text className="text-h3 text-black mb-1">
                Scan & Pay via UPI
              </Text>
              <Text className="text-body text-natural-500 mb-6 text-center">
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
              <Text className="text-caption text-natural-500 tracking-wider">
                UPI ID: merchant@upi
              </Text>
            </>
          ) : (
            <View className="p-6 bg-success-50 border border-success-200 rounded-xl w-full items-center">
              <Text className="text-success-800 text-h3 mb-1">
                Fully Paid!
              </Text>
              <Text className="text-success-700 text-body text-center">
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
          className="flex-1 flex-row items-center justify-center py-4 bg-success-100 border border-success-300 rounded-xl shadow-sm"
        >
          <Text className="text-success-800 font-sans-semibold">Record Payment</Text>
        </Pressable>
        <Pressable className="flex-1 flex-row items-center justify-center py-4 bg-black border border-natural-300 rounded-xl">
          <Printer size={18} color="#ffffff" />
          <Text className="ml-2 text-white font-sans-semibold">Download PDF</Text>
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
