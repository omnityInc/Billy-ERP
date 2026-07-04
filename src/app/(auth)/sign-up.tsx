import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { GST_STATE_CODES } from "@/constants/gst";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Circle,
  CircleCheck,
  FileText,
  Lock,
  MapPin,
  Store,
  User,
} from "lucide-react-native";
import { images } from "@/constants/images";
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
import { isValidGSTIN } from "@/utils/validators";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    companyName: z.string().min(2, "Company name is required"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    gstRegistered: z.boolean(),
    gstNumber: z.string().optional(),
    state: z.string().min(1, "State is required"),
  })
  .superRefine((data, ctx) => {
    if (data.gstRegistered) {
      if (!data.gstNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST Number is required",
          path: ["gstNumber"],
        });
      } else if (!isValidGSTIN(data.gstNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid GST Number",
          path: ["gstNumber"],
        });
      }
    }
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      phone: "",
      gstRegistered: true,
      gstNumber: "",
      state: "",
    },
  });

  const isGstRegistered = watch("gstRegistered");

  const onSubmit = (data: SignupFormValues) => {
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
          <View className="px-6 pt-10 pb-6 flex-1">
            {/* Logo and Header */}
            <View className="flex-row items-center mb-10">
              <Image
                source={images.iconBlack}
                style={{ width: 48, height: 48, marginRight: 16 }}
                resizeMode="contain"
              />
              <Text className="text-display text-black flex-1">
                Let&apos;s get you started with Billy!
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-4 mb-8">
              {/* Full Name */}
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Full Name"
                    required
                    placeholder="Enter your full name"
                    leftIcon={<User color="#6B7280" size={20} />}
                    value={value}
                    onChangeText={onChange}
                    error={errors.fullName?.message}
                  />
                )}
              />

              {/* Company Name */}
              <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Company Name"
                    required
                    placeholder="Enter your company name"
                    leftIcon={<Store color="#6B7280" size={20} />}
                    value={value}
                    onChangeText={onChange}
                    error={errors.companyName?.message}
                  />
                )}
              />

              {/* Phone */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Phone"
                    required
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    leftIcon={
                      <Text className="text-text-caption text-black ml-1">
                        +91
                      </Text>
                    }
                    value={value}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                  />
                )}
              />

              {/* GST Registered? */}
              <Controller
                control={control}
                name="gstRegistered"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text className="text-text-caption text-black mb-2">
                      GST Registered?
                    </Text>
                    <View className="flex-row gap-x-4">
                      <Pressable
                        onPress={() => {
                          onChange(true);
                        }}
                        className={`flex-1 h-14 border rounded-xl flex-row items-center px-4 gap-x-2 ${
                          !value && "border-natural-100 bg-natural-50"
                        }`}
                        style={
                          value
                            ? {
                                backgroundColor: "#DCFCE7",
                                borderColor: "#22C55E",
                              }
                            : {}
                        }
                      >
                        {value ? (
                          <CircleCheck
                            color="#22C55E"
                            fill="#DCFCE7"
                            size={20}
                          />
                        ) : (
                          <Circle color="#9CA3AF" size={20} />
                        )}
                        <Text className="text-text-caption text-black">
                          Yes
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          onChange(false);
                          setValue("gstNumber", "");
                        }}
                        className={`flex-1 h-14 border rounded-xl flex-row items-center px-4 gap-x-2 ${
                          value && "border-natural-100 bg-natural-50"
                        }`}
                        style={
                          !value
                            ? {
                                backgroundColor: "#DCFCE7",
                                borderColor: "#22C55E",
                              }
                            : {}
                        }
                      >
                        {!value ? (
                          <CircleCheck
                            color="#22C55E"
                            fill="#DCFCE7"
                            size={20}
                          />
                        ) : (
                          <Circle color="#9CA3AF" size={20} />
                        )}
                        <Text className="text-text-caption text-black">
                          No
                        </Text>
                      </Pressable>
                    </View>
                    {errors.gstRegistered && (
                      <Text className="text-red-500 mt-1">
                        {errors.gstRegistered.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* GST Number */}
              {isGstRegistered && (
                <Controller
                  control={control}
                  name="gstNumber"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="GST Number"
                      required
                      placeholder="Enter your GST number"
                      leftIcon={<FileText color="#6B7280" size={20} />}
                      value={value}
                      onChangeText={onChange}
                      error={errors.gstNumber?.message}
                      autoCapitalize="characters"
                    />
                  )}
                />
              )}

              {/* State */}
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="State"
                    required
                    placeholder="Select your business state"
                    leftIcon={<MapPin color="#6B7280" size={20} />}
                    options={GST_STATE_CODES}
                    value={value}
                    onSelect={onChange}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Submit Button */}
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              className="mb-8"
            />

            {/* Footer Privacy */}
            <View className="flex-row items-center justify-center gap-x-2">
              <Lock color="#94A3B8" size={14} />
              <Text className="text-micro text-natural-500">
                We respect your privacy. Your information is safe with us.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
