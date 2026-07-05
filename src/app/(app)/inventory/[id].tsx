import { AdjustStockModal } from "@/components/shared/AdjustStockModal";
import { EditProductModal } from "@/components/shared/EditProductModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Skeleton } from "@/components/shared/Skeleton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Trash2,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductStockCard } from "@/components/inventory/ProductStockCard";
import { ProductPricingCard } from "@/components/inventory/ProductPricingCard";
import { ProductInfoCard } from "@/components/inventory/ProductInfoCard";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: product, isLoading, isError } = useQuery({ 
    queryKey: ["product", id], 
    queryFn: () => mockApi.getProductById(id as string) 
  });

  const deleteMutation = useMutation({
    mutationFn: () => mockApi.deleteProduct(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.back();
    }
  });

  const deleteProduct = (id: string) => deleteMutation.mutate();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAdjustModalVisible, setIsAdjustModalVisible] = useState(false);

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
              <Skeleton height={24} width={120} className="mb-1" />
              <View className="flex-row items-center mt-1">
                <Skeleton height={14} width={50} className="mr-2" />
                <Text className="text-caption text-natural-500">Product Details</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-x-2">
            <View className="p-2 bg-natural-100 rounded-full w-9 h-9" />
            <View className="p-2 bg-natural-100 rounded-full w-9 h-9" />
          </View>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="rounded-2xl p-6 mb-4 bg-white border border-natural-200 shadow-sm flex-row items-center">
            <View className="mr-4 w-8 h-8 rounded-full bg-natural-100" />
            <View className="flex-1">
              <Text className="text-sm font-sans-bold text-natural-500 mb-1 tracking-wider">
                AVAILABLE QUANTITY
              </Text>
              <Skeleton height={36} width={80} />
            </View>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Pricing & Taxes</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2 bg-natural-50 p-3 rounded-xl">
                <Text className="text-caption text-natural-600 mb-2">Sell Price</Text>
                <Skeleton height={24} width={80} />
              </View>
              <View className="flex-1 ml-2 bg-natural-50 p-3 rounded-xl">
                <Text className="text-caption text-natural-600 mb-2">Purchase Price</Text>
                <Skeleton height={24} width={80} />
              </View>
            </View>
            <View className="flex-row justify-between pt-2">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">GST Rate</Text>
                <Skeleton height={20} width={60} />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-caption text-natural-500 mb-1">HSN/SAC Code</Text>
                <Skeleton height={20} width={80} />
              </View>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-5 mb-8 border border-natural-200 shadow-sm">
            <View className="mb-4">
              <Text className="text-caption text-natural-500 tracking-wider uppercase">Product Information</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-caption text-natural-500 mb-1">Barcode / SKU</Text>
                <Skeleton height={20} width={100} />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-caption text-natural-500 mb-1">Category Group</Text>
                <Skeleton height={20} width={100} />
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
        <Text className="text-body-strong text-natural-500">Failed to load product.</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    if (!product) return;
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(product.id);
            router.back();
          },
        },
      ],
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View className="flex-row items-center p-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 p-2 bg-white rounded-full shadow-sm"
          >
            <ArrowLeft size={20} color="#000" />
          </Pressable>
          <Text className="text-h2">Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOutOfStock = product.availableQty === 0;
  const isLowStock =
    product.availableQty > 0 && product.availableQty <= product.lowStock;

  const getStatusConfig = () => {
    if (isOutOfStock)
      return {
        bg: "bg-danger-100",
        text: "text-danger-800",
        label: "OUT OF STOCK",
        icon: <XCircle size={24} color="#991B1B" />,
      };
    if (isLowStock)
      return {
        bg: "bg-warning-100",
        text: "text-warning-800",
        label: "LOW STOCK",
        icon: <AlertTriangle size={24} color="#92400E" />,
      };
    return {
      bg: "bg-success-100",
      text: "text-success-800",
      label: "IN STOCK",
      icon: <CheckCircle2 size={24} color="#166534" />,
    };
  };

  const status = getStatusConfig();

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
              {product.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className={`px-2 py-0.5 rounded ${status.bg} mr-2`}>
                <Text
                  className={`text-[10px] font-sans-bold tracking-wider ${status.text}`}
                >
                  {status.label}
                </Text>
              </View>
              <Text className="text-caption text-natural-500">Product Details</Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-x-2">
          <Pressable
            onPress={() => setIsEditModalVisible(true)}
            className="p-2 bg-natural-50 rounded-full active:bg-natural-100 will-change-pressable"
          >
            <Edit2 size={18} color="#0F172A" />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            className="p-2 bg-danger-100 rounded-full active:bg-danger-200 will-change-pressable"
          >
            <Trash2 size={18} color="#991B1B" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <ProductStockCard product={product} status={status} />
        <ProductPricingCard product={product} />
        <ProductInfoCard product={product} />
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 pt-4 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable
          onPress={() => setIsAdjustModalVisible(true)}
          className="w-full items-center justify-center py-4 bg-black rounded-xl shadow-sm"
        >
          <Text className="text-white text-body font-sans-semibold text-center" numberOfLines={1}>
            Adjust Stock
          </Text>
        </Pressable>
      </View>

      <EditProductModal
        product={product}
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />

      <AdjustStockModal
        product={product}
        visible={isAdjustModalVisible}
        onClose={() => setIsAdjustModalVisible(false)}
      />
    </SafeAreaView>
  );
}
