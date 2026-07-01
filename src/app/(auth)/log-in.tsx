import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, Eye, EyeOff } from "lucide-react-native";
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

export default function LogIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to app for now
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
                source={require("../../../assets/images/icon-black.png")}
                style={{ width: 64, height: 64, marginBottom: 24 }}
                resizeMode="contain"
              />
              <Text className="text-[28px] font-bold leading-9 text-black mb-2 text-center">
                Welcome to Billy
              </Text>
              <Text className="text-sm text-natural-500 text-center">
                The ultimate ERP for modern business.
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-4 mb-8">
              {/* Phone Input */}
              <Input
                label="Phone"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {/* Password Input */}
              <Input
                label="Password"
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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
            </View>

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleLogin}
              className="mb-6 relative"
              icon={
                <View className="absolute right-4">
                  <ArrowRight color="#FFFFFF" size={20} />
                </View>
              }
            />

            {/* Forgot Password */}
            <View className="items-center mb-10">
              <Text className="text-[13px] leading-5 text-natural-400 mb-1">
                Forgot your password?
              </Text>
              <Pressable>
                <Text className="text-[13px] leading-5 text-black underline font-medium">
                  Reset your password
                </Text>
              </Pressable>

              <Text className="text-[13px] leading-5 text-natural-400 mt-6">
                Don't have an account?{" "}
                <Text
                  className="text-black underline font-medium"
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
              <Text className="text-[10px] leading-[14px] text-natural-500 text-center">
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
