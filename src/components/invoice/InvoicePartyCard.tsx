import { View, Text, Pressable, Linking } from "react-native";
import { Phone } from "lucide-react-native";
import type { Party } from "@/data/mock";

export function InvoicePartyCard({ party }: { party: Party }) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-caption text-natural-500 tracking-wider uppercase">
          Bill To
        </Text>
        <Pressable
          onPress={() => party.phone && Linking.openURL(`tel:${party.phone}`)}
          className="p-2 bg-info-100 border border-info-300 rounded-full -mt-2 -mr-2"
        >
          <Phone size={16} color="#1E40AF" />
        </Pressable>
      </View>
      <Text className="text-h3 text-black mb-1">{party.companyName}</Text>
      <Text className="text-body text-natural-600 mb-2 leading-5">
        {party.billingAddress}, {party.city}, {party.state} - {party.pincode}
      </Text>
      <View className="flex-row justify-between items-center bg-natural-50 p-3 rounded-lg border border-natural-100">
        <View>
          <Text className="text-caption text-natural-500 mb-0.5">GSTIN</Text>
          <Text className="text-body-strong text-black">{party.gstin}</Text>
        </View>
        <View className="items-end">
          <Text className="text-caption text-natural-500 mb-0.5">Phone</Text>
          <Text className="text-body-strong text-black">{party.phone}</Text>
        </View>
      </View>
    </View>
  );
}
