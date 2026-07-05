import { View, Text } from "react-native";
import type { Product } from "@/data/mock";

export function ProductStockCard({ product, status }: { product: Product, status: any }) {
  return (
    <View className={`rounded-2xl p-6 mb-4 ${status.bg} border-0 shadow-sm flex-row items-center`}>
      <View className="mr-4">{status.icon}</View>
      <View className="flex-1">
        <Text className={`text-sm font-sans-bold ${status.text} mb-1 tracking-wider`}>
          AVAILABLE QUANTITY
        </Text>
        <Text className={`text-h1 ${status.text}`}>
          {product.availableQty} <Text className="text-body">{product.uom}</Text>
        </Text>
      </View>
    </View>
  );
}
