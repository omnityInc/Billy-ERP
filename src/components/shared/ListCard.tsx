import React, { ReactNode } from "react";
import { Text, View } from "react-native";

export interface ListCardProps {
  icon?: ReactNode;
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
}

export function ListCard({
  icon,
  title,
  subtitle,
  statusText,
  statusVariant,
  rows,
}: ListCardProps) {
  const getStatusStyle = () => {
    switch (statusVariant) {
      case "PAID":
      case "ACTIVE":
        return "bg-[#DCFCE7] text-[#166534]"; // green
      case "OVER DUE":
      case "INACTIVE":
      case "UNPAID":
        return "bg-[#FEE2E2] text-[#991B1B]"; // red
      case "PARTIAL":
        return "bg-[#DBEAFE] text-[#1E40AF]"; // blue
      case "PENDING":
      default:
        return "bg-[#FEF3C7] text-[#92400E]"; // yellow
    }
  };

  const getIconStyle = () => {
    switch (statusVariant) {
      case "PAID":
      case "ACTIVE":
        return { bg: "bg-[#DCFCE7]", border: "border-[#bbf7d0]", color: "#166534" };
      case "OVER DUE":
      case "INACTIVE":
      case "UNPAID":
        return { bg: "bg-[#FEE2E2]", border: "border-[#fecaca]", color: "#991B1B" };
      case "PARTIAL":
        return { bg: "bg-[#DBEAFE]", border: "border-[#bfdbfe]", color: "#1E40AF" };
      case "PENDING":
      default:
        return { bg: "bg-[#FEF3C7]", border: "border-[#fde68a]", color: "#92400E" };
    }
  };

  const iconTheme = getIconStyle();

  return (
    <View className="bg-white rounded-xl p-4 mb-4 border border-natural-200 shadow-sm mx-4">
      <View className="flex-row items-center mb-4">
        {icon && (
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 border ${iconTheme.bg} ${iconTheme.border}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { color: iconTheme.color }) : icon}
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-semibold text-black">{title}</Text>
          {subtitle && (
            <Text className="text-xs text-natural-500 mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>

      <View className="h-[1px] bg-natural-100 mb-4" />

      {rows.map((row, idx) => (
        <View key={idx} className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            {row.icon && <View className="mr-1">{row.icon}</View>}
            <Text className="text-sm text-natural-500">{row.label}</Text>
          </View>
          <Text className="text-m font-medium text-black">{row.value}</Text>
        </View>
      ))}

      {statusText && (
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <Text className="text-sm text-natural-500">Status</Text>
          </View>
          <View
            className={`px-2 py-1 rounded ${getStatusStyle().split(" ")[0]}`}
          >
            <Text
              className={`text-xs font-bold uppercase ${getStatusStyle().split(" ")[1]}`}
            >
              {statusText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
