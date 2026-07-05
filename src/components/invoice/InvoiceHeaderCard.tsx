import { View, Text } from "react-native";
import { formatINR } from "@/utils/format";
import type { Invoice } from "@/data/mock";

export function InvoiceHeaderCard({ invoice }: { invoice: Invoice }) {
  const getStatusStyle = () => {
    switch (invoice.status) {
      case "PAID":
        return { bg: "bg-success-100", text: "text-success-800" };
      case "UNPAID":
        return { bg: "bg-danger-100", text: "text-danger-800" };
      case "PARTIAL":
        return { bg: "bg-info-100", text: "text-info-800" };
      default:
        return { bg: "bg-warning-100", text: "text-warning-800" };
    }
  };
  const statusStyle = getStatusStyle();

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-body-strong text-natural-500 mb-1 tracking-wider uppercase">
            Invoice Amount
          </Text>
          <Text className="text-h1 text-black">
            {formatINR(invoice.grandTotalPaise)}
          </Text>
        </View>
        <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
          <Text className={`text-xs font-sans-bold uppercase tracking-wider ${statusStyle.text}`}>
            {invoice.status}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between pt-4 border-t border-natural-100">
        <View>
          <Text className="text-caption text-natural-500 mb-0.5">DATE</Text>
          <Text className="text-body-strong text-black">{invoice.date}</Text>
        </View>
        <View className="items-end">
          <Text className="text-caption text-natural-500 mb-0.5">DUE DATE</Text>
          <Text className="text-body-strong text-black">{invoice.dueDate}</Text>
        </View>
      </View>
    </View>
  );
}
