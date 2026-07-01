import { Package, Receipt, Truck, Wallet } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const ACTIONS = [
  { id: "sales", label: "Sales", icon: Receipt },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "payment", label: "Payment", icon: Wallet },
  { id: "eway", label: "E-Way", icon: Truck },
];

export function QuickActions() {
  return (
    <View className="mx-6 mb-6">
      <View className="flex-row justify-between items-start">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Pressable key={action.id} className="items-center w-16">
              <View className="w-16 h-16 bg-white rounded-[14px] items-center justify-center border border-natural-100 mb-2 shadow-sm">
                <Icon color="#0F172A" size={24} />
              </View>
              <Text className="text-[10px] font-medium text-natural-800 text-center">
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
