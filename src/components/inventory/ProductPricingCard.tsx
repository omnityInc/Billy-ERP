import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Percent } from "lucide-react-native";
import { formatINR } from "@/utils/format";
import type { Product } from "@/data/mock";

export function ProductPricingCard({ product }: { product: Product }) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
      <View className="mb-4">
        <Text className="text-caption text-natural-500 tracking-wider uppercase">
          Pricing & Taxes
        </Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-2 bg-natural-50 p-3 rounded-xl">
          <View className="flex-row items-center mb-1">
            <TrendingUp size={14} color="#166534" className="mr-1.5" />
            <Text className="text-caption text-natural-600">Sell Price</Text>
          </View>
          <Text className="text-h3 text-black">
            {formatINR(product.sellPricePaise)}
          </Text>
          {product.saleDiscount > 0 && (
            <Text className="text-[10px] text-natural-500 mt-1">
              {product.saleDiscount}% off applied
            </Text>
          )}
        </View>
        <View className="flex-1 ml-2 bg-natural-50 p-3 rounded-xl">
          <View className="flex-row items-center mb-1">
            <TrendingDown size={14} color="#991B1B" className="mr-1.5" />
            <Text className="text-caption text-natural-600">Purchase Price</Text>
          </View>
          <Text className="text-h3 text-black">
            {formatINR(product.purchasePricePaise)}
          </Text>
          {product.purchaseDiscount > 0 && (
            <Text className="text-[10px] text-natural-500 mt-1">
              {product.purchaseDiscount}% off applied
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row justify-between pt-2">
        <View className="flex-1">
          <Text className="text-caption text-natural-500 mb-1">GST Rate</Text>
          <View className="flex-row items-center">
            <Percent size={14} color="#0F172A" className="mr-1" />
            <Text className="text-body-strong text-black">{product.tax}%</Text>
          </View>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-caption text-natural-500 mb-1">HSN/SAC Code</Text>
          <Text className="text-body-strong text-black">{product.hsnSac}</Text>
        </View>
      </View>
    </View>
  );
}
