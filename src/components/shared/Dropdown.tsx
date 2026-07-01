import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from './Input';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  searchable?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  required,
  error,
  leftIcon,
  searchable = true,
}: DropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable 
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <Pressable onPress={() => { setModalVisible(true); Keyboard.dismiss(); }}>
        <View pointerEvents="none">
          <Input
            label={label}
            required={required}
            error={error}
            placeholder={placeholder}
            value={selectedOption ? selectedOption.label : ''}
            leftIcon={leftIcon}
            rightIcon={<ChevronDown color="#6B7280" size={20} />}
            editable={false}
          />
        </View>
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
            
            <View className="bg-white rounded-t-2xl max-h-[80%]">
              <View className="flex-row items-center justify-between px-6 py-4 border-b border-natural-200">
                <Text className="h4 text-black">{label || 'Select'}</Text>
                <Pressable onPress={() => setModalVisible(false)} className="p-2 -mr-2">
                  <X color="#1A1A1A" size={24} />
                </Pressable>
              </View>

              {searchable && (
                <View className="px-6 py-4 border-b border-natural-100">
                  <View className="flex-row items-center bg-natural-50 h-12 rounded-lg px-4 border border-natural-200">
                    <Search color="#6B7280" size={20} />
                    <TextInput 
                      className="flex-1 ml-2 text-black body"
                      placeholder="Search..."
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable 
                    onPress={() => handleSelect(item.value)}
                    className={`px-6 py-4 border-b border-natural-100 ${value === item.value ? 'bg-natural-50' : 'bg-white'}`}
                  >
                    <Text className={`body ${value === item.value ? 'text-black font-semibold' : 'text-natural-700'}`}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                keyboardShouldPersistTaps="handled"
                className="mb-8"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
