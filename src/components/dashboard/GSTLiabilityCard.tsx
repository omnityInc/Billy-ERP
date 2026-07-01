import { GST_LIABILITY } from "@/constants/static-data";
import { formatCompactINR } from "@/utils/format";
import { ArrowUpRight } from "lucide-react-native";
import { Text, View } from "react-native";

export function GSTLiabilityCard() {
  return (
    <View className="mx-4 bg-white rounded-xl p-5 border border-natural-200">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-x-3">
          <View className="w-10 h-10 rounded-full bg-[#EFF6FF] items-center justify-center">
            <ArrowUpRight color="#3B82F6" size={20} />
          </View>
          <Text className="text-lg font-semibold text-black">
            Est. GST Liability
          </Text>
        </View>
        <Text className="text-[28px] font-semibold text-[#10B981] tracking-tight">
          {formatCompactINR(GST_LIABILITY.total)}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-natural-200 mb-4" />

      {/* Bottom Row */}
      <View className="flex-row justify-between">
        <View>
          <Text className="text-[13px] font-medium text-natural-500 mb-1">
            Payable
          </Text>
          <Text className="text-lg font-semibold text-black">
            {formatCompactINR(GST_LIABILITY.payable)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[13px] font-medium text-natural-500 mb-1">
            Refund
          </Text>
          <Text className="text-lg font-semibold text-black">
            {formatCompactINR(GST_LIABILITY.refund)}
          </Text>
        </View>
      </View>
    </View>
  );
}
