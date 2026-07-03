import { ArrowRight, Edit2, Phone, Trash2, X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

export interface QuickViewModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  statusText?: string;
  statusVariant?:
    | "PENDING"
    | "PAID"
    | "OVER DUE"
    | "ACTIVE"
    | "INACTIVE"
    | "PARTIAL"
    | "UNPAID";
  items?: { name: string; qty: string | number; price?: string }[];
  onEdit?: () => void;
  onDelete?: () => void;
  onCall?: () => void;
  onViewDetails?: () => void;
}

export function QuickViewModal({
  visible,
  onClose,
  title,
  subtitle,
  statusText,
  statusVariant,
  items,
  onEdit,
  onDelete,
  onCall,
  onViewDetails,
}: QuickViewModalProps) {
  const getStatusStyle = () => {
    switch (statusVariant) {
      case "PAID":
      case "ACTIVE":
        return { bg: "bg-[#DCFCE7]", text: "text-[#166534]" };
      case "OVER DUE":
      case "INACTIVE":
      case "UNPAID":
        return { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" };
      case "PARTIAL":
        return { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" };
      case "PENDING":
      default:
        return { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" };
    }
  };

  const style = getStatusStyle();

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
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center gap-x-3">
                <Text className="text-xl font-bold text-black shrink">
                  {title}
                </Text>
                {statusText && (
                  <View className={`px-2 py-1 rounded ${style.bg}`}>
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}
                    >
                      {statusText}
                    </Text>
                  </View>
                )}
              </View>
              {subtitle && (
                <Text className="text-sm text-natural-500 mt-1">
                  {subtitle}
                </Text>
              )}
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

          {items && items.length > 0 && (
            <Pressable 
              onPress={onViewDetails}
              className="bg-natural-100 rounded-xl p-4 mb-6 border border-natural-100 active:opacity-70"
            >
              <Text className="text-xs font-semibold text-natural-500 uppercase tracking-wider mb-3">
                Items Summary
              </Text>
              <View className="gap-y-3">
                {items.slice(0, 3).map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row justify-between items-center"
                  >
                    <View className="flex-1 mr-4">
                      <Text
                        className="text-sm font-medium text-black"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-natural-500 mt-0.5">
                        Qty: {item.qty}
                      </Text>
                    </View>
                    {item.price && (
                      <Text className="text-sm font-semibold text-black">
                        {item.price}
                      </Text>
                    )}
                  </View>
                ))}
                {items.length > 3 && (
                  <Text className="text-xs text-natural-500 text-center mt-2 italic">
                    + {items.length - 3} more items
                  </Text>
                )}
              </View>
            </Pressable>
          )}

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <Pressable
              onPress={onCall}
              className="w-[48%] flex-row items-center justify-center py-3 bg-[#DCFCE7] rounded-xl border border-[#86EFAC]"
            >
              <Phone size={18} color="#166534" />
              <Text className="ml-2 font-semibold text-[#166534]">
                Call Party
              </Text>
            </Pressable>

            <Pressable
              onPress={onEdit}
              className="w-[48%] flex-row items-center justify-center py-3 bg-[#DBEAFE] rounded-xl border border-[#93C5FD]"
            >
              <Edit2 size={18} color="#1E40AF" />
              <Text className="ml-2 font-semibold text-[#1E40AF]">Edit</Text>
            </Pressable>

            <Pressable
              onPress={onDelete}
              className="w-[48%] flex-row items-center justify-center py-3 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5]"
            >
              <Trash2 size={18} color="#EF4444" />
              <Text className="ml-2 font-semibold text-[#EF4444]">Delete</Text>
            </Pressable>

            <Pressable
              onPress={onViewDetails}
              className="w-[48%] flex-row items-center justify-center py-3 bg-black rounded-xl"
            >
              <Text className="mr-2 font-semibold text-white">
                Full Details
              </Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
