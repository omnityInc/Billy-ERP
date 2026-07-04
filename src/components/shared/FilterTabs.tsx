import { Pressable, Text, View } from "react-native";

interface Props {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function FilterTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <View className="px-4 mb-4 mt-4">
      <View className="flex-row w-full bg-natural-200 rounded-xl p-1 border border-natural-200">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              className={`will-change-variable flex-1 items-center justify-center py-2 rounded-lg ${isActive ? "bg-white shadow-sm" : "bg-transparent"}`}
            >
              <Text
                className={`will-change-variable text-sm font-sans-medium ${isActive ? "text-black" : "text-natural-500"}`}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
