import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/shared/Button";

const SLIDES = [
  {
    title: "Smart Run Your Entire\nBusiness From\nYour Phone!",
    subtitle:
      "Create invoices, adjust stock, record\npurchases, and share documents in just few taps.",
  },
  {
    title: "Build for real\nBusiness\nWork!",
    subtitle:
      "See pending collections, low stock alters,\nGST estimates, and business insights\ninstantly from you dashboard",
  },
  {
    title: "Focus on\nBusiness,\nnot software!",
    subtitle:
      "Billy turn complex operations into simple\nactions, so you can spend less time\nmanaging and more time growing",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    } else {
      router.replace("/(auth)/log-in");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/log-in");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <View className="pt-4 pb-8 flex-1">
        {/* Header with Skip button */}
        <View className="px-6 h-10 flex-row justify-end items-center">
          {!isLastSlide && (
            <Pressable onPress={handleSkip} className="p-2">
              <Text className="body-medium text-natural-800">Skip</Text>
            </Pressable>
          )}
        </View>

        {/* Swipeable Content */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 px-6">
              {/* Empty space for visuals later */}
              <View className="flex-1" />

              {/* Text Area */}
              <View className="items-center">
                <Text className="title-huge text-center text-black mb-4">
                  {item.title}
                </Text>
                <Text className="body-medium-regular text-center text-natural-500 mb-8">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          )}
        />

        {/* Bottom Area (Dots and Button) */}
        <View className="px-6 mt-4">
          {/* Pagination Dots */}
          <View className="flex-row items-center justify-center gap-2 mb-8">
            {SLIDES.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  currentSlide === index ? "w-6 bg-black" : "w-2 bg-natural-400"
                }`}
              />
            ))}
          </View>

          {/* Button */}
          <Button
            title={isLastSlide ? 'Continue' : 'Next'}
            onPress={handleNext}
            icon={isLastSlide ? <View className="ml-2"><ArrowRight color="#FFFFFF" size={20} /></View> : undefined}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
