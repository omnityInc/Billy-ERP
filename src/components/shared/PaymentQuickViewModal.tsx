import type { Party, Payment } from "@/data/mock";
import { formatINR } from "@/utils/format";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  HandCoins,
  X,
} from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

interface PaymentQuickViewModalProps {
  payment: Payment | null;
  party: Party | null;
  visible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export function PaymentQuickViewModal({
  payment,
  party,
  visible,
  onClose,
  onViewDetails,
}: PaymentQuickViewModalProps) {
  if (!payment) return null;

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
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-white rounded-t-3xl p-6 pb-8">
          {/* HEADER */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row flex-1 pr-4">
              <View className="w-12 h-12 rounded-full bg-[#DCFCE7] items-center justify-center mr-4">
                <HandCoins size={24} color="#166534" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-xl font-sans-bold text-black"
                  numberOfLines={1}
                >
                  Payment Receipt
                </Text>
                <Text className="text-xs font-sans-semibold text-natural-500 mt-0.5">
                  #{payment.receiptNo}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Pressable
                onPress={onClose}
                className="p-1 bg-natural-100 rounded-full"
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* AMOUNT SNAPSHOT */}
          <View className="bg-natural-50 rounded-xl p-5 mb-4 border border-natural-200 items-center">
            <Text className="text-xs font-sans-bold text-natural-500 uppercase tracking-wider mb-2">
              Amount Paid
            </Text>
            <Text className="text-h1 text-[#166534] mb-2">
              {formatINR(payment.amountPaise)}
            </Text>
            <View className="flex-row items-center px-3 py-1 bg-[#DCFCE7] rounded-full">
              <CheckCircle2
                size={12}
                color="#166534"
                className="mr-1 gap-x-4"
              />
              <Text className="text-xs font-sans-bold text-[#166534]">SUCCESS</Text>
            </View>
          </View>

          {/* DETAILS */}
          <View className="flex-row justify-between mb-8 gap-x-4">
            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-2">
                <Building2 size={16} color="#0F172A" />
                <Text className="text-xs font-sans-medium text-natural-500">
                  Party
                </Text>
              </View>
              <Text className="text-sm font-sans-bold text-black" numberOfLines={1}>
                {party?.companyName || "Unknown"}
              </Text>
            </View>

            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-2">
                <CreditCard size={16} color="#0F172A" />
                <Text className="text-xs font-sans-medium text-natural-500">
                  Mode
                </Text>
              </View>
              <Text className="text-sm font-sans-bold text-black">
                {payment.paymentType}
              </Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View className="flex-row gap-x-3">
            <Pressable
              onPress={onViewDetails}
              className="flex-1 bg-black py-3 rounded-xl items-center justify-center shadow-sm flex-row gap-x-2"
            >
              <Text
                className="text-white font-sans-bold text-sm text-center"
                numberOfLines={1}
              >
                Full Receipt
              </Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
