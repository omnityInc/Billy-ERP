import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Paperclip, Maximize2, Minimize2 } from "lucide-react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";

const CATEGORY_OPTIONS = [
  { label: "Travel", value: "Travel" },
  { label: "Meals", value: "Meals" },
  { label: "Office Supplies", value: "Office Supplies" },
  { label: "Rent", value: "Rent" },
  { label: "Utilities", value: "Utilities" },
];

const PAYMENT_MODE_OPTIONS = [
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "UPI", value: "UPI" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Cheque", value: "Cheque" },
];

const VENDOR_OPTIONS = [
  { label: "Vendor A", value: "A" },
  { label: "Vendor B", value: "B" },
];

const GST_SLAB_OPTIONS = [
  { label: "0% GST", value: "0" },
  { label: "5% GST", value: "5" },
  { label: "12% GST", value: "12" },
  { label: "18% GST", value: "18" },
  { label: "28% GST", value: "28" },
];

const expenseSchema = z.object({
  expenseType: z.enum(["Operating Expense", "Non-Operating"]),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  paidTo: z.string().optional(),
  referenceNo: z.string().optional(),
  includesGst: z.boolean().default(false),
  gstSlab: z.string().optional(),
  hsnCode: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function RecordExpenseScreen() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      expenseType: "Operating Expense",
      category: "",
      amount: "" as any, // initial empty string
      date: new Date().toISOString().split('T')[0],
      paymentMode: "Cash",
      paidTo: "",
      referenceNo: "",
      includesGst: false,
      gstSlab: "18",
      hsnCode: "",
      notes: "",
    }
  });

  const expenseType = watch("expenseType");
  const includesGst = watch("includesGst");

  const onSubmit = (data: ExpenseFormValues) => {
    setIsSaving(true);
    // Simulate API call since expense is not in mockApi
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Record Expense" subtitle="Log a new business expense" />

      <FilterTabs
        tabs={["Operating Expense", "Non-Operating"]}
        activeTab={expenseType}
        onChange={(val) => setValue("expenseType", val as "Operating Expense" | "Non-Operating")}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Expense Details */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-50">
          <Text className="text-h3 text-black mb-4">Expense Details</Text>

          <View className="mb-4">
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  placeholder="Select category"
                  error={errors.category?.message}
                  required
                />
              )}
            />
          </View>
          
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
                label="Date" 
                placeholder="YYYY-MM-DD" 
                value={value} 
                onChangeText={onChange}
                error={errors.date?.message}
                required 
                containerClassName="mb-4" 
              />
            )}
          />
          
          <View className="mb-2 z-40">
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
        </View>

        {/* Payee & Reference */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-40">
          <Text className="text-h3 text-black mb-4">Payee & Reference</Text>
          
          <View className="mb-4">
            <Controller
              control={control}
              name="paidTo"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Paid To"
                  options={VENDOR_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  placeholder="Search vendor"
                  error={errors.paidTo?.message}
                />
              )}
            />
          </View>
          
          <Controller
            control={control}
            name="referenceNo"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Reference / Bill No." 
                placeholder="Enter bill number" 
                value={value} 
                onChangeText={onChange}
                error={errors.referenceNo?.message}
                containerClassName="mb-2" 
              />
            )}
          />
        </View>

        {/* GST & Tax */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-30">
          <Text className="text-h3 text-black mb-4">GST & Tax</Text>
          
          <View className="flex-row items-center justify-between bg-natural-50 p-3 rounded-lg border border-natural-100 mb-4">
            <View>
              <Text className="text-sm font-sans-medium text-black">Expense includes GST?</Text>
            </View>
            <Controller
              control={control}
              name="includesGst"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
          
          {includesGst && (
            <View className="flex-row gap-x-4 mb-2">
              <View className="flex-1 z-20">
                <Controller
                  control={control}
                  name="gstSlab"
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      label="Tax Slab"
                      options={GST_SLAB_OPTIONS}
                      value={value}
                      onSelect={onChange}
                      error={errors.gstSlab?.message}
                    />
                  )}
                />
              </View>
              <Controller
                control={control}
                name="hsnCode"
                render={({ field: { onChange, value } }) => (
                  <Input 
                    label="HSN / SAC Code" 
                    placeholder="e.g. 9983" 
                    keyboardType="numeric" 
                    value={value} 
                    onChangeText={onChange}
                    error={errors.hsnCode?.message}
                    containerClassName="flex-1" 
                  />
                )}
              />
            </View>
          )}
        </View>

        {/* Attachments & Notes */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm z-20">
          <Text className="text-h3 text-black mb-4">Attachments & Notes</Text>
          
          <Pressable className="flex-row items-center justify-center py-4 mb-4 rounded-xl border border-dashed border-natural-300 bg-natural-50">
            <Paperclip size={20} color="#64748B" />
            <Text className="text-sm font-sans-medium text-natural-600 ml-2">Attach Receipt (Optional)</Text>
          </Pressable>

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
            {isSaving ? "Saving..." : "Save Expense"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
