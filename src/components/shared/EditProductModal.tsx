import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { useMockStore } from "@/store/mockStore";
import type { Product, Paise } from "@/data/mock";
import { toPaise } from "@/data/mock";

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
  const updateProduct = useMockStore((state) => state.updateProduct);

  const [name, setName] = useState("");
  const [sellPriceStr, setSellPriceStr] = useState("");
  const [purchasePriceStr, setPurchasePriceStr] = useState("");
  const [lowStockStr, setLowStockStr] = useState("");
  const [hsnSac, setHsnSac] = useState("");
  const [group, setGroup] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible && product) {
      setName(product.name);
      setSellPriceStr((product.sellPricePaise / 100).toString());
      setPurchasePriceStr((product.purchasePricePaise / 100).toString());
      setLowStockStr(product.lowStock.toString());
      setHsnSac(product.hsnSac);
      setGroup(product.group);
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

  const handleSave = () => {
    if (!product) return;

    updateProduct(product.id, {
      name,
      sellPricePaise: toPaise(parseFloat(sellPriceStr) || 0),
      purchasePricePaise: toPaise(parseFloat(purchasePriceStr) || 0),
      lowStock: parseInt(lowStockStr, 10) || 0,
      hsnSac,
      group,
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
            <Text className="text-xl font-bold text-black">Edit Product</Text>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView className="p-6" keyboardShouldPersistTaps="handled">
            {/* NAME */}
            <View className="mb-5">
              <Text className="text-xs font-semibold text-natural-700 mb-2">Product Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                placeholder="Product Name"
              />
            </View>

            {/* PRICING */}
            <View className="flex-row gap-x-4 mb-5">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-natural-700 mb-2">Sell Price (₹)</Text>
                <TextInput
                  value={sellPriceStr}
                  onChangeText={setSellPriceStr}
                  keyboardType="numeric"
                  className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                  placeholder="0.00"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-natural-700 mb-2">Purchase Price (₹)</Text>
                <TextInput
                  value={purchasePriceStr}
                  onChangeText={setPurchasePriceStr}
                  keyboardType="numeric"
                  className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                  placeholder="0.00"
                />
              </View>
            </View>

            {/* CLASSIFICATION & STOCK */}
            <View className="flex-row gap-x-4 mb-5">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-natural-700 mb-2">HSN/SAC Code</Text>
                <TextInput
                  value={hsnSac}
                  onChangeText={setHsnSac}
                  className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                  placeholder="HSN/SAC"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-natural-700 mb-2">Product Group</Text>
                <TextInput
                  value={group}
                  onChangeText={setGroup}
                  className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                  placeholder="Group"
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-xs font-semibold text-natural-700 mb-2">Low Stock Alert Quantity</Text>
              <TextInput
                value={lowStockStr}
                onChangeText={setLowStockStr}
                keyboardType="numeric"
                className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white focus:border-black"
                placeholder="0"
              />
            </View>

            {/* ACTIONS */}
            <Pressable
              onPress={handleSave}
              className="w-full bg-black py-4 rounded-xl items-center shadow-sm mb-6"
            >
              <Text className="text-white font-bold text-base">Save Changes</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
