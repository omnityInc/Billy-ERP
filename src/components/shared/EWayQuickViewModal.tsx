import { Modal, Pressable, Text, View } from "react-native";
import { X, Truck, Navigation, FileText, IndianRupee, ArrowRight } from "lucide-react-native";
import { formatINR } from "@/utils/format";
import type { LorryReceipt } from "@/data/mock";

interface EWayQuickViewModalProps {
  lr: LorryReceipt | null;
  visible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export function EWayQuickViewModal({
  lr,
  visible,
  onClose,
  onViewDetails,
}: EWayQuickViewModalProps) {
  if (!lr) return null;

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
              <View className="w-12 h-12 rounded-full bg-natural-100 items-center justify-center mr-4">
                <Truck size={24} color="#0F172A" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-x-3">
                  <Text className="text-xl font-sans-bold text-black shrink" numberOfLines={1}>
                    Lorry Receipt
                  </Text>
                </View>
                <Text className="text-sm text-natural-500 mt-1">
                  #{lr.lrNo}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Pressable onPress={onClose} className="p-1 bg-natural-100 rounded-full">
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* STATUS SNAPSHOT */}
          <View className="bg-natural-50 rounded-xl p-5 mb-4 border border-natural-200 items-center">
            <Text className="text-xs font-sans-bold text-natural-500 uppercase tracking-wider mb-2">
              Status
            </Text>
            <Text 
              className={`text-h2 mb-2 ${
                lr.status === "GENERATED" ? "text-[#166534]" : 
                lr.status === "PENDING" ? "text-[#CA8A04]" : "text-[#991B1B]"
              }`}
            >
              {lr.status}
            </Text>
          </View>

          {/* DETAILS */}
          <View className="flex-row justify-between mb-8 gap-x-4">
            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-3">
                <Navigation size={16} color="#0F172A" />
                <Text className="text-xs font-sans-medium text-natural-500">Route</Text>
              </View>
              <Text className="text-sm font-sans-bold text-black" numberOfLines={1}>
                {lr.from} to {lr.to}
              </Text>
            </View>
            
            <View className="flex-1 bg-white border border-natural-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2 gap-x-3">
                <Truck size={16} color="#0F172A" />
                <Text className="text-xs font-sans-medium text-natural-500">Vehicle</Text>
              </View>
              <Text className="text-sm font-sans-bold text-black">
                {lr.vehicleNo}
              </Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View className="flex-row gap-x-3">
            <Pressable
              onPress={onViewDetails}
              className="flex-1 bg-black py-3 rounded-xl items-center justify-center shadow-sm flex-row gap-x-2"
            >
              <Text className="text-white font-sans-bold text-sm text-center" numberOfLines={1}>
                View Full LR
              </Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
