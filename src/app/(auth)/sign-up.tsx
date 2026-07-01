import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { GST_STATE_CODES } from "@/constants/gst";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronDown,
  Circle,
  CircleCheck,
  FileText,
  Lock,
  MapPin,
  Store,
  User,
} from "lucide-react-native";
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

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [gstRegistered, setGstRegistered] = useState(true);
  const [gstNumber, setGstNumber] = useState("");
  const [state, setState] = useState("");

  const router = useRouter();

  const handleSignup = () => {
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
          <View className="px-6 pt-10 pb-6 flex-1">
            {/* Logo and Header */}
            <View className="flex-row items-center mb-10">
              <Image
                source={require("../../../assets/images/icon-black.png")}
                style={{ width: 48, height: 48, marginRight: 16 }}
                resizeMode="contain"
              />
              <Text className="h2 text-black flex-1 leading-tight">
                Let's get you started with Billy!
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-4 mb-8">
              {/* Full Name */}
              <Input
                label="Full Name"
                required
                placeholder="Enter your full name"
                leftIcon={<User color="#6B7280" size={20} />}
                value={fullName}
                onChangeText={setFullName}
              />

              {/* Company Name */}
              <Input
                label="Company Name"
                required
                placeholder="Enter your company name"
                leftIcon={<Store color="#6B7280" size={20} />}
                value={companyName}
                onChangeText={setCompanyName}
              />

              {/* Phone */}
              <Input
                label="Phone"
                required
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                leftIcon={<Text className="body text-black ml-1">+91</Text>}
                value={phone}
                onChangeText={setPhone}
              />

              {/* GST Registered? */}
              <View>
                <Text className="body text-black mb-2">GST Registered?</Text>
                <View className="flex-row gap-x-4">
                  <Pressable
                    onPress={() => setGstRegistered(true)}
                    className={`flex-1 h-14 border rounded-xl flex-row items-center px-4 gap-x-2 ${
                      !gstRegistered && "border-natural-100 bg-natural-50"
                    }`}
                    style={
                      gstRegistered
                        ? { backgroundColor: "#DCFCE7", borderColor: "#22C55E" }
                        : {}
                    }
                  >
                    {gstRegistered ? (
                      <CircleCheck color="#22C55E" fill="#DCFCE7" size={20} />
                    ) : (
                      <Circle color="#9CA3AF" size={20} />
                    )}
                    <Text className="body text-black">Yes</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setGstRegistered(false)}
                    className={`flex-1 h-14 border rounded-xl flex-row items-center px-4 gap-x-2 ${
                      gstRegistered && "border-natural-100 bg-natural-50"
                    }`}
                    style={
                      !gstRegistered
                        ? { backgroundColor: "#DCFCE7", borderColor: "#22C55E" }
                        : {}
                    }
                  >
                    {!gstRegistered ? (
                      <CircleCheck color="#22C55E" fill="#DCFCE7" size={20} />
                    ) : (
                      <Circle color="#9CA3AF" size={20} />
                    )}
                    <Text className="body text-black">No</Text>
                  </Pressable>
                </View>
              </View>

              {/* GST Number */}
              {gstRegistered && (
                <Input
                  label="GST Number"
                  required
                  placeholder="Enter your GST number"
                  leftIcon={<FileText color="#6B7280" size={20} />}
                  value={gstNumber}
                  onChangeText={setGstNumber}
                />
              )}

              {/* State */}
              <Dropdown
                label="State"
                required
                placeholder="Select your business state"
                leftIcon={<MapPin color="#6B7280" size={20} />}
                options={GST_STATE_CODES}
                value={state}
                onSelect={setState}
              />
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Submit Button */}
            <Button title="Continue" onPress={handleSignup} className="mb-8" />

            {/* Footer Privacy */}
            <View className="flex-row items-center justify-center gap-x-2">
              <Lock color="#94A3B8" size={14} />
              <Text className="caption text-natural-500">
                We respect your privacy. Your information is safe with us.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
