import { formatCompactINR, Paise } from "@/utils/format";
import { Text, View } from "react-native";
import { ArrowDownRight, ArrowUpRight } from "lucide-react-native";

interface SummaryCardProps {
  title: string;
  total: Paise;
  gst: Paise;
  trend: "up" | "down"; 
}

export function SummaryCard({ title, total, gst, trend }: SummaryCardProps) {
  const isUp = trend === "up";
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  const iconColor = isUp ? "#EF4444" : "#10B981";
  const iconBg = isUp ? "bg-[#FEF2F2]" : "bg-[#ECFDF5]";

  return (
    <View className="flex-1 bg-white rounded-xl p-4 border border-natural-200 shadow-sm">
      <View className="flex-row items-center gap-x-2 mb-4">
        <View className={`w-8 h-8 rounded-full ${iconBg} items-center justify-center`}>
          <Icon color={iconColor} size={16} />
        </View>
        <Text className="text-[13px] font-sans-semibold text-black">{title}</Text>
      </View>
      <Text className="text-[22px] font-sans-bold text-black mb-1 tracking-tight">{formatCompactINR(total)}</Text>
      <Text className="text-xs font-sans-medium text-natural-400">
        +GST {formatCompactINR(gst)}
      </Text>
    </View>
  );
}
