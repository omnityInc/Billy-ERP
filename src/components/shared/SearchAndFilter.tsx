import React, { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react-native";
import { TextInput, View, Text, Pressable } from "react-native";

export interface FilterConfig {
  label: string;
  icon?: any;
}

interface Props {
  placeholder?: string;
  filters: FilterConfig[];
}

export function SearchAndFilter({ placeholder = "Search...", filters }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-natural-200 shadow-sm mb-4">
        <Search color="#94A3B8" size={20} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-2 text-base text-black"
          style={{ padding: 0, margin: 0 }}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} className="p-1 -mr-1">
            <X color="#94A3B8" size={20} />
          </Pressable>
        )}
      </View>
      <View className="flex-row items-center justify-between">
        {filters.map((filter, index) => {
          const Icon = filter.icon;
          return (
             <Pressable key={index} className="flex-row items-center justify-center bg-white px-4 py-2 min-h-[44px] rounded-lg border border-natural-200 shadow-sm">
               {Icon && (
                 <View className="mr-2">
                   <Icon color="#64748B" size={16} />
                 </View>
               )}
               <Text className="text-sm font-medium text-natural-700 mr-2">{filter.label}</Text>
               <ChevronDown color="#64748B" size={16} />
             </Pressable>
          )
        })}
      </View>
    </View>
  );
}
