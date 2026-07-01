import React from 'react';
import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { LOW_STOCK_ALERTS, OVERDUE_PAYMENTS } from '@/constants/static-data';
import { formatCompactINR } from "@/utils/format";
import { CircleAlert } from "lucide-react-native";

export function NeedsAttentionSection() {
    const router = useRouter();

    return (
        <View className="px-6 mb-6 mt-8">
            <Text className="text-[17px] font-semibold text-[#0F172A] mb-4">Needs Attention</Text>
            
            {LOW_STOCK_ALERTS.length > 0 && (
                <View className="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-5 mb-4">
                    <View className="flex-row items-center mb-4">
                        <CircleAlert color="#EAB308" size={20} />
                        <Text className="text-[15px] font-semibold text-black ml-2">Low Stock Alert</Text>
                    </View>
                    {LOW_STOCK_ALERTS.slice(0, 3).map((item, idx) => (
                        <View key={item.id} className={`flex-row justify-between items-center py-3 ${idx !== Math.min(LOW_STOCK_ALERTS.length, 3) - 1 ? 'border-b border-[#FEF08A]' : ''}`}>
                            <Text className="text-[13px] font-medium text-[#64748B] flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                            <Text className="text-[13px] font-semibold text-[#D97706]">{item.leftCount || 0} left</Text>
                        </View>
                    ))}
                    {LOW_STOCK_ALERTS.length > 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/products-services', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-xs font-medium text-[#64748B] text-center">+ {LOW_STOCK_ALERTS.length - 3} more items need restocking</Text>
                        </Pressable>
                    )}
                    {LOW_STOCK_ALERTS.length <= 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/products-services', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-xs font-medium text-[#64748B] text-center">View all products</Text>
                        </Pressable>
                    )}
                </View>
            )}

            {OVERDUE_PAYMENTS.length > 0 && (
                <View className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 mb-4">
                    <View className="flex-row items-center mb-4">
                        <CircleAlert color="#EF4545" size={20} />
                        <Text className="text-[15px] font-semibold text-black ml-2">Overdue Payments</Text>
                    </View>
                    {OVERDUE_PAYMENTS.slice(0, 3).map((inv, idx) => (
                        <View key={inv.id} className={`flex-row justify-between items-center py-3 ${idx !== Math.min(OVERDUE_PAYMENTS.length, 3) - 1 ? 'border-b border-[#FECACA]' : ''}`}>
                            <Text className="text-[13px] font-medium text-[#64748B]" numberOfLines={1}>{inv.name}</Text>
                            <Text className="text-[13px] font-semibold text-[#EF4444]">{formatCompactINR(inv.amount || 0)}</Text>
                        </View>
                    ))}
                    {OVERDUE_PAYMENTS.length > 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-xs font-medium text-[#64748B] text-center">+ {OVERDUE_PAYMENTS.length - 3} more overdue invoices</Text>
                        </Pressable>
                    )}
                    {OVERDUE_PAYMENTS.length <= 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-xs font-medium text-[#64748B] text-center">View all invoices</Text>
                        </Pressable>
                    )}
                </View>
            )}
            
            {LOW_STOCK_ALERTS.length === 0 && OVERDUE_PAYMENTS.length === 0 && (
                <View className="bg-white border border-natural-200 rounded-xl p-4 items-center justify-center">
                    <Text className="text-sm font-medium text-natural-600">All caught up! 🎉</Text>
                </View>
            )}
        </View>
    );
}
