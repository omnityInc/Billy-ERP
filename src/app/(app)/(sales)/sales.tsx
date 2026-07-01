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
import { ReceiptText, Calendar, IndianRupee } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function SalesScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const salesInvoices = useMockStore((state) => state.salesInvoices);
  const parties = useMockStore((state) => state.parties);

  const filteredInvoices = salesInvoices.filter(i => 
    activeTab === "All" ? true : i.status === activeTab.toUpperCase()
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF2FF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="Sales Documents" subtitle="Manage your outgoing documents" />
      
      <FlashList
        data={filteredInvoices}
        // @ts-ignore
        estimatedItemSize={180}
        ListHeaderComponent={
          <View>
            <FilterTabs 
              tabs={["All", "Paid", "Partial", "Unpaid"]} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            <SearchAndFilter 
              placeholder="Search for sales documents..." 
              filters={[{ label: "Sort By" }, { label: "Due Date", icon: Calendar }]} 
            />
          </View>
        }
        renderItem={({ item }) => {
          const party = parties.find(p => p.id === item.partyId);
          return (
            <ListCard
              icon={<ReceiptText size={20} />}
              title={party?.companyName || "Unknown Party"}
              subtitle={`${item.invoiceNo} • ${item.id}`}
              statusText={item.status}
              statusVariant={item.status}
              rows={[
                { label: "Issued Date", value: item.date, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Due Date", value: item.dueDate, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Invoice Amount", value: formatINR(item.grandTotalPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
