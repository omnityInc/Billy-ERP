import { useState } from "react";
import { View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { SearchAndFilter } from "@/components/shared/SearchAndFilter";
import { ListCard } from "@/components/shared/ListCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Text } from "react-native";
import { formatINR } from "@/utils/format";
import { ReceiptText, Calendar, IndianRupee } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ListCardSkeleton } from "@/components/shared/Skeleton";

export default function SalesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  const { data: salesInvoices = [], isLoading: isLoadingSales, isError: isErrorSales } = useQuery({ queryKey: ["salesInvoices"], queryFn: mockApi.getSalesInvoices });
  const { data: parties = [], isLoading: isLoadingParties, isError: isErrorParties } = useQuery({ queryKey: ["parties"], queryFn: mockApi.getParties });



  if (isErrorSales || isErrorParties) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load sales data.</Text>
      </SafeAreaView>
    );
  }

  const isLoading = isLoadingSales || isLoadingParties;

  const filteredInvoices = isLoading ? [] : salesInvoices.filter(i => 
    activeTab === "All" ? true : i.status === activeTab.toUpperCase()
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="Sales Documents" subtitle="Manage your outgoing documents" />
      
      <FlashList
        data={isLoading ? [1, 2, 3, 4, 5, 6] as any : filteredInvoices}
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
        renderItem={({ item, index }) => {
          if (isLoading) return <ListCardSkeleton />;
          const invoice = item as any;
          const party = parties.find(p => p.id === invoice.partyId);
          return (
            <ListCard
              icon={<ReceiptText size={20} />}
              title={party?.companyName || "Unknown Party"}
              subtitle={`${invoice.invoiceNo} • ${invoice.id}`}
              statusText={invoice.status}
              statusVariant={invoice.status}
              rows={[
                { label: "Issued Date", value: invoice.date, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Due Date", value: invoice.dueDate, icon: <Calendar size={12} color="#64748B" /> },
                { label: "Invoice Amount", value: formatINR(invoice.grandTotalPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
              onPress={() => setSelectedItem(invoice)}
            />
          );
        }}
      />
      
      {selectedItem && (
        <QuickViewModal
          visible={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={parties.find(p => p.id === selectedItem.partyId)?.companyName || "Unknown Party"}
          subtitle={`${selectedItem.invoiceNo} • ${selectedItem.id}`}
          statusText={selectedItem.status}
          statusVariant={selectedItem.status}
          items={selectedItem.items?.map((i: any) => ({
            name: i.productName,
            qty: `${i.qty} ${i.uom}`,
            price: formatINR(i.totalPaise)
          }))}
          onEdit={() => console.log("Edit", selectedItem.id)}
          onDelete={() => console.log("Delete", selectedItem.id)}
          onCall={() => {
            const party = parties.find(p => p.id === selectedItem.partyId);
            if (party?.phone) {
              Linking.openURL(`tel:${party.phone}`);
            }
          }}
          onViewDetails={() => {
            setSelectedItem(null);
            router.push(`/invoice/${selectedItem.id}` as any);
          }}
        />
      )}
    </SafeAreaView>
  );
}
