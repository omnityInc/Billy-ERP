import { View, Text, ScrollView } from "react-native";
import { formatINR } from "@/utils/format";
import type { Invoice } from "@/data/mock";

export function InvoiceItemsList({ invoice, enrichedItems, hasDiscount }: { invoice: Invoice, enrichedItems: any[], hasDiscount: boolean }) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
      <Text className="text-caption text-natural-500 mb-3 tracking-wider uppercase">
        Line Items
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View>
          {/* Table Header */}
          <View className="flex-row border-b border-natural-200 pb-2 mb-2">
            <Text className="text-caption text-natural-500 w-8">#</Text>
            <Text className="text-caption text-natural-500 w-32">Description</Text>
            <Text className="text-caption text-natural-500 w-24">HSN/SAC</Text>
            <Text className="text-caption text-natural-500 w-16 text-right">Qty</Text>
            <Text className="text-caption text-natural-500 w-24 text-right">Rate</Text>
            {hasDiscount && (
              <Text className="text-caption text-natural-500 w-16 text-right">Disc %</Text>
            )}
            <Text className="text-caption text-natural-500 w-24 text-right">Amount</Text>
          </View>

          {/* Table Rows */}
          {enrichedItems.map((item, index) => (
            <View key={item.id} className="flex-row py-2 border-b border-natural-100">
              <Text className="text-caption text-black w-8">{index + 1}</Text>
              <Text className="text-caption text-black w-32" numberOfLines={2}>
                {item.productName}
              </Text>
              <Text className="text-caption text-natural-600 w-24">{item.hsnSac}</Text>
              <Text className="text-caption text-black w-16 text-right">
                {item.qty} {item.uom}
              </Text>
              <Text className="text-caption text-black w-24 text-right">
                {formatINR(item.ratePaise)}
              </Text>
              {hasDiscount && (
                <Text className="text-caption text-natural-600 w-16 text-right">
                  {item.discountPercent}%
                </Text>
              )}
              <Text className="text-caption text-black w-24 text-right">
                {formatINR(item.totalPaise)}
              </Text>
            </View>
          ))}

          {/* Table Totals */}
          <View className="flex-row py-3 mt-1">
            <View className="flex-1 mr-4">
              <Text className="text-caption text-natural-500 text-right">Subtotal:</Text>
              <Text className="text-caption text-natural-500 text-right mt-1">Tax Amount:</Text>
              <Text className="text-body-strong text-black text-right mt-2">Grand Total:</Text>
            </View>
            <View className="w-24">
              <Text className="text-caption text-black text-right">
                {formatINR(invoice.taxableAmountPaise)}
              </Text>
              <Text className="text-caption text-black text-right mt-1">
                {formatINR(invoice.taxAmountPaise)}
              </Text>
              <Text className="text-body-strong text-black text-right mt-2">
                {formatINR(invoice.grandTotalPaise)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
