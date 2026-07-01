import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TrendingUp, PackageX } from 'lucide-react-native';

type MoverItem = {
  name: string;
  qty: number;
};

const TOP_MOVERS: MoverItem[] = [
  { name: 'Fevicol SH 1kg', qty: 48 },
  { name: 'MDF Board 12mm', qty: 48 },
  { name: 'Plaster of Paris 2...', qty: 47 },
  { name: 'Finolex Wire 1.5 ...', qty: 46 },
  { name: 'Finolex Wire 2.5 ...', qty: 46 },
];

const DEAD_STOCK: MoverItem[] = [
  { name: 'Ambuja Cement B...', qty: 4 },
  { name: 'Sintex Water Tan...', qty: 198 },
  { name: 'PVC Pipe 1 inch', qty: 435 },
  { name: 'PVC Pipe 2 inch', qty: 291 },
  { name: 'Teak Wood Board', qty: 25 },
];

export function InventoryMoversSection() {
  return (
    <View className="mb-8">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
        {/* Top Movers */}
        <View className="bg-white rounded-2xl p-5 w-[280px] shadow-sm border border-natural-200 mr-4">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 rounded-full bg-[#DCFCE7] items-center justify-center mr-3">
              <TrendingUp color="#16A34A" size={20} />
            </View>
            <Text className="text-lg font-bold text-black">Top Movers</Text>
          </View>
          
          <View>
            {TOP_MOVERS.map((item, idx) => (
              <View key={idx} className={`flex-row justify-between items-center py-3 ${idx !== TOP_MOVERS.length - 1 ? 'border-b border-natural-100' : ''}`}>
                <Text className="text-sm font-medium text-natural-700">{item.name}</Text>
                <Text className="text-sm font-bold text-[#16A34A]">{item.qty} sold</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dead Stock */}
        <View className="bg-white rounded-2xl p-5 w-[280px] shadow-sm border border-natural-200 mr-12">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 rounded-full bg-[#FEE2E2] items-center justify-center mr-3">
              <PackageX color="#DC2626" size={20} />
            </View>
            <Text className="text-lg font-bold text-black">Dead Stock</Text>
          </View>
          
          <View>
            {DEAD_STOCK.map((item, idx) => (
              <View key={idx} className={`flex-row justify-between items-center py-3 ${idx !== DEAD_STOCK.length - 1 ? 'border-b border-natural-100' : ''}`}>
                <Text className="text-sm font-medium text-natural-700">{item.name}</Text>
                <Text className="text-sm font-bold text-[#DC2626]">{item.qty} left</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
