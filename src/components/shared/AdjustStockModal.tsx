import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard, ScrollView } from "react-native";
import { X, Hash, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockApi } from "@/data/mockApi";
import type { Product } from "@/data/mock";

const stockSchema = z.object({
  mode: z.enum(["ADD", "REDUCE"]),
  qtyStr: z.string().refine((val) => {
    const qty = parseInt(val, 10);
    return !isNaN(qty) && qty > 0;
  }, "Quantity must be greater than 0"),
  remarks: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface AdjustStockModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

export function AdjustStockModal({
  product,
  visible,
  onClose,
}: AdjustStockModalProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: any) => mockApi.adjustStock(data.id, data.qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    }
  });

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      mode: "ADD",
      qtyStr: "",
      remarks: "",
    }
  });

  const currentMode = watch("mode");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible && product) {
      reset({
        mode: "ADD",
        qtyStr: "",
        remarks: "",
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

  const onSubmit = (data: StockFormValues) => {
    if (!product) return;

    const qty = parseInt(data.qtyStr, 10);
    const newQty = data.mode === "ADD" ? product.availableQty + qty : Math.max(0, product.availableQty - qty);

    updateMutation.mutate({ id: product.id, qty: newQty });

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
            <View>
              <Text className="text-xl font-sans-bold text-black">Adjust Stock</Text>
              <Text className="text-sm text-natural-500 mt-0.5">{product.name}</Text>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView className="p-6" keyboardShouldPersistTaps="handled">
            {/* CURRENT STOCK */}
            <View className="bg-natural-50 rounded-xl p-4 mb-6 border border-natural-200 flex-row items-center justify-between">
              <Text className="text-sm font-sans-semibold text-natural-700">Current Stock</Text>
              <Text className="text-xl font-sans-bold text-black">
                {product.availableQty} <Text className="text-sm font-sans-medium text-natural-500">{product.uom}</Text>
              </Text>
            </View>

            {/* ADJUSTMENT MODE */}
            <View className="mb-6">
              <Controller
                control={control}
                name="mode"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-x-3">
                    <Pressable
                      onPress={() => onChange("ADD")}
                      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                        value === "ADD" ? "bg-[#DCFCE7] border-[#86EFAC]" : "bg-white border-natural-200"
                      }`}
                    >
                      <ArrowUpRight size={18} color={value === "ADD" ? "#166534" : "#64748B"} className="mr-2" />
                      <Text className={`font-sans-semibold ${value === "ADD" ? "text-[#166534]" : "text-natural-600"}`}>Add Stock</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => onChange("REDUCE")}
                      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                        value === "REDUCE" ? "bg-[#FEE2E2] border-[#FCA5A5]" : "bg-white border-natural-200"
                      }`}
                    >
                      <ArrowDownRight size={18} color={value === "REDUCE" ? "#991B1B" : "#64748B"} className="mr-2" />
                      <Text className={`font-sans-semibold ${value === "REDUCE" ? "text-[#991B1B]" : "text-natural-600"}`}>Reduce Stock</Text>
                    </Pressable>
                  </View>
                )}
              />
            </View>

            {/* QUANTITY INPUT */}
            <View className="mb-6">
              <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Adjustment Quantity</Text>
              <Controller
                control={control}
                name="qtyStr"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className={`flex-row items-center border rounded-xl px-4 py-3 bg-white ${errors.qtyStr ? "border-red-500" : "border-natural-300 focus:border-black"}`}>
                    <Hash size={18} color="#0F172A" />
                    <TextInput
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className="flex-1 ml-2 text-xl font-sans-bold text-black"
                      placeholder="0"
                    />
                    <Text className="font-sans-semibold text-natural-500 ml-2">{product.uom}</Text>
                  </View>
                )}
              />
              {errors.qtyStr && <Text className="text-red-500 text-xs mt-1">{errors.qtyStr.message}</Text>}
            </View>

            {/* REMARKS */}
            <View className="mb-8">
              <Text className="text-xs font-sans-semibold text-natural-700 mb-2">Reason (Optional)</Text>
              <Controller
                control={control}
                name="remarks"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.remarks ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                    placeholder="e.g. New shipment, Damaged, Count correction"
                  />
                )}
              />
              {errors.remarks && <Text className="text-red-500 text-xs mt-1">{errors.remarks.message}</Text>}
            </View>

            {/* ACTIONS */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className={`w-full py-4 rounded-xl items-center shadow-sm mb-6 ${
                currentMode === "ADD" ? "bg-black" : "bg-[#991B1B]"
              }`}
            >
              <Text className="text-white font-sans-bold text-base">
                Confirm {currentMode === "ADD" ? "Addition" : "Reduction"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
