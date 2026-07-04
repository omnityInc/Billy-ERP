import { useState } from "react";
import { formatINR } from "@/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Trash2, Printer, MapPin, Navigation, Truck, FileText, ChevronRight, IndianRupee, Edit3, ShieldAlert } from "lucide-react-native";
import { Platform, Pressable, ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Skeleton } from "@/components/shared/Skeleton";
import { EditLRModal } from "@/components/shared/EditLRModal";

export default function EWayDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const queryClient = useQueryClient();
  const { data: lorryReceipts = [], isLoading, isError } = useQuery({ queryKey: ["lorryReceipts"], queryFn: mockApi.getEwayBills });

  const deleteMutation = useMutation({
    mutationFn: () => mockApi.addPayment({ deleted: true }), // Mocking delete
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lorryReceipts"] });
      router.back();
    }
  });

  const deleteLorryReceipt = (id: string) => deleteMutation.mutate();

  const lr = lorryReceipts.find((l) => l.id === id);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={() => router.back()} className="mr-3 p-2 bg-natural-50 rounded-full">
              <ArrowLeft size={20} color="#0F172A" />
            </Pressable>
            <View className="flex-1 pr-4">
              <Text className="text-h3 text-black">Lorry Receipt</Text>
              <Skeleton height={14} width={80} className="mt-1" />
            </View>
          </View>
          <View className="flex-row items-center gap-x-2">
            <View className="p-2 bg-natural-100 rounded-full w-9 h-9" />
            <View className="p-2 bg-natural-100 rounded-full w-9 h-9" />
          </View>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="rounded-2xl p-6 mb-4 bg-white border border-natural-200 shadow-sm items-center">
            <Skeleton height={24} width={80} borderRadius={12} className="mb-3" />
            <Skeleton height={36} width={120} className="mb-1" />
            <Text className="text-caption text-natural-500 uppercase tracking-wider mt-1">
              Total Freight
            </Text>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Transport Route</Text>
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Origin</Text>
                <Skeleton height={20} width={100} />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-caption text-natural-500 mb-1">Destination</Text>
                <Skeleton height={20} width={100} />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Vehicle No.</Text>
                <Skeleton height={20} width={120} />
              </View>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Lorry Receipt Details</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Transporter</Text>
                <Skeleton height={20} width={120} />
              </View>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Driver Name</Text>
                <Skeleton height={20} width={100} />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-caption text-natural-500 mb-1">Driver Phone</Text>
                <Skeleton height={20} width={120} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-body-strong text-natural-500">Failed to load E-Way bill.</Text>
      </SafeAreaView>
    );
  }
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  if (!lr) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View className="flex-row items-center p-4">
          <Pressable onPress={() => router.back()} className="mr-3 p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} color="#000" />
          </Pressable>
          <Text className="text-h2">Lorry Receipt not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Lorry Receipt",
      "Are you sure you want to delete this LR? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteLorryReceipt(lr.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleAction = () => {
    if (lr.status === "PENDING") {
      Alert.alert("Coming Soon", "E-Way Bill generation will be integrated with the GST portal shortly.");
    } else {
      Alert.alert("Coming Soon", "PDF printing will be integrated shortly.");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-natural-200">
        <View className="flex-row items-center flex-1">
          <Pressable 
            onPress={() => router.back()} 
            className="mr-3 p-2 bg-natural-50 rounded-full active:bg-natural-100 will-change-pressable"
          >
            <ArrowLeft size={20} color="#0F172A" />
          </Pressable>
          <View className="flex-1 pr-4">
            <Text className="text-h3 text-black" numberOfLines={1}>
              Lorry Receipt
            </Text>
            <Text className="text-caption text-natural-500 mt-0.5">
              #{lr.lrNo}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-x-2">
          <Pressable 
            onPress={() => setIsEditModalVisible(true)}
            className="p-2 bg-natural-50 rounded-full active:bg-natural-100 will-change-pressable"
          >
            <Edit3 size={18} color="#0F172A" />
          </Pressable>
          <Pressable 
            onPress={handleDelete}
            className="p-2 bg-[#FEE2E2] rounded-full active:bg-[#FECACA] will-change-pressable"
          >
            <Trash2 size={18} color="#991B1B" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        {/* STATUS CARD */}
        <View className="rounded-2xl p-6 mb-4 bg-white border border-natural-200 shadow-sm items-center">
          <View className={`px-4 py-1.5 rounded-full mb-3 ${
            lr.status === "GENERATED" ? "bg-[#DCFCE7]" : 
            lr.status === "PENDING" ? "bg-[#FEF9C3]" : "bg-[#FEE2E2]"
          }`}>
            <Text className={`text-xs font-sans-bold ${
              lr.status === "GENERATED" ? "text-[#166534]" : 
              lr.status === "PENDING" ? "text-[#CA8A04]" : "text-[#991B1B]"
            }`}>
              {lr.status}
            </Text>
          </View>
          <Text className="text-h1 text-black">
            {formatINR(lr.freightPaise)}
          </Text>
          <Text className="text-caption text-natural-500 uppercase tracking-wider mt-1">
            Total Freight
          </Text>
        </View>

        {/* ROUTE */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">Transport Route</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Origin</Text>
              <View className="flex-row items-center gap-x-2">
                <MapPin size={14} color="#0F172A" />
                <Text className="text-body-strong text-black">{lr.from}</Text>
              </View>
            </View>
            
            <View className="px-4">
              <ArrowLeft size={16} color="#94A3B8" style={{ transform: [{ rotate: "180deg" }] }} />
            </View>

            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">Destination</Text>
              <View className="flex-row items-center gap-x-2">
                <MapPin size={14} color="#0F172A" />
                <Text className="text-body-strong text-black">{lr.to}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between pt-3 border-t border-natural-100">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Total Weight</Text>
              <Text className="text-body-strong text-black">{lr.weight} kg</Text>
            </View>
          </View>
        </View>

        {/* LOGISTICS DETAILS */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">Logistics Details</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Transporter</Text>
              <Text className="text-body-strong text-black">{lr.transporter}</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">Vehicle No</Text>
              <Text className="text-body-strong text-black uppercase">{lr.vehicleNo}</Text>
            </View>
          </View>

          <View className="flex-row justify-between pt-3 border-t border-natural-100">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">Driver Name</Text>
              <Text className="text-body-strong text-black">{lr.driverName}</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">Driver Phone</Text>
              <Text className="text-body-strong text-black">{lr.driverPhone}</Text>
            </View>
          </View>
        </View>

        {/* INVOICE DETAILS */}
        <View className="bg-white rounded-2xl p-5 mb-8 border border-natural-200 shadow-sm">
          <View>
            <Text className="text-caption text-natural-500 mb-2">Linked Invoice</Text>
            <Pressable 
              onPress={() => router.push(`/invoice/${lr.invoiceId}` as any)}
              className="flex-row items-center justify-between bg-natural-50 p-3 rounded-xl border border-natural-200 active:bg-natural-100 will-change-pressable"
            >
              <View className="flex-row items-center gap-x-3">
                <FileText size={18} color="#0F172A" />
                <Text className="text-black">{lr.invoiceId}</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 pt-4 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable 
          onPress={handleAction}
          className={`w-full flex-row items-center justify-center py-4 rounded-xl shadow-sm gap-x-3 ${
            lr.status === "PENDING" ? "bg-[#166534]" : "bg-black"
          }`}
        >
          {lr.status === "PENDING" ? (
            <ShieldAlert size={18} color="#FFFFFF" />
          ) : (
            <Printer size={18} color="#FFFFFF" />
          )}
          <Text className="text-white text-body text-center" numberOfLines={1}>
            {lr.status === "PENDING" ? "Generate E-Way Bill" : "Download / Print LR"}
          </Text>
        </Pressable>
      </View>

      <EditLRModal
        lr={lr}
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </SafeAreaView>
  );
}
