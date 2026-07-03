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
import { Truck, Navigation, IndianRupee, Calendar } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function EWayScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const lorryReceipts = useMockStore((state) => state.lorryReceipts);

  const filteredReceipts = lorryReceipts.filter((lr, idx) => {
    if (activeTab === "All") return true;
    if (activeTab === "Generated") return idx % 3 === 0;
    if (activeTab === "Pending") return idx % 3 === 1;
    if (activeTab === "Cancelled") return idx % 3 === 2;
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="E-Way Bills & Logistics" subtitle="Manage transport tracking" />
      
      <FlashList
        data={filteredReceipts}
        // @ts-ignore
        estimatedItemSize={180}
        ListHeaderComponent={
          <View>
            <FilterTabs 
              tabs={["All", "Generated", "Pending", "Cancelled"]} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            <SearchAndFilter 
              placeholder="Search by LR No or Transporter..." 
              filters={[{ label: "Status" }, { label: "Date", icon: Calendar }]} 
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const status = index % 3 === 0 ? "GENERATED" : index % 3 === 1 ? "PENDING" : "CANCELLED";
          const variant = index % 3 === 0 ? "ACTIVE" : index % 3 === 1 ? "PENDING" : "INACTIVE";
          return (
            <ListCard
              icon={<Truck size={20} />}
              title={item.transporter}
              subtitle={`LR No: ${item.lrNo} • Vehicle: ${item.vehicleNo}`}
              statusText={status}
              statusVariant={variant as any}
              rows={[
                { label: "Route", value: `${item.from} to ${item.to}`, icon: <Navigation size={12} color="#64748B" /> },
                { label: "Freight", value: formatINR(item.freightPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
