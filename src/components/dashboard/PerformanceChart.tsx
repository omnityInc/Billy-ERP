import React from 'react';
import { View } from 'react-native';
import { AreaChart, ChartDataPoint } from './AreaChart';

const PERFORMANCE_DATA: ChartDataPoint[] = [
  { label: 'Jan', value1: 4000, value2: 2400 },
  { label: 'Feb', value1: 3000, value2: 1398 },
  { label: 'Mar', value1: 2000, value2: 9800 },
  { label: 'Apr', value1: 2780, value2: 3908 },
  { label: 'May', value1: 1890, value2: 4800 },
  { label: 'Jun', value1: 2390, value2: 3800 },
];

export function PerformanceChart() {
  return (
    <View className="px-4 mb-2">
      <AreaChart
        data={PERFORMANCE_DATA}
        title="Performance"
        legend1="Revenue"
        legend2="Expenses"
        color1="#3B82F6"
        color2="#10B981"
      />
    </View>
  );
}
