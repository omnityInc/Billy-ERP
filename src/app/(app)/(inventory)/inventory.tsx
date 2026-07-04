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
import { Package, Hash, IndianRupee } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { InventoryQuickViewModal } from "@/components/shared/InventoryQuickViewModal";
import { ListCardSkeleton } from "@/components/shared/Skeleton";

export default function InventoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Items");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: products = [], isLoading, isError } = useQuery({ queryKey: ["products"], queryFn: mockApi.getProducts });



  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load inventory.</Text>
      </SafeAreaView>
    );
  }

  const filteredProducts = isLoading ? [] : products.filter(p => {
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
        data={isLoading ? [1, 2, 3, 4, 5, 6] as any : filteredProducts}
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
        renderItem={({ item, index }) => {
          if (isLoading) return <ListCardSkeleton />;
          const product = item as any;
          return (
            <ListCard
              onPress={() => handleProductPress(product)}
              icon={<Package size={20} />}
              title={product.name}
              subtitle={`Code: ${product.barcode} • HSN: ${product.hsnSac}`}
              statusText={product.availableQty === 0 ? "OUT OF STOCK" : product.availableQty <= product.lowStock ? "LOW STOCK" : "IN STOCK"}
              statusVariant={product.availableQty === 0 ? "INACTIVE" : product.availableQty <= product.lowStock ? "PENDING" : "ACTIVE"}
              rows={[
                { label: "Available Qty", value: `${product.availableQty} ${product.uom}`, icon: <Hash size={12} color="#64748B" /> },
                { label: "Sell Price", value: formatINR(product.sellPricePaise), icon: <IndianRupee size={12} color="#64748B" /> }
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
