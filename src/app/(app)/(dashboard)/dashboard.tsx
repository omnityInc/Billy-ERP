import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { GSTLiabilityCard } from '@/components/dashboard/GSTLiabilityCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { NeedsAttentionSection } from '@/components/dashboard/NeedsAttentionSection';
import { SUMMARY_CARDS } from '@/constants/static-data';
import { Text, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

export default function Dashboard() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF2FF' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <DashboardHeader />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        
        <View className="px-6 mb-4 mt-2">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-natural-200 shadow-sm">
            <Search color="#94A3B8" size={20} />
            <TextInput 
              placeholder="Search for anything..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-base text-black"
              style={{ padding: 0, margin: 0 }}
            />
          </View>
        </View>

        <View className="mb-6">
          <GSTLiabilityCard />
        </View>

        <QuickActions />

        <View className="flex-row gap-x-4 px-6">
          <SummaryCard 
            title="Sales" 
            total={SUMMARY_CARDS.sales.total} 
            gst={SUMMARY_CARDS.sales.gst} 
            trend="down" 
          />
          <SummaryCard 
            title="Purchase" 
            total={SUMMARY_CARDS.purchase.total} 
            gst={SUMMARY_CARDS.purchase.gst} 
            trend="up" 
          />
        </View>

        <NeedsAttentionSection />
        
        <View className="items-center mt-2 pb-4">
          <Text className="text-[10px] font-medium text-natural-400">© 2026 Billy. Built with care. Protected by copyright.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
