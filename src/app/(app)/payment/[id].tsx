import { formatINR } from "@/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Trash2, Printer, HandCoins, Calendar, CreditCard, Building2, CheckCircle2, FileText, ChevronRight } from "lucide-react-native";
import { Platform, Pressable, ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Skeleton } from "@/components/shared/Skeleton";

export default function PaymentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const queryClient = useQueryClient();
  const { data: payments = [], isLoading: isLoadingPayments, isError: isErrorPayments } = useQuery({ queryKey: ["payments"], queryFn: mockApi.getPayments });
  const { data: parties = [], isLoading: isLoadingParties, isError: isErrorParties } = useQuery({ queryKey: ["parties"], queryFn: mockApi.getParties });

  const deleteMutation = useMutation({
    mutationFn: () => mockApi.deletePayment(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      router.back();
    }
  });

  const deletePayment = (id: string) => deleteMutation.mutate();

  const payment = payments.find((p) => p.id === id);
  const party = payment ? parties.find(p => p.id === payment.partyId) : null;

  if (isLoadingPayments || isLoadingParties) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={() => router.back()} className="mr-3 p-2 bg-natural-50 rounded-full">
              <ArrowLeft size={20} color="#0F172A" />
            </Pressable>
            <View className="flex-1 pr-4">
              <Text className="text-h3 text-black">Payment Receipt</Text>
              <Skeleton height={14} width={80} className="mt-1" />
            </View>
          </View>
          <View className="flex-row items-center gap-x-2">
            <View className="p-2 bg-natural-100 rounded-full w-9 h-9" />
          </View>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="rounded-2xl p-6 mb-4 bg-white border border-natural-200 shadow-sm items-center">
            <View className="w-16 h-16 rounded-full bg-natural-100 items-center justify-center mb-3" />
            <Text className="text-body-strong text-natural-500 uppercase tracking-wider mb-1">
              Payment Successful
            </Text>
            <Skeleton height={36} width={120} />
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Transaction Details</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Receipt Number</Text>
                <Skeleton height={20} width={100} />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-caption text-natural-500 mb-1">Payment Date</Text>
                <Skeleton height={20} width={90} />
              </View>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Payment Mode</Text>
                <Skeleton height={20} width={80} />
              </View>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Associated With</Text>
            </View>
            <Skeleton height={60} width="100%" borderRadius={12} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isErrorPayments || isErrorParties) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load payment details.</Text>
      </SafeAreaView>
    );
  }

  if (!payment) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View className="flex-row items-center p-4">
          <Pressable onPress={() => router.back()} className="mr-3 p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} color="#000" />
          </Pressable>
          <Text className="text-h2">Payment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to delete this payment receipt? The associated invoice balance will be updated.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deletePayment(payment.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleDownloadPDF = () => {
    // Placeholder for PDF generation
    Alert.alert("Coming Soon", "PDF generation will be integrated shortly.");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
        <View className="flex-row items-center flex-1">
          <Pressable 
            onPress={() => router.back()} 
            className="mr-3 p-2 bg-natural-50 rounded-full active:bg-natural-100 will-change-pressable"
          >
            <ArrowLeft size={20} color="#0F172A" />
          </Pressable>
          <View className="flex-1 pr-4">
            <Text className="text-h3 text-black" numberOfLines={1}>
              Payment Receipt
            </Text>
            <Text className="text-caption text-natural-500 mt-0.5">
              #{payment.receiptNo}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-x-2">
          <Pressable 
            onPress={handleDelete}
            className="p-2 bg-[#FEE2E2] rounded-full active:bg-[#FECACA] will-change-pressable"
          >
            <Trash2 size={18} color="#991B1B" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        {/* AMOUNT CARD */}
        <View className="rounded-2xl p-6 mb-4 bg-white border border-natural-200 shadow-sm items-center">
          <View className="w-16 h-16 rounded-full bg-[#DCFCE7] items-center justify-center mb-3">
            <CheckCircle2 size={32} color="#166534" />
          </View>
          <Text className="text-body-strong text-natural-500 uppercase tracking-wider mb-1">
            Payment Successful
          </Text>
          <Text className="text-h1 text-[#166534]">
            {formatINR(payment.amountPaise)}
          </Text>
        </View>

        {/* TRANSACTION DETAILS */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">Transaction Details</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Receipt Number</Text>
              <Text className="text-body-strong text-black">{payment.receiptNo}</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">Payment Date</Text>
              <View className="flex-row items-center gap-x-2">
                <Calendar size={14} color="#0F172A" />
                <Text className="text-body-strong text-black">{payment.paymentDate}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Payment Mode</Text>
              <View className="flex-row items-center gap-x-2">
                <CreditCard size={14} color="#0F172A" />
                <Text className="text-body-strong text-black">{payment.paymentType}</Text>
              </View>
            </View>
          </View>
          
          {payment.remarks ? (
            <View className="mt-4 pt-3 border-t border-natural-100">
              <Text className="text-caption text-natural-500 mb-1">Remarks</Text>
              <Text className="text-body text-black">{payment.remarks}</Text>
            </View>
          ) : null}
        </View>

        {/* PARTY & INVOICE DETAILS */}
        <View className="bg-white rounded-2xl p-5 mb-8 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">Associated With</Text>
          </View>

          <View className="mb-4">
            <Text className="text-caption text-natural-500 mb-1">Party</Text>
            <Text className="text-body text-black">{party?.companyName || "Unknown Party"}</Text>
          </View>

          <View>
            <Text className="text-caption text-natural-500 mb-2">Linked Invoice</Text>
            <Pressable 
              onPress={() => router.push(`/invoice/${payment.invoiceId}` as any)}
              className="flex-row items-center justify-between bg-natural-50 p-3 rounded-xl border border-natural-200 active:bg-natural-100 will-change-pressable"
            >
              <View className="flex-row items-center gap-x-3">
                <FileText size={18} color="#0F172A" />
                <Text className="text-black">{payment.invoiceId}</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 pt-4 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable 
          onPress={handleDownloadPDF}
          className="w-full flex-row items-center justify-center py-4 bg-black rounded-xl shadow-sm gap-x-3"
        >
          <Printer size={18} color="#FFFFFF" />
          <Text className="text-white text-body text-center" numberOfLines={1}>
            Download Receipt
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
