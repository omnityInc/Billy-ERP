import React from 'react';
import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { formatCompactINR } from "@/utils/format";
import { CircleAlert } from "lucide-react-native";

export function NeedsAttentionSection() {
    const router = useRouter();
    
    const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: mockApi.getProducts });
    const { data: salesInvoices = [] } = useQuery({ queryKey: ["salesInvoices"], queryFn: mockApi.getSalesInvoices });
    const { data: parties = [] } = useQuery({ queryKey: ["parties"], queryFn: mockApi.getParties });

    // Calculate Low Stock Alerts
    const lowStockAlerts = products
        .filter(p => p.itemType === "PRODUCT" && p.availableQty <= p.lowStock)
        .map(p => ({
            id: p.id,
            name: p.name,
            leftCount: p.availableQty
        }));

    // Calculate Overdue Payments (Invoices past due date and not fully paid)
    const today = new Date().toISOString().substring(0, 10);
    const overdueInvoices = salesInvoices
        .filter(inv => inv.status !== "PAID" && inv.dueDate < today)
        .map(inv => {
            const party = parties.find(p => p.id === inv.partyId);
            return {
                id: inv.id,
                name: party ? party.companyName : "Unknown Party",
                amount: inv.grandTotalPaise
            };
        });

    return (
        <View className="px-4 mb-6 mt-8">
            <Text className="text-h3 text-[#1A1A1A] mb-4">Needs Attention</Text>
            
            {lowStockAlerts.length > 0 && (
                <View className="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-5 mb-4">
                    <View className="flex-row items-center mb-4">
                        <CircleAlert color="#EAB308" size={20} />
                        <Text className="text-body-strong text-black ml-2">Low Stock Alert</Text>
                    </View>
                    {lowStockAlerts.slice(0, 3).map((item, idx) => (
                        <View key={item.id} className={`flex-row justify-between items-center py-3 ${idx !== Math.min(lowStockAlerts.length, 3) - 1 ? 'border-b border-[#FEF08A]' : ''}`}>
                            <Text className="text-label text-[#64748B] flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                            <Text className="text-label text-[#D97706]">{item.leftCount || 0} left</Text>
                        </View>
                    ))}
                    {lowStockAlerts.length > 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/inventory', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-caption text-[#64748B] text-center">+ {lowStockAlerts.length - 3} more items need restocking</Text>
                        </Pressable>
                    )}
                    {lowStockAlerts.length <= 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/inventory', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-caption text-[#64748B] text-center">View all products</Text>
                        </Pressable>
                    )}
                </View>
            )}

            {overdueInvoices.length > 0 && (
                <View className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 mb-4">
                    <View className="flex-row items-center mb-4">
                        <CircleAlert color="#EF4545" size={20} />
                        <Text className="text-body-strong text-black ml-2">Overdue Payments</Text>
                    </View>
                    {overdueInvoices.slice(0, 3).map((inv, idx) => (
                        <View key={inv.id} className={`flex-row justify-between items-center py-3 ${idx !== Math.min(overdueInvoices.length, 3) - 1 ? 'border-b border-[#FECACA]' : ''}`}>
                            <Text className="text-label text-[#64748B] flex-1 mr-2" numberOfLines={1}>{inv.name}</Text>
                            <Text className="text-label text-[#EF4444]">{formatCompactINR(inv.amount || 0)}</Text>
                        </View>
                    ))}
                    {overdueInvoices.length > 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-caption text-[#64748B] text-center">+ {overdueInvoices.length - 3} more overdue invoices</Text>
                        </Pressable>
                    )}
                    {overdueInvoices.length <= 3 && (
                        <Pressable onPress={() => { router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-4 justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="text-caption text-[#64748B] text-center">View all invoices</Text>
                        </Pressable>
                    )}
                </View>
            )}
            
            {lowStockAlerts.length === 0 && overdueInvoices.length === 0 && (
                <View className="bg-white border border-natural-200 rounded-xl p-4 items-center justify-center">
                    <Text className="text-body-strong text-natural-600">All caught up! 🎉</Text>
                </View>
            )}
        </View>
    );
}
