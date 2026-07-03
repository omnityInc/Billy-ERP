import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export interface ListCardProps {
  icon?: ReactNode; // Maintained for backward compatibility, but not rendered
  title: string;
  subtitle?: string;
  statusText?: string;
  statusVariant?:
    | "PENDING"
    | "PAID"
    | "OVER DUE"
    | "ACTIVE"
    | "INACTIVE"
    | "PARTIAL"
    | "UNPAID";
  rows: { label: string; value: string; icon?: ReactNode }[];
  onPress?: () => void;
}

export function ListCard({
  title,
  subtitle,
  statusText,
  statusVariant,
  rows,
  onPress,
}: ListCardProps) {
  const getStatusStyle = () => {
    switch (statusVariant) {
      case "PAID":
      case "ACTIVE":
        return {
          bg: "bg-[#DCFCE7]",
          text: "text-[#166534]",
          indicatorBg: "bg-[#22C55E]",
        }; // green
      case "OVER DUE":
      case "INACTIVE":
      case "UNPAID":
        return {
          bg: "bg-[#FEE2E2]",
          text: "text-[#991B1B]",
          indicatorBg: "bg-[#EF4444]",
        }; // red
      case "PARTIAL":
        return {
          bg: "bg-[#DBEAFE]",
          text: "text-[#1E40AF]",
          indicatorBg: "bg-[#3B82F6]",
        }; // blue
      case "PENDING":
      default:
        return {
          bg: "bg-[#FEF3C7]",
          text: "text-[#92400E]",
          indicatorBg: "bg-[#F59E0B]",
        }; // yellow
    }
  };

  const style = getStatusStyle();

  const formatDate = (val: string) => {
    if (!val || typeof val !== "string") return val;
    const parts = val.split("-");
    if (parts.length !== 3 || parts[0].length !== 4) return val; // Basic check for YYYY-MM-DD
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx < 0 || monthIdx > 11) return val;
    const year = parts[0].slice(-2);
    const day = parts[2];
    return `${day}-${months[monthIdx]}-${year}`;
  };

  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-xl pl-6 pr-4 py-4 mb-4 border border-natural-200 shadow-sm mx-4 relative overflow-hidden ${onPress ? "active:opacity-70" : ""}`}
    >
      {/* Visual Indicator */}
      <View
        className={`absolute top-0 bottom-0 left-0 w-1 ${style.indicatorBg}`}
      />

      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4">
          <Text className="text-base font-semibold text-black">{title}</Text>
          {subtitle && (
            <Text className="text-xs text-natural-500 mt-1">{subtitle}</Text>
          )}
        </View>
        <View className="items-end">
          {statusText && (
            <View className={`px-2 py-1 rounded ${style.bg}`}>
              <Text
                className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}
              >
                {statusText}
              </Text>
            </View>
          )}
        </View>
      </View>

      {rows.length > 0 && (
        <>
          <View className="h-[1px] bg-natural-100 mb-3" />
          {rows.map((row, idx) => {
            const isAmount =
              row.label.toLowerCase().includes("amount") ||
              row.label.toLowerCase() === "total";
            const isDate = row.label.toLowerCase().includes("date");
            const displayValue = isDate ? formatDate(row.value) : row.value;

            return (
              <View
                key={idx}
                className="flex-row justify-between items-center mb-2"
              >
                <View className="flex-row items-center">
                  {row.icon && <View className="mr-1.5">{row.icon}</View>}
                  <Text className="text-sm text-natural-500">{row.label}</Text>
                </View>
                <Text
                  className={`text-sm ${isAmount ? "font-bold text-black text-[15px]" : "font-medium text-black"}`}
                >
                  {displayValue}
                </Text>
              </View>
            );
          })}
        </>
      )}
    </Pressable>
  );
}
