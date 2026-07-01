import React from 'react';
import { View, Text } from 'react-native';
import { formatINR, Paise } from '@/utils/format';

export type AgingData = {
  label: string;
  amount: Paise;
  color: string;
};

interface OutstandingSectionProps {
  title: string;
  totalLabel: string;
  totalAmount: Paise;
  data: AgingData[];
}

export function OutstandingSection({ title, totalLabel, totalAmount, data }: OutstandingSectionProps) {
  // calculate total for the progress bar segments, or use totalAmount if it's the exact sum
  // To avoid small precision issues, usually we use the sum of data
  const sum = data.reduce((acc, curr) => acc + curr.amount, 0);
  
  return (
    <View className="mb-8 px-4">
      <Text className="text-[22px] font-semibold text-black mb-1 leading-tight">{title}</Text>
      <Text className="text-[15px] font-medium text-natural-700 mb-4">{totalLabel}: {formatINR(totalAmount)}</Text>
      
      {/* Progress Bar */}
      <View className="h-3 rounded-full flex-row overflow-hidden mb-6">
        {data.map((item, idx) => (
          <View 
            key={idx} 
            style={{ 
              backgroundColor: item.color, 
              flex: item.amount / sum 
            }} 
          />
        ))}
      </View>

      {/* Grid Cards */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {data.map((item, idx) => (
          <View 
            key={idx} 
            className="w-[48%] bg-white rounded-[14px] p-4 border border-natural-200/50 shadow-sm"
          >
            <View className="flex-row items-center mb-2">
              <View 
                className="w-3.5 h-3.5 rounded-full mr-2" 
                style={{ backgroundColor: item.color }} 
              />
              <Text className="text-[11px] font-semibold text-natural-700 tracking-wider uppercase">{item.label}</Text>
            </View>
            <Text className="text-sm font-semibold text-black">{formatINR(item.amount)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
