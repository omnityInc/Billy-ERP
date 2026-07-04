import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, Eye, EyeOff } from "lucide-react-native";
import { images } from "@/constants/images";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login();
    router.replace("/(app)/(dashboard)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-12 pb-6 flex-1">
            {/* Logo and Header */}
            <View className="items-center mb-10">
              <Image
                source={images.iconBlack}
                style={{ width: 64, height: 64, marginBottom: 24 }}
                resizeMode="contain"
              />
              <Text className="text-display text-black mb-2 text-center">
                Welcome to Billy
              </Text>
              <Text className="text-text-caption text-natural-500 text-center">
                The ultimate ERP for modern business.
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-4 mb-8">
              {/* Phone Input */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Phone"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                  />
                )}
              />

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    rightIcon={
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        className="p-2 -mr-2"
                      >
                        {showPassword ? (
                          <EyeOff color="#1A1A1A" size={24} />
                        ) : (
                          <Eye color="#1A1A1A" size={24} />
                        )}
                      </Pressable>
                    }
                  />
                )}
              />
            </View>

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              className="mb-6 relative"
              icon={
                <View className="absolute right-4">
                  <ArrowRight color="#FFFFFF" size={20} />
                </View>
              }
            />

            {/* Forgot Password */}
            <View className="items-center mb-10">
              <Text className="text-text-caption text-natural-400 mb-1">
                Forgot your password?
              </Text>
              <Pressable>
                <Text className="text-label text-black underline">
                  Reset your password
                </Text>
              </Pressable>

              <Text className="text-text-caption text-natural-400 mt-6">
                Don&apos;t have an account?{" "}
                <Text
                  className="text-label text-black underline"
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  Join
                </Text>
              </Text>
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Footer Terms */}
            <View className="items-center mt-4">
              <Text className="text-micro text-natural-500 text-center">
                By logging in you agree to our{" "}
                <Text className="text-black underline">Terms</Text>,{" "}
                <Text className="text-black underline">Privacy Policy</Text>,
                {"\n"}
                and <Text className="text-black underline">Cookies use</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
