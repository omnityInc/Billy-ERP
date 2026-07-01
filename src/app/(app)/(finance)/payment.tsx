import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { SearchAndFilter } from "@/components/shared/SearchAndFilter";
import { ListCard } from "@/components/shared/ListCard";
import { useMockStore } from "@/store/mockStore";
import { formatINR } from "@/utils/format";
import { HandCoins, Calendar, IndianRupee } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function PaymentScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const payments = useMockStore((state) => state.payments);
  const parties = useMockStore((state) => state.parties);

  const filteredPayments = payments.filter(p => 
    activeTab === "All" ? true : p.paymentType.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF2FF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="Payments" subtitle="Track your cash flow" />
      
      <FlashList
        data={filteredPayments}
        // @ts-ignore
        estimatedItemSize={180}
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
        renderItem={({ item }) => {
          const party = parties.find(p => p.id === item.partyId);
          return (
            <ListCard
              icon={<HandCoins size={20} />}
              title={party?.companyName || "Unknown Party"}
              subtitle={`Receipt No: ${item.receiptNo} • Inv: ${item.invoiceId}`}
              statusText={item.paymentType}
              statusVariant={
                ["UPI", "NEFT", "RTGS"].includes(item.paymentType) ? "ACTIVE" :
                item.paymentType === "CHEQUE" ? "PENDING" :
                item.paymentType === "CREDIT" ? "UNPAID" : "PAID"
              }
              rows={[
                { label: "Payment Date", value: item.paymentDate, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Amount", value: formatINR(item.amountPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
