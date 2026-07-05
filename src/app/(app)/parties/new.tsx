import { Dropdown } from "@/components/shared/Dropdown";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { GST_STATE_CODES } from "@/constants/gst";
import { StatusBar } from "expo-status-bar";
import { Maximize2, Minimize2 } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import { mockApi } from "@/data/mockApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GSTINSchema, PANSchema, PhoneSchema, PincodeSchema } from "@/lib/schemas/common";

const REGISTRATION_TYPES = [
  { label: "Unregistered", value: "Unregistered" },
  { label: "Regular", value: "Regular" },
  { label: "Regular-Embassy/UN Body", value: "Regular-Embassy/UN Body" },
  { label: "Regular-SEZ", value: "Regular-SEZ" },
  { label: "Composition", value: "Composition" },
];

const COUNTRY_OPTIONS = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "United Arab Emirates", value: "UAE" },
];

const PARTY_GROUP_OPTIONS = [
  { label: "Sundry Debtors", value: "Sundry Debtors" },
  { label: "Sundry Creditors", value: "Sundry Creditors" },
];

const partySchema = z.object({
  partyType: z.enum(["Customer", "Vendor", "Customer | Vendor"]),
  gstin: z.string().optional().refine(val => !val || GSTINSchema.safeParse(val).success, "Invalid GSTIN format"),
  name: z.string().min(1, "Company name is required"),
  phone: z.string().optional().refine(val => !val || PhoneSchema.safeParse(val).success, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  pan: z.string().optional().refine(val => !val || PANSchema.safeParse(val).success, "Invalid PAN format"),
  
  billingAddress: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional().refine(val => !val || PincodeSchema.safeParse(val).success, "Invalid pincode"),
  city: z.string().optional(),
  
  openingBalance: z.coerce.number().optional().default(0),
  balanceType: z.enum(["Credit", "Debit"]),
  
  partyGroup: z.string().optional(),
  registrationType: z.string().optional(),
});

type PartyFormValues = z.infer<typeof partySchema>;

export default function AddPartyScreen() {
  const queryClient = useQueryClient();
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema) as any,
    defaultValues: {
      partyType: "Customer",
      gstin: "",
      name: "",
      phone: "",
      email: "",
      pan: "",
      billingAddress: "",
      country: "India",
      state: "",
      pincode: "",
      city: "",
      openingBalance: 0,
      balanceType: "Credit",
      partyGroup: "",
      registrationType: "",
    }
  });

  const partyType = watch("partyType");
  const gstin = watch("gstin");

  const addMutation = useMutation({
    mutationFn: (data: any) => mockApi.addParty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      router.back();
    }
  });

  const onSubmit = (data: PartyFormValues) => {
    addMutation.mutate({
      name: data.name,
      type: data.partyType.toUpperCase() as "CUSTOMER" | "VENDOR",
      phone: data.phone || "",
      gstin: data.gstin || "",
      balancePaise: data.openingBalance * 100,
      balanceType: data.balanceType === "Credit" ? "CREDIT" : "DEBIT",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Add Party" subtitle="Add Customer | Vendor" />

      <FilterTabs
        tabs={["Customer", "Vendor", "Customer | Vendor"]}
        activeTab={partyType}
        onChange={(val) => setValue("partyType", val as any)}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <Text className="text-h3 text-black mb-4">Basic Details</Text>

          <Controller
            control={control}
            name="gstin"
            render={({ field: { onChange, value } }) => (
              <Input
                label="GSTIN"
                placeholder="Enter GSTIN (Optional)"
                containerClassName="mb-4"
                value={value}
                onChangeText={onChange}
                autoCapitalize="characters"
                error={errors.gstin?.message}
                rightIcon={
                  <Pressable
                    className={`px-3 py-1.5 rounded-md ${value ? "bg-black" : "bg-natural-100"}`}
                    disabled={!value}
                    onPress={() => {
                      if (value) {
                        console.log("Auto-fill triggered for:", value);
                      }
                    }}
                  >
                    <Text className={`text-[11px] font-sans-bold tracking-wide ${value ? "text-white" : "text-natural-400"}`}>
                      AUTO-FILL
                    </Text>
                  </Pressable>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Company Name"
                placeholder="Enter company name"
                required
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                containerClassName="mb-4"
              />
            )}
          />
          
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Contact No."
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
                containerClassName="mb-4"
              />
            )}
          />
          
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email Address"
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                containerClassName="mb-4"
              />
            )}
          />
          
          <Controller
            control={control}
            name="pan"
            render={({ field: { onChange, value } }) => (
              <Input
                label="PAN"
                placeholder="Enter PAN"
                autoCapitalize="characters"
                value={value}
                onChangeText={onChange}
                error={errors.pan?.message}
              />
            )}
          />
        </View>

        {/* Address Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-50">
          <Text className="text-h3 text-black mb-4">Address Details</Text>
          <Controller
            control={control}
            name="billingAddress"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Billing Address"
                placeholder="Enter complete address"
                multiline
                numberOfLines={isAddressExpanded ? 4 : 2}
                style={isAddressExpanded ? { minHeight: 80 } : undefined}
                containerClassName="mb-4"
                value={value}
                onChangeText={onChange}
                error={errors.billingAddress?.message}
                rightIcon={
                  <Pressable onPress={() => setIsAddressExpanded(!isAddressExpanded)} className="p-1">
                    {isAddressExpanded ? <Minimize2 size={20} color="#9CA3AF" /> : <Maximize2 size={20} color="#9CA3AF" />}
                  </Pressable>
                }
              />
            )}
          />

          <View className="mb-4">
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Country"
                  options={COUNTRY_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  error={errors.country?.message}
                />
              )}
            />
          </View>

          <View className="mb-4 z-40">
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="State"
                  options={GST_STATE_CODES}
                  value={value}
                  onSelect={onChange}
                  searchable
                  placeholder="Select State"
                  error={errors.state?.message}
                />
              )}
            />
          </View>

          <View className="flex-row gap-x-4">
            <Controller
              control={control}
              name="pincode"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Pincode"
                  placeholder="e.g. 400001"
                  keyboardType="numeric"
                  containerClassName="flex-1"
                  value={value}
                  onChangeText={onChange}
                  error={errors.pincode?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="City"
                  placeholder="e.g. Mumbai"
                  containerClassName="flex-1"
                  value={value}
                  onChangeText={onChange}
                  error={errors.city?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Opening Balance Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-30">
          <Text className="text-h3 text-black mb-4">Opening Balance</Text>
          
          <View className="flex-row gap-x-4">
            <Controller
              control={control}
              name="openingBalance"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Amount"
                  placeholder="0.00"
                  keyboardType="numeric"
                  containerClassName="flex-1"
                  value={value ? String(value) : ""}
                  onChangeText={onChange}
                  error={errors.openingBalance?.message}
                />
              )}
            />
            <View className="flex-1">
              <Controller
                control={control}
                name="balanceType"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="To Receive / To Pay"
                    options={[
                      { label: "To Receive (Dr)", value: "Debit" },
                      { label: "To Pay (Cr)", value: "Credit" },
                    ]}
                    value={value}
                    onSelect={onChange}
                    error={errors.balanceType?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Additional Details */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm z-20">
          <Text className="text-h3 text-black mb-4">Additional Details</Text>

          <View className="mb-4">
            <Controller
              control={control}
              name="partyGroup"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Party Group"
                  options={PARTY_GROUP_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  placeholder="Select group"
                  error={errors.partyGroup?.message}
                />
              )}
            />
          </View>

          <View className="z-10">
            <Controller
              control={control}
              name="registrationType"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Registration Type"
                  options={REGISTRATION_TYPES}
                  value={value}
                  onSelect={onChange}
                  placeholder="Select type"
                  error={errors.registrationType?.message}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 py-4"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable 
          onPress={handleSubmit(onSubmit)}
          disabled={addMutation.isPending}
          className="w-full bg-black py-4 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white text-body-strong">
            {addMutation.isPending ? "Saving..." : "Save Party"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
