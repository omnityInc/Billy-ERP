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
import { Package, Hash, IndianRupee } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { InventoryQuickViewModal } from "@/components/shared/InventoryQuickViewModal";

export default function InventoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Items");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const products = useMockStore((state) => state.products);

  const filteredProducts = products.filter(p => {
    if (activeTab === "Low Stock") return p.availableQty <= p.lowStock && p.availableQty > 0;
    if (activeTab === "Out of Stock") return p.availableQty === 0;
    return true;
  });

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleViewDetails = () => {
    setIsModalVisible(false);
    if (selectedProduct) {
      router.push(`/inventory/${selectedProduct.id}` as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <ScreenHeader title="Inventory" subtitle="Manage stock and items" />
      
      <FlashList
        data={filteredProducts}
        // @ts-ignore
        estimatedItemSize={180}
        ListHeaderComponent={
          <View>
            <FilterTabs 
              tabs={["All Items", "Low Stock", "Out of Stock"]} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            <SearchAndFilter 
              placeholder="Search for inventory items..." 
              filters={[{ label: "Category" }, { label: "Sort By" }]} 
            />
          </View>
        }
        renderItem={({ item, index }: { item: any, index: number }) => {
          return (
            <ListCard
              onPress={() => handleProductPress(item)}
              icon={<Package size={20} />}
              title={item.name}
              subtitle={`Code: ${item.barcode} • HSN: ${item.hsnSac}`}
              statusText={item.availableQty === 0 ? "OUT OF STOCK" : item.availableQty <= item.lowStock ? "LOW STOCK" : "IN STOCK"}
              statusVariant={item.availableQty === 0 ? "INACTIVE" : item.availableQty <= item.lowStock ? "PENDING" : "ACTIVE"}
              rows={[
                { label: "Available Qty", value: `${item.availableQty} ${item.uom}`, icon: <Hash size={12} color="#64748B" /> },
                { label: "Sell Price", value: formatINR(item.sellPricePaise), icon: <IndianRupee size={12} color="#64748B" /> }
              ]}
            />
          );
        }}
      />

      <InventoryQuickViewModal
        product={selectedProduct}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onViewDetails={handleViewDetails}
      />
    </SafeAreaView>
  );
}
