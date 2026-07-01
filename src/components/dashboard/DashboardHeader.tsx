import { USER_DATA } from "@/constants/static-data";
import { getGreeting } from "@/utils/dates";
import { Bell, Settings } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

export function DashboardHeader() {
  const greeting = getGreeting();

  return (
    <View className="flex-row items-center justify-between px-4 py-4">
      <View className="flex-row items-center gap-x-3">
        <Image
          source={USER_DATA.avatarUrl}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View>
          <Text className="text-[13px] text-natural-500">{greeting}</Text>
          <Text className="text-xl font-semibold text-black">
            {USER_DATA.name}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-x-4">
        <Pressable className="relative p-1">
          <Bell color="#1A1A1A" size={24} />
          {/* Notification Dot */}
          <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </Pressable>

        <Pressable className="p-1">
          <Settings color="#1A1A1A" size={24} />
        </Pressable>
      </View>
    </View>
  );
}
