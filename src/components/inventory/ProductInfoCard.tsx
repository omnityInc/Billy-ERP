import { View, Text } from "react-native";
import type { Product } from "@/data/mock";

export function ProductInfoCard({ product }: { product: Product }) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-8 border border-natural-200 shadow-sm">
      <View className="mb-4">
        <Text className="text-caption text-natural-500 tracking-wider uppercase">
          Product Information
        </Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="flex-1">
          <Text className="text-caption text-natural-500 mb-1">Barcode / SKU</Text>
          <Text className="text-body-strong text-black">{product.barcode}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-caption text-natural-500 mb-1">Category Group</Text>
          <Text className="text-body-strong text-black">{product.group}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-caption text-natural-500 mb-1">Inventory Flow</Text>
          <Text className="text-body-strong text-black">{product.inventoryType}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-caption text-natural-500 mb-1">Low Stock Alert</Text>
          <Text className="text-body-strong text-black">
            {product.lowStock} {product.uom}
          </Text>
        </View>
      </View>
    </View>
  );
}
