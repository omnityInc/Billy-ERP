import { useRouter } from "expo-router";
import {
  FileText,
  IndianRupee,
  Package,
  Plus,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MENU_ITEMS = [
  {
    id: "invoice",
    label: "Invoice",
    icon: (size: number, color: string) => (
      <FileText size={size} color={color} />
    ),
    color: "#1E40AF",
    bgClass: "bg-[#DBEAFE] border-[#BFDBFE]",
    route: "/(app)/invoice/new",
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: (size: number, color: string) => (
      <ShoppingCart size={size} color={color} />
    ),
    color: "#B45309",
    bgClass: "bg-[#FEF3C7] border-[#FDE68A]",
    route: "/(app)/purchase/new",
  },
  {
    id: "product",
    label: "Product",
    icon: (size: number, color: string) => (
      <Package size={size} color={color} />
    ),
    color: "#6D28D9",
    bgClass: "bg-[#EDE9FE] border-[#DDD6FE]",
    route: "/(app)/inventory/product/new",
  },
  {
    id: "party",
    label: "Customer | Vendor",
    icon: (size: number, color: string) => <Users size={size} color={color} />,
    color: "#0F766E",
    bgClass: "bg-[#CCFBF1] border-[#99F6E4]",
    route: "/(app)/parties/new",
  },
  {
    id: "expense",
    label: "Expense",
    icon: (size: number, color: string) => (
      <Receipt size={size} color={color} />
    ),
    color: "#BE123C",
    bgClass: "bg-[#FFE4E6] border-[#FECDD3]",
    route: "/(app)/expense/new",
  },
  {
    id: "payment",
    label: "Payment",
    icon: (size: number, color: string) => (
      <IndianRupee size={size} color={color} />
    ),
    color: "#166534",
    bgClass: "bg-[#DCFCE7] border-[#BBF7D0]",
    route: "/(app)/payment/new",
  },
];

export function FloatingMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    animation.value = withTiming(nextState ? 1 : 0, {
      duration: 200,
    });
  };

  const mainIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animation.value,
      [0, 1],
      [0, 45],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value * 0.5,
    };
  });

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        className="z-40"
        style={[
          StyleSheet.absoluteFill,
          backdropStyle,
          { backgroundColor: "black", elevation: 40 },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />
      </Animated.View>

      <View
        className="absolute bottom-6 right-4 items-end z-50"
        pointerEvents="box-none"
      >
        <Animated.View
          pointerEvents={isOpen ? "auto" : "none"}
          className="bg-white rounded-2xl shadow-xl w-60 mb-6 border border-natural-100 overflow-hidden"
          style={useAnimatedStyle(() => ({
            opacity: animation.value,
            transform: [
              {
                translateY: interpolate(
                  animation.value,
                  [0, 1],
                  [20, 0],
                  Extrapolation.CLAMP,
                ),
              },
              {
                scale: interpolate(
                  animation.value,
                  [0, 1],
                  [0.95, 1],
                  Extrapolation.CLAMP,
                ),
              },
            ],
          }))}
        >
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <Pressable
                key={item.id}
                className={`flex-row items-center px-4 py-3 ${!isLast ? "border-b border-natural-100" : ""}`}
                onPress={() => {
                  toggleMenu();
                  router.push(item.route as any);
                }}
              >
                <View
                  className={`w-10 h-10 rounded-lg items-center justify-center border ${item.bgClass}`}
                >
                  {item.icon(20, item.color)}
                </View>
                <Text className="ml-3 text-body-strong text-black">
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>

        <Pressable
          onPress={toggleMenu}
          className="w-18 h-18 bg-black rounded-full items-center justify-center shadow-lg"
        >
          <Animated.View style={mainIconStyle}>
            <Plus size={40} color="white" />
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}
