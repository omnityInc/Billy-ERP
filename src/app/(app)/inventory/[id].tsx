import { AdjustStockModal } from "@/components/shared/AdjustStockModal";
import { EditProductModal } from "@/components/shared/EditProductModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { Skeleton } from "@/components/shared/Skeleton";
import { formatINR } from "@/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  CheckCircle2,
  Edit2,
  IndianRupee,
  Percent,
  Trash2,
  TrendingDown,
  TrendingUp,
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

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: product, isLoading, isError } = useQuery({ 
    queryKey: ["product", id], 
    queryFn: () => mockApi.getProductById(id as string) 
  });

  const deleteMutation = useMutation({
    mutationFn: () => mockApi.updateProduct(id as string, { deleted: true }), // Mocking delete as update
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
  const inStock = product.availableQty > product.lowStock;

  const getStatusConfig = () => {
    if (isOutOfStock)
      return {
        bg: "bg-[#FEE2E2]",
        text: "text-[#991B1B]",
        label: "OUT OF STOCK",
        icon: <XCircle size={24} color="#991B1B" />,
      };
    if (isLowStock)
      return {
        bg: "bg-[#FEF3C7]",
        text: "text-[#92400E]",
        label: "LOW STOCK",
        icon: <AlertTriangle size={24} color="#92400E" />,
      };
    return {
      bg: "bg-[#DCFCE7]",
      text: "text-[#166534]",
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
            className="p-2 bg-[#FEE2E2] rounded-full active:bg-[#FECACA] will-change-pressable"
          >
            <Trash2 size={18} color="#991B1B" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* STOCK QTY CARD */}
        <View
          className={`rounded-2xl p-6 mb-4 ${status.bg} border-0 shadow-sm flex-row items-center`}
        >
          <View className="mr-4">{status.icon}</View>
          <View className="flex-1">
            <Text
              className={`text-sm font-sans-bold ${status.text} mb-1 tracking-wider`}
            >
              AVAILABLE QUANTITY
            </Text>
            <Text className={`text-h1 ${status.text}`}>
              {product.availableQty}{" "}
              <Text className="text-body">{product.uom}</Text>
            </Text>
          </View>
        </View>

        {/* PRICING & TAXES CARD */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">
              Pricing & Taxes
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2 bg-natural-50 p-3 rounded-xl">
              <View className="flex-row items-center mb-1">
                <TrendingUp size={14} color="#166534" className="mr-1.5" />
                <Text className="text-caption text-natural-600">
                  Sell Price
                </Text>
              </View>
              <Text className="text-h3 text-black">
                {formatINR(product.sellPricePaise)}
              </Text>
              {product.saleDiscount > 0 && (
                <Text className="text-[10px] text-natural-500 mt-1">
                  {product.saleDiscount}% off applied
                </Text>
              )}
            </View>
            <View className="flex-1 ml-2 bg-natural-50 p-3 rounded-xl">
              <View className="flex-row items-center mb-1">
                <TrendingDown size={14} color="#991B1B" className="mr-1.5" />
                <Text className="text-caption text-natural-600">
                  Purchase Price
                </Text>
              </View>
              <Text className="text-h3 text-black">
                {formatINR(product.purchasePricePaise)}
              </Text>
              {product.purchaseDiscount > 0 && (
                <Text className="text-[10px] text-natural-500 mt-1">
                  {product.purchaseDiscount}% off applied
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row justify-between pt-2">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">
                GST Rate
              </Text>
              <View className="flex-row items-center">
                <Percent size={14} color="#0F172A" className="mr-1" />
                <Text className="text-body-strong text-black">
                  {product.tax}%
                </Text>
              </View>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">
                HSN/SAC Code
              </Text>
              <Text className="text-body-strong text-black">
                {product.hsnSac}
              </Text>
            </View>
          </View>
        </View>

        {/* CLASSIFICATION CARD */}
        <View className="bg-white rounded-2xl p-5 mb-8 border border-natural-200 shadow-sm">
          <View className="mb-4">
            <Text className="text-caption text-natural-500 tracking-wider uppercase">
              Product Information
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">
                Barcode / SKU
              </Text>
              <Text className="text-body-strong text-black">
                {product.barcode}
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">
                Category Group
              </Text>
              <Text className="text-body-strong text-black">
                {product.group}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-caption text-natural-500 mb-1">
                Inventory Flow
              </Text>
              <Text className="text-body-strong text-black">
                {product.inventoryType}
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-caption text-natural-500 mb-1">
                Low Stock Alert
              </Text>
              <Text className="text-body-strong text-black">
                {product.lowStock} {product.uom}
              </Text>
            </View>
          </View>
        </View>
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
          <Text className="text-white text-body text-center" numberOfLines={1}>
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
