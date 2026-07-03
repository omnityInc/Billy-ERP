import { useState } from "react";
import { View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { SearchAndFilter } from "@/components/shared/SearchAndFilter";
import { ListCard } from "@/components/shared/ListCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { useMockStore } from "@/store/mockStore";
import { formatINR } from "@/utils/format";
import { ReceiptText, Calendar, IndianRupee } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SalesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  const salesInvoices = useMockStore((state) => state.salesInvoices);
  const parties = useMockStore((state) => state.parties);

  const filteredInvoices = salesInvoices.filter(i => 
    activeTab === "All" ? true : i.status === activeTab.toUpperCase()
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
        renderItem={({ item, index }: { item: any, index: number }) => {
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
              onPress={() => setSelectedItem(item)}
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
