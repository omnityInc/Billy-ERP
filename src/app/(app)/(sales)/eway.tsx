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
import { Truck, Navigation, IndianRupee, Calendar } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { EWayQuickViewModal } from "@/components/shared/EWayQuickViewModal";
import { ListCardSkeleton } from "@/components/shared/Skeleton";

export default function EWayScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedLR, setSelectedLR] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: lorryReceipts = [], isLoading, isError } = useQuery({ queryKey: ["lorryReceipts"], queryFn: mockApi.getEwayBills });



  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load E-Way bills.</Text>
      </SafeAreaView>
    );
  }

  const filteredReceipts = isLoading ? [] : lorryReceipts.filter((lr) => {
    if (activeTab === "All") return true;
    if (activeTab === "Generated") return lr.status === "GENERATED";
    if (activeTab === "Pending") return lr.status === "PENDING";
    if (activeTab === "Cancelled") return lr.status === "CANCELLED";
    return true;
  });

  const handleLRPress = (lr: any) => {
    setSelectedLR(lr);
    setIsModalVisible(true);
  };

  const handleViewDetails = () => {
    setIsModalVisible(false);
    if (selectedLR) {
      router.push(`/eway/${selectedLR.id}` as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="E-Way Bills & Logistics" subtitle="Manage transport tracking" />
      
      <FlashList
        data={isLoading ? [1, 2, 3, 4, 5, 6] as any : filteredReceipts}
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
        renderItem={({ item }) => {
          if (isLoading) return <ListCardSkeleton />;
          const lr = item as any;
          const variant = lr.status === "GENERATED" ? "ACTIVE" : lr.status === "PENDING" ? "PENDING" : "INACTIVE";
          return (
            <ListCard
              onPress={() => handleLRPress(lr)}
              icon={<Truck size={20} />}
              title={lr.transporter}
              subtitle={`LR No: ${lr.lrNo} • Vehicle: ${lr.vehicleNo}`}
              statusText={lr.status}
              statusVariant={variant as any}
              rows={[
                { label: "Route", value: `${lr.from} to ${lr.to}`, icon: <Navigation size={12} color="#64748B" /> },
                { label: "Freight", value: formatINR(lr.freightPaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />

      <EWayQuickViewModal
        lr={selectedLR}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onViewDetails={handleViewDetails}
      />
    </SafeAreaView>
  );
}
