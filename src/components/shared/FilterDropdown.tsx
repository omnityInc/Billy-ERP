import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onSelect: (value: string) => void;
  icon?: any;
}

export function FilterDropdown({ label, options, value, onSelect, icon: Icon }: FilterDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : label;

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable 
        onPress={() => setModalVisible(true)}
        className="flex-row items-center bg-white px-3 py-2 min-h-[44px] rounded-lg border border-natural-200 shadow-sm"
      >
        {Icon && <Icon color="#64748B" size={16} className="mr-2" />}
        <Text className="text-sm font-sans-medium text-natural-700 mr-2">{displayLabel}</Text>
        <ChevronDown color="#64748B" size={16} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            
            <View className="bg-white rounded-t-2xl max-h-[70%]">
              <View className="flex-row items-center justify-between px-6 py-4 border-b border-natural-200">
                <Text className="text-xl font-sans-semibold text-black">{label}</Text>
                <Pressable onPress={() => setModalVisible(false)} className="p-2 -mr-2 min-h-[44px] min-w-[44px] items-center justify-center">
                  <X color="#1A1A1A" size={24} />
                </Pressable>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable 
                    onPress={() => handleSelect(item.value)}
                    className={`px-6 py-4 border-b border-natural-100 min-h-[44px] justify-center ${value === item.value ? 'bg-natural-50' : 'bg-white'}`}
                  >
                    <Text className={`text-base ${value === item.value ? 'text-black font-sans-semibold' : 'text-natural-700'}`}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                className="mb-8"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
