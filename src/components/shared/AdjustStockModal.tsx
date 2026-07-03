import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard, ScrollView } from "react-native";
import { X, Hash, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { useMockStore } from "@/store/mockStore";
import type { Product } from "@/data/mock";

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
  const updateProduct = useMockStore((state) => state.updateProduct);

  const [mode, setMode] = useState<"ADD" | "REDUCE">("ADD");
  const [qtyStr, setQtyStr] = useState("");
  const [remarks, setRemarks] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible && product) {
      setMode("ADD");
      setQtyStr("");
      setRemarks("");
    }
  }, [visible, product]);

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

  const handleConfirm = () => {
    if (!product) return;

    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) {
      return; // Basic validation
    }

    const newQty = mode === "ADD" ? product.availableQty + qty : Math.max(0, product.availableQty - qty);

    updateProduct(product.id, {
      availableQty: newQty,
    });

    Keyboard.dismiss();
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
              <Text className="text-xl font-bold text-black">Adjust Stock</Text>
              <Text className="text-sm text-natural-500 mt-0.5">{product.name}</Text>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView className="p-6" keyboardShouldPersistTaps="handled">
            {/* CURRENT STOCK */}
            <View className="bg-natural-50 rounded-xl p-4 mb-6 border border-natural-200 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-natural-700">Current Stock</Text>
              <Text className="text-xl font-bold text-black">
                {product.availableQty} <Text className="text-sm font-medium text-natural-500">{product.uom}</Text>
              </Text>
            </View>

            {/* ADJUSTMENT MODE */}
            <View className="flex-row gap-x-3 mb-6">
              <Pressable
                onPress={() => setMode("ADD")}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                  mode === "ADD" ? "bg-[#DCFCE7] border-[#86EFAC]" : "bg-white border-natural-200"
                }`}
              >
                <ArrowUpRight size={18} color={mode === "ADD" ? "#166534" : "#64748B"} className="mr-2" />
                <Text className={`font-semibold ${mode === "ADD" ? "text-[#166534]" : "text-natural-600"}`}>Add Stock</Text>
              </Pressable>

              <Pressable
                onPress={() => setMode("REDUCE")}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                  mode === "REDUCE" ? "bg-[#FEE2E2] border-[#FCA5A5]" : "bg-white border-natural-200"
                }`}
              >
                <ArrowDownRight size={18} color={mode === "REDUCE" ? "#991B1B" : "#64748B"} className="mr-2" />
                <Text className={`font-semibold ${mode === "REDUCE" ? "text-[#991B1B]" : "text-natural-600"}`}>Reduce Stock</Text>
              </Pressable>
            </View>

            {/* QUANTITY INPUT */}
            <View className="mb-6">
              <Text className="text-xs font-semibold text-natural-700 mb-2">Adjustment Quantity</Text>
              <View className="flex-row items-center border border-natural-300 rounded-xl px-4 py-3 bg-white focus:border-black">
                <Hash size={18} color="#0F172A" />
                <TextInput
                  value={qtyStr}
                  onChangeText={setQtyStr}
                  keyboardType="numeric"
                  className="flex-1 ml-2 text-xl font-bold text-black"
                  placeholder="0"
                />
                <Text className="font-semibold text-natural-500 ml-2">{product.uom}</Text>
              </View>
            </View>

            {/* REMARKS */}
            <View className="mb-8">
              <Text className="text-xs font-semibold text-natural-700 mb-2">Reason (Optional)</Text>
              <TextInput
                value={remarks}
                onChangeText={setRemarks}
                className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                placeholder="e.g. New shipment, Damaged, Count correction"
              />
            </View>

            {/* ACTIONS */}
            <Pressable
              onPress={handleConfirm}
              className={`w-full py-4 rounded-xl items-center shadow-sm mb-6 ${
                mode === "ADD" ? "bg-black" : "bg-[#991B1B]"
              }`}
            >
              <Text className="text-white font-bold text-base">
                Confirm {mode === "ADD" ? "Addition" : "Reduction"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
