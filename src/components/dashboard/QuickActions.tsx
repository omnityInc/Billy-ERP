import { Package, Receipt, Truck, Wallet } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

const ACTIONS = [
  { id: "sales", label: "Sales", icon: Receipt },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "payment", label: "Payment", icon: Wallet },
  { id: "eway", label: "E-Way", icon: Truck },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View className="mx-4 mb-6">
      <View className="flex-row justify-between items-start">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Pressable 
              key={action.id} 
              className="items-center w-16"
              onPress={() => router.push(`/${action.id}` as any)}
            >
              <View className="w-16 h-16 bg-white rounded-[14px] items-center justify-center border border-natural-100 mb-2 shadow">
                <Icon color="#0F172A" size={24} />
              </View>
              <Text className="text-xs font-sans-medium text-natural-900 text-center">
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
