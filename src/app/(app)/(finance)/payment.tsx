import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { SearchAndFilter } from "@/components/shared/SearchAndFilter";
import { ListCard } from "@/components/shared/ListCard";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Text } from "react-native";
import { formatINR } from "@/utils/format";
import { HandCoins, Calendar, IndianRupee } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { PaymentQuickViewModal } from "@/components/shared/PaymentQuickViewModal";
import { ListCardSkeleton } from "@/components/shared/Skeleton";

export default function PaymentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: payments = [], isLoading: isLoadingPayments, isError: isErrorPayments } = useQuery({ queryKey: ["payments"], queryFn: mockApi.getPayments });
  const { data: parties = [], isLoading: isLoadingParties, isError: isErrorParties } = useQuery({ queryKey: ["parties"], queryFn: mockApi.getParties });



  if (isErrorPayments || isErrorParties) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load payments data.</Text>
      </SafeAreaView>
    );
  }

  const isLoading = isLoadingPayments || isLoadingParties;

  const filteredPayments = isLoading ? [] : payments.filter(p => 
    activeTab === "All" ? true : p.paymentType.toLowerCase() === activeTab.toLowerCase()
  );

  const handlePaymentPress = (payment: any, party: any) => {
    setSelectedPayment(payment);
    setSelectedParty(party);
    setIsModalVisible(true);
  };

  const handleViewDetails = () => {
    setIsModalVisible(false);
    if (selectedPayment) {
      router.push(`/payment/${selectedPayment.id}` as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="Payments" subtitle="Track your cash flow" />
      
      <FlashList
        data={isLoading ? [1, 2, 3, 4, 5, 6] as any : filteredPayments}
        ListHeaderComponent={
          <View>
            <FilterTabs 
              tabs={["All", "Cash", "UPI", "Cheque"]} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            <SearchAndFilter 
              placeholder="Search by receipt or party..." 
              filters={[{ label: "Date Range", icon: Calendar }, { label: "Payment Mode" }]} 
            />
          </View>
        }
        renderItem={({ item, index }) => {
          if (isLoading) return <ListCardSkeleton />;
          const payment = item as any;
          const party = parties.find(p => p.id === payment.partyId);
          return (
            <ListCard
              onPress={() => handlePaymentPress(payment, party)}
              icon={<HandCoins size={20} />}
              title={party?.companyName || "Unknown Party"}
              subtitle={`Receipt No: ${payment.receiptNo} • Inv: ${payment.invoiceId}`}
              statusText={payment.paymentType}
              statusVariant={
                ["UPI", "NEFT", "RTGS"].includes(payment.paymentType) ? "ACTIVE" :
                payment.paymentType === "CHEQUE" ? "PENDING" :
                payment.paymentType === "CREDIT" ? "UNPAID" : "PAID"
              }
              rows={[
                { label: "Payment Date", value: payment.paymentDate, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Amount", value: formatINR(payment.amountPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />

      <PaymentQuickViewModal
        payment={selectedPayment}
        party={selectedParty}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onViewDetails={handleViewDetails}
      />
    </SafeAreaView>
  );
}
