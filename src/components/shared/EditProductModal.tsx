import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockApi } from "@/data/mockApi";
import type { Product, Paise } from "@/data/mock";
import { toPaise } from "@/data/mock";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sellPriceStr: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Invalid price"),
  purchasePriceStr: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Invalid price"),
  lowStockStr: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, "Invalid quantity"),
  hsnSac: z.string().optional(),
  group: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

export function EditProductModal({
  product,
  visible,
  onClose,
}: EditProductModalProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: any) => mockApi.updateProduct(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    }
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sellPriceStr: "",
      purchasePriceStr: "",
      lowStockStr: "",
      hsnSac: "",
      group: "",
    }
  });

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible && product) {
      reset({
        name: product.name,
        sellPriceStr: (product.sellPricePaise / 100).toString(),
        purchasePriceStr: (product.purchasePricePaise / 100).toString(),
        lowStockStr: product.lowStock.toString(),
        hsnSac: product.hsnSac || "",
        group: product.group || "",
      });
    }
  }, [visible, product, reset]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSubmit = (data: ProductFormValues) => {
    if (!product) return;

    updateMutation.mutate({
      id: product.id,
      payload: {
        name: data.name,
        sellPricePaise: toPaise(parseFloat(data.sellPriceStr) || 0),
        purchasePricePaise: toPaise(parseFloat(data.purchasePriceStr) || 0),
        lowStock: parseInt(data.lowStockStr, 10) || 0,
        hsnSac: data.hsnSac || "",
        group: data.group || "",
      }
    });

    Keyboard.dismiss();
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-end"
        style={{ 
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingBottom: keyboardHeight 
        }}
      >
        <Pressable className="flex-1" onPress={() => { Keyboard.dismiss(); onClose(); }} />

        <View className="bg-white rounded-t-3xl max-h-[85%]">
          <View className="flex-row justify-between items-center p-6 border-b border-natural-100">
            <Text className="text-xl font-sans-bold text-black">Edit Product</Text>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView className="p-6" keyboardShouldPersistTaps="handled">
            {/* NAME */}
            <View className="mb-5">
              <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Product Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.name ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                    placeholder="Product Name"
                  />
                )}
              />
              {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
            </View>

            {/* PRICING */}
            <View className="flex-row gap-x-4 mb-5">
              <View className="flex-1">
                <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Sell Price (₹)</Text>
                <Controller
                  control={control}
                  name="sellPriceStr"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.sellPriceStr ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      placeholder="0.00"
                    />
                  )}
                />
                {errors.sellPriceStr && <Text className="text-red-500 text-xs mt-1">{errors.sellPriceStr.message}</Text>}
              </View>
              <View className="flex-1">
                <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Purchase Price (₹)</Text>
                <Controller
                  control={control}
                  name="purchasePriceStr"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.purchasePriceStr ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      placeholder="0.00"
                    />
                  )}
                />
                {errors.purchasePriceStr && <Text className="text-red-500 text-xs mt-1">{errors.purchasePriceStr.message}</Text>}
              </View>
            </View>

            {/* CLASSIFICATION & STOCK */}
            <View className="flex-row gap-x-4 mb-5">
              <View className="flex-1">
                <Text className="text-xs font-sans-semibold text-natural-700 mb-2">HSN/SAC Code</Text>
                <Controller
                  control={control}
                  name="hsnSac"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.hsnSac ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      placeholder="HSN/SAC"
                    />
                  )}
                />
                {errors.hsnSac && <Text className="text-red-500 text-xs mt-1">{errors.hsnSac.message}</Text>}
              </View>
              <View className="flex-1">
                <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Product Group</Text>
                <Controller
                  control={control}
                  name="group"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.group ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      placeholder="Group"
                    />
                  )}
                />
                {errors.group && <Text className="text-red-500 text-xs mt-1">{errors.group.message}</Text>}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Low Stock Alert Quantity</Text>
              <Controller
                control={control}
                name="lowStockStr"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.lowStockStr ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                    placeholder="0"
                  />
                )}
              />
              {errors.lowStockStr && <Text className="text-red-500 text-xs mt-1">{errors.lowStockStr.message}</Text>}
            </View>

            {/* ACTIONS */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="w-full bg-black py-4 rounded-xl items-center shadow-sm mb-6"
            >
              <Text className="text-white font-sans-bold text-base">Save Changes</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
