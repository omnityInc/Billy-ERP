import { Modal, Pressable, Text, View } from "react-native";
import { X, Package, Box, Hash, IndianRupee, TrendingUp, TrendingDown, ArrowRight } from "lucide-react-native";
import { formatINR } from "@/utils/format";
import type { Product, Paise } from "@/data/mock";

interface InventoryQuickViewModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export function InventoryQuickViewModal({
  product,
  visible,
  onClose,
  onViewDetails,
}: InventoryQuickViewModalProps) {
  if (!product) return null;

  const isOutOfStock = product.availableQty === 0;
  const isLowStock = product.availableQty > 0 && product.availableQty <= product.lowStock;
  const inStock = product.availableQty > product.lowStock;

  const getStatusStyle = () => {
    if (isOutOfStock) return { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", label: "OUT OF STOCK" };
    if (isLowStock) return { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", label: "LOW STOCK" };
    return { bg: "bg-[#DCFCE7]", text: "text-[#166534]", label: "IN STOCK" };
  };

  const status = getStatusStyle();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />
        
        <View className="bg-white rounded-t-3xl p-6 pb-8">
          {/* HEADER */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row flex-1 pr-4">
              <View className="w-12 h-12 rounded-full bg-natural-100 items-center justify-center mr-4">
                <Package size={24} color="#0F172A" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-x-3">
                  <Text className="text-xl font-sans-bold text-black shrink" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View className={`px-2 py-1 rounded ${status.bg}`}>
                    <Text className={`text-[10px] font-sans-bold tracking-wider ${status.text}`}>
                      {status.label}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-natural-500 mt-1">
                  {product.group}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Pressable onPress={onClose} className="p-1 bg-natural-100 rounded-full">
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* STOCK SNAPSHOT */}
          <View className="bg-natural-50 rounded-xl p-4 mb-4 border border-natural-200 flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-sans-semibold text-natural-500 uppercase tracking-wider mb-1">
                Available Stock
              </Text>
              <Text className={`text-h2 ${isOutOfStock ? "text-red-600" : "text-black"}`}>
                {product.availableQty} <Text className="text-sm font-sans-regular text-natural-500">{product.uom}</Text>
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-natural-500 mb-1">Low Stock Alert at</Text>
              <Text className="text-sm font-sans-semibold text-natural-700">{product.lowStock} {product.uom}</Text>
            </View>
          </View>

          {/* PRICING */}
          <View className="flex-row justify-between mb-8 gap-x-4">
            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-3">
                <TrendingUp size={16} color="#166534" />
                <Text className="text-xs font-sans-medium text-natural-500">Sell Price</Text>
              </View>
              <Text className="text-lg font-sans-bold text-black">
                {formatINR(product.sellPricePaise)}
              </Text>
            </View>
            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-3">
                <TrendingDown size={16} color="#991B1B" />
                <Text className="text-xs font-sans-medium text-natural-500">Purchase Price</Text>
              </View>
              <Text className="text-lg font-sans-bold text-black">
                {formatINR(product.purchasePricePaise)}
              </Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View className="flex-row gap-x-3">
            <Pressable
              onPress={onViewDetails}
              className="flex-1 bg-black py-3 rounded-xl items-center justify-center shadow-sm flex-row gap-x-2"
            >
              <Text className="text-white font-sans-bold text-sm">Full Details</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
