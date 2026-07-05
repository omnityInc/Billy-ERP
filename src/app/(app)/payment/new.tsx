import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Maximize2, Minimize2 } from "lucide-react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";

const PARTY_OPTIONS = [
  { label: "Customer A", value: "C_A" },
  { label: "Customer B", value: "C_B" },
  { label: "Vendor X", value: "V_X" },
];

const PAYMENT_MODE_OPTIONS = [
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "UPI", value: "UPI" },
  { label: "Cheque", value: "Cheque" },
];

const INVOICE_OPTIONS = [
  { label: "INV-001 (₹5,000)", value: "INV-001" },
  { label: "INV-002 (₹1,500)", value: "INV-002" },
];

const paymentSchema = z.object({
  paymentDirection: z.enum(["Payment In", "Payment Out"]),
  party: z.string().min(1, "Party is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  referenceNo: z.string().optional(),
  isAdvance: z.boolean().default(false),
  invoice: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function RecordPaymentScreen() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      paymentDirection: "Payment In",
      party: "",
      amount: "" as any,
      date: new Date().toISOString().split('T')[0],
      paymentMode: "Bank Transfer",
      referenceNo: "",
      isAdvance: false,
      invoice: "",
      notes: "",
    }
  });

  const paymentDirection = watch("paymentDirection");
  const party = watch("party");
  const isAdvance = watch("isAdvance");

  const onSubmit = (data: PaymentFormValues) => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Record Payment" subtitle="Log money in or out" />

      <FilterTabs
        tabs={["Payment In", "Payment Out"]}
        activeTab={paymentDirection}
        onChange={(val) => setValue("paymentDirection", val as "Payment In" | "Payment Out")}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Party Details */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-50">
          <Text className="text-h3 text-black mb-4">Party Details</Text>

          <View className="mb-3">
            <Controller
              control={control}
              name="party"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Party Name"
                  options={PARTY_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  placeholder="Search Customer or Vendor"
                  error={errors.party?.message}
                  required
                />
              )}
            />
          </View>
          
          {party !== "" && (
            <View className="flex-row justify-between bg-natural-50 p-3 rounded-lg border border-natural-100">
              <Text className="text-xs text-natural-500 uppercase tracking-wider">Outstanding Balance</Text>
              <Text className="text-sm font-sans-semibold text-danger-600">₹10,500.00 Dr</Text>
            </View>
          )}
        </View>

        {/* Payment Details */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-40">
          <Text className="text-h3 text-black mb-4">Payment Details</Text>
          
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Amount" 
                placeholder="0.00" 
                keyboardType="numeric" 
                value={value ? String(value) : ""} 
                onChangeText={onChange}
                error={errors.amount?.message}
                required 
                containerClassName="mb-4" 
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Payment Date" 
                placeholder="YYYY-MM-DD" 
                value={value} 
                onChangeText={onChange}
                error={errors.date?.message}
                required 
                containerClassName="mb-4" 
              />
            )}
          />
          
          <View className="mb-4 z-20">
            <Controller
              control={control}
              name="paymentMode"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Payment Mode"
                  options={PAYMENT_MODE_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  error={errors.paymentMode?.message}
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name="referenceNo"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Reference / UTR No." 
                placeholder="Enter transaction ID" 
                value={value} 
                onChangeText={onChange}
                error={errors.referenceNo?.message}
                containerClassName="mb-2" 
              />
            )}
          />
        </View>

        {/* Settlement & Notes */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm z-30">
          <Text className="text-h3 text-black mb-4">Settlement & Notes</Text>
          
          <View className="flex-row items-center justify-between bg-natural-50 p-3 rounded-lg border border-natural-100 mb-4">
            <View>
              <Text className="text-sm font-sans-medium text-black">Is this an advance payment?</Text>
            </View>
            <Controller
              control={control}
              name="isAdvance"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
          
          {!isAdvance && party !== "" && (
            <View className="mb-4 z-20">
              <Controller
                control={control}
                name="invoice"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Settle Against Invoice"
                    options={INVOICE_OPTIONS}
                    value={value}
                    onSelect={onChange}
                    placeholder="Select invoice (Optional)"
                    error={errors.invoice?.message}
                  />
                )}
              />
            </View>
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Notes"
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={isNotesExpanded ? 6 : 3}
                style={isNotesExpanded ? { minHeight: 120 } : undefined}
                value={value}
                onChangeText={onChange}
                error={errors.notes?.message}
                rightIcon={
                  <Pressable onPress={() => setIsNotesExpanded(!isNotesExpanded)} className="p-1">
                    {isNotesExpanded ? (
                      <Minimize2 size={20} color="#9CA3AF" />
                    ) : (
                      <Maximize2 size={20} color="#9CA3AF" />
                    )}
                  </Pressable>
                }
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 py-4"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable 
          onPress={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="w-full bg-black py-4 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white text-body-strong">
            {isSaving ? "Saving..." : "Save Payment"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
