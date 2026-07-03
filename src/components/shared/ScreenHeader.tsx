import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

interface Props {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, onBack }: Props) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View className="flex-row items-center px-6 py-4 bg-white border-b border-natural-100">
      <Pressable onPress={handleBack} className="mr-4 p-2 -ml-2">
        <ArrowLeft color="#1A1A1A" size={24} />
      </Pressable>
      <View>
        <Text className="text-xl font-semibold text-black">{title}</Text>
        <Text className="text-[13px] text-natural-500">{subtitle}</Text>
      </View>
    </View>
  );
}
