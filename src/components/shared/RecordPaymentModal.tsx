import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard } from "react-native";
import { X, IndianRupee } from "lucide-react-native";
import { formatINR } from "@/utils/format";
import { useMockStore } from "@/store/mockStore";
import type { PaymentType, Paise } from "@/data/mock";
import { toPaise } from "@/data/mock";

interface RecordPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  invoiceId: string;
  partyId: string;
  partyName: string;
  outstandingAmountPaise: number;
}

const PAYMENT_METHODS: { label: string; value: PaymentType }[] = [
  { label: "UPI", value: "UPI" },
  { label: "Cash", value: "CASH" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Bank Transfer", value: "NEFT" },
];

export function RecordPaymentModal({
  visible,
  onClose,
  invoiceId,
  partyId,
  partyName,
  outstandingAmountPaise,
}: RecordPaymentModalProps) {
  const addPayment = useMockStore((state) => state.addPayment);

  const [amountStr, setAmountStr] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("UPI");
  const [remarks, setRemarks] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setAmountStr((outstandingAmountPaise / 100).toString());
      setPaymentType("UPI");
      setRemarks("");
    }
  }, [visible, outstandingAmountPaise]);

  // Reliable manual keyboard height tracking
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleConfirm = () => {
    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0) {
      // Basic validation: ignore if 0 or invalid
      return;
    }

    addPayment({
      id: Math.random().toString(36).substring(7),
      receiptNo: `RCPT-${Math.floor(Math.random() * 10000)}`,
      invoiceId,
      partyId,
      amountPaise: toPaise(amountNum),
      paymentType,
      paymentDate: new Date().toISOString().substring(0, 10),
      remarks,
    });

    Keyboard.dismiss();
    onClose();
  };

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

        <View className="bg-white rounded-t-3xl p-6 pb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-bold text-black">Record Payment</Text>
              <Text className="text-sm text-natural-500 mt-1">From {partyName}</Text>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* AMOUNT INPUT */}
          <View className="mb-6">
            <View className="flex-row justify-between items-end mb-2">
              <Text className="text-sm font-semibold text-natural-700">Payment Amount</Text>
              <Text className="text-xs text-natural-500">
                Outstanding: <Text className="font-bold text-black">{formatINR(outstandingAmountPaise as Paise)}</Text>
              </Text>
            </View>
            
            <View className="flex-row items-center border border-natural-300 rounded-xl px-4 py-3 bg-natural-50 focus:border-black">
              <IndianRupee size={20} color="#0F172A" />
              <TextInput
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="numeric"
                className="flex-1 ml-2 text-2xl font-bold text-black"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* PAYMENT METHOD */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-natural-700 mb-3">Payment Method</Text>
            <View className="flex-row flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isActive = paymentType === method.value;
                return (
                  <Pressable
                    key={method.value}
                    onPress={() => setPaymentType(method.value)}
                    className={`px-4 py-2 rounded-full border ${
                      isActive 
                        ? "bg-black border-black" 
                        : "bg-white border-natural-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isActive ? "text-white" : "text-natural-600"
                      }`}
                    >
                      {method.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* REMARKS */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-natural-700 mb-2">Remarks (Optional)</Text>
            <TextInput
              value={remarks}
              onChangeText={setRemarks}
              placeholder="e.g. Transaction ID, UTR, Cheque No."
              className="border border-natural-300 rounded-xl px-4 py-3 text-sm text-black bg-white"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* ACTIONS */}
          <Pressable
            onPress={handleConfirm}
            className="w-full bg-black py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-bold text-base">Confirm Payment</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
