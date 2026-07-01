import React from 'react';
import { View } from 'react-native';
import { AreaChart, ChartDataPoint } from './AreaChart';

const CASH_FLOW_DATA: ChartDataPoint[] = [
  { label: 'Mon', value1: 1000, value2: 800 },
  { label: 'Tue', value1: 1200, value2: 900 },
  { label: 'Wed', value1: 900, value2: 1100 },
  { label: 'Thu', value1: 1500, value2: 1000 },
  { label: 'Fri', value1: 1800, value2: 1400 },
];

export function CashFlowChart() {
  return (
    <View className="px-6 mb-6">
      <AreaChart
        data={CASH_FLOW_DATA}
        title="Cash Flow"
        legend1="Inflow"
        legend2="Outflow"
        color1="#8B5CF6"
        color2="#F43F5E"
      />
    </View>
  );
}
