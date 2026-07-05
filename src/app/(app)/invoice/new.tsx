import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Maximize2, Minimize2, Plus, Trash2 } from "lucide-react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { GST_STATE_CODES } from "@/constants/gst";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { router } from "expo-router";
import type { PaymentType } from "@/data/mock";

const INVOICE_TYPE_OPTIONS = [
  { label: "Tax Invoice", value: "Tax Invoice" },
  { label: "Bill of Supply", value: "Bill of Supply" },
];

const DELIVERY_OPTIONS = [
  { label: "Transport", value: "Transport" },
  { label: "Rail", value: "Rail" },
  { label: "Air", value: "Air" },
  { label: "Ship", value: "Ship" },
  { label: "Other", value: "Other" },
];

const IGST_OPTIONS = [
  { label: "0%", value: "0" },
  { label: "5%", value: "5" },
  { label: "12%", value: "12" },
  { label: "18%", value: "18" },
  { label: "28%", value: "28" },
];

const PAYMENT_TYPE_OPTIONS = [
  { label: "Credit", value: "CREDIT" },
  { label: "Cash", value: "CASH" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "UPI", value: "UPI" },
  { label: "Bank Transfer", value: "NEFT" },
];

const itemSchema = z.object({
  productName: z.string().min(1, "Product is required"),
  qty: z.coerce.number().min(1, "Qty must be >= 1"),
  uom: z.string().min(1, "Required"),
  rate: z.coerce.number().min(0, "Rate must be >= 0"),
  discountPercent: z.coerce.number().min(0).max(100).optional().default(0),
  taxPercent: z.enum(["0", "5", "12", "18", "28"]),
});

const invoiceSchema = z.object({
  docType: z.enum(["Sale", "Purchase"]),
  partyId: z.string().min(1, "Customer/Vendor is required"),
  placeOfSupply: z.string().min(1, "Place of supply is required"),
  invoiceType: z.string().min(1, "Invoice type is required"),
  invoiceNo: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  delivery: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  roundOff: z.boolean().default(false),
  paymentType: z.enum(["CREDIT", "CASH", "CHEQUE", "UPI", "NEFT"]),
  dueDate: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function CreateInvoiceScreen() {
  const queryClient = useQueryClient();
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      docType: "Sale",
      partyId: "",
      placeOfSupply: "27", // Default to MH for example
      invoiceType: "Tax Invoice",
      invoiceNo: "",
      date: new Date().toISOString().split('T')[0],
      delivery: "",
      items: [{ productName: "", qty: 1, uom: "pcs", rate: 0, discountPercent: 0, taxPercent: "18" }],
      roundOff: false,
      paymentType: "CREDIT",
      dueDate: "",
      terms: "",
      notes: "",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const docType = watch("docType");
  const items = watch("items");
  const roundOff = watch("roundOff");

  // Calculate totals
  const totals = items.reduce((acc, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discountPercent) || 0;
    const taxPercent = Number(item.taxPercent) || 0;

    const baseAmount = qty * rate;
    const discountAmount = baseAmount * (discount / 100);
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = taxableAmount * (taxPercent / 100);

    return {
      taxableAmount: acc.taxableAmount + taxableAmount,
      taxAmount: acc.taxAmount + taxAmount,
    };
  }, { taxableAmount: 0, taxAmount: 0 });

  let grandTotal = totals.taxableAmount + totals.taxAmount;
  if (roundOff) {
    grandTotal = Math.round(grandTotal);
  }

  const addMutation = useMutation({
    mutationFn: (data: any) => mockApi.addInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      router.back();
    }
  });

  const onSubmit = (data: InvoiceFormValues) => {
    // Note: In a real app, calculate Paise before saving. 
    // Here we'll cast it to the expected mock format.
    const newInvoice = {
      invoiceNo: data.invoiceNo,
      invoiceType: data.docType === "Sale" ? "SALES" : "PURCHASE",
      partyId: data.partyId,
      date: data.date,
      paymentType: data.paymentType as PaymentType,
      dueDate: data.dueDate || data.date,
      items: data.items.map((item, idx) => ({
        id: `temp-${idx}`,
        productId: `prod-${idx}`,
        productName: item.productName,
        qty: item.qty,
        uom: item.uom,
        ratePaise: (item.rate * 100) as any,
        discountPercent: item.discountPercent,
        taxablePaise: (item.qty * item.rate * 100) as any,
        taxPercent: Number(item.taxPercent),
        taxAmountPaise: (item.qty * item.rate * Number(item.taxPercent)) as any,
        totalPaise: (item.qty * item.rate * (1 + Number(item.taxPercent) / 100) * 100) as any,
      })),
      taxableAmountPaise: (totals.taxableAmount * 100) as any,
      taxAmountPaise: (totals.taxAmount * 100) as any,
      roundOffPaise: 0 as any,
      grandTotalPaise: (grandTotal * 100) as any,
      status: data.paymentType === "CREDIT" ? "UNPAID" : "PAID",
    } as any;
    
    addMutation.mutate(newInvoice);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Create Invoice" subtitle="Record a new transaction" />

      <FilterTabs
        tabs={["Sale", "Purchase"]}
        activeTab={docType}
        onChange={(val) => setValue("docType", val as "Sale" | "Purchase")}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Info Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-50">
          <Text className="text-h3 text-black mb-4">Party Info</Text>

          <View className="mb-4">
            <Controller
              control={control}
              name="partyId"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Select Customer/Vendor"
                  options={[{ label: "Customer A", value: "A" }, { label: "Vendor B", value: "B" }]}
                  value={value}
                  onSelect={onChange}
                  placeholder="Search party..."
                  error={errors.partyId?.message}
                />
              )}
            />
          </View>
          
          <View className="z-10">
            <Controller
              control={control}
              name="placeOfSupply"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Place of Supply"
                  options={GST_STATE_CODES}
                  value={value}
                  onSelect={onChange}
                  error={errors.placeOfSupply?.message}
                  required
                />
              )}
            />
          </View>
        </View>

        {/* Invoice Detail Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-40">
          <Text className="text-h3 text-black mb-4">Invoice Detail</Text>
          
          <View className="mb-4 z-20">
            <Controller
              control={control}
              name="invoiceType"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Invoice Type"
                  options={INVOICE_TYPE_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  error={errors.invoiceType?.message}
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name="invoiceNo"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Invoice No." 
                placeholder="INV-001" 
                value={value}
                onChangeText={onChange}
                error={errors.invoiceNo?.message}
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
        </View>

        {/* Product Items Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-30">
          <Text className="text-h3 text-black mb-4">Product Items</Text>
          
          {fields.map((field, index) => (
            <View key={field.id} className="border border-natural-200 rounded-xl p-4 bg-natural-50 mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-body-strong">Item {index + 1}</Text>
                {fields.length > 1 && (
                  <Pressable onPress={() => remove(index)} className="p-2">
                    <Trash2 size={16} color="#EF4444" />
                  </Pressable>
                )}
              </View>

              <Controller
                control={control}
                name={`items.${index}.productName`}
                render={({ field: { onChange, value } }) => (
                  <Input 
                    label="Product Name" 
                    placeholder="Enter product" 
                    value={value}
                    onChangeText={onChange}
                    error={errors.items?.[index]?.productName?.message}
                    containerClassName="mb-4" 
                  />
                )}
              />
              
              <View className="flex-row gap-x-3 mb-4">
                <Controller
                  control={control}
                  name={`items.${index}.qty`}
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="Qty" 
                      placeholder="0" 
                      keyboardType="numeric" 
                      value={String(value)}
                      onChangeText={onChange}
                      error={errors.items?.[index]?.qty?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`items.${index}.uom`}
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="UOM" 
                      placeholder="pcs" 
                      value={value}
                      onChangeText={onChange}
                      error={errors.items?.[index]?.uom?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
              </View>

              <View className="flex-row gap-x-3 mb-4">
                <Controller
                  control={control}
                  name={`items.${index}.rate`}
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="Price" 
                      placeholder="0.00" 
                      keyboardType="numeric" 
                      value={String(value)}
                      onChangeText={onChange}
                      error={errors.items?.[index]?.rate?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`items.${index}.discountPercent`}
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="Disc. %" 
                      placeholder="0" 
                      keyboardType="numeric" 
                      value={String(value)}
                      onChangeText={onChange}
                      error={errors.items?.[index]?.discountPercent?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
              </View>

              <View className="flex-row gap-x-3 items-end">
                <View className="flex-1 z-10">
                  <Controller
                    control={control}
                    name={`items.${index}.taxPercent`}
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        label="IGST"
                        options={IGST_OPTIONS}
                        value={value}
                        onSelect={onChange}
                        error={errors.items?.[index]?.taxPercent?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1 h-14 justify-center items-end px-2 border-b border-natural-200 bg-white rounded-t-lg">
                  <Text className="text-xs text-natural-500 mb-1">Total</Text>
                  <Text className="text-body-strong text-black">
                    ₹{((Number(items[index]?.qty || 0) * Number(items[index]?.rate || 0)) * (1 + Number(items[index]?.taxPercent || 0) / 100)).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <Pressable 
            onPress={() => append({ productName: "", qty: 1, uom: "pcs", rate: 0, discountPercent: 0, taxPercent: "18" })}
            className="flex-row items-center justify-center py-3 rounded-lg border border-natural-200 bg-white"
          >
            <Plus size={18} color="#0F172A" />
            <Text className="text-body-strong text-black ml-2">Add more product</Text>
          </Pressable>
        </View>

        {/* Summary Section */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm z-20">
          <Text className="text-h3 text-black mb-4">Summary</Text>

          <View className="gap-y-3 mb-6">
            <View className="flex-row justify-between">
              <Text className="text-sm text-natural-600">Total Taxable</Text>
              <Text className="text-sm font-sans-medium text-black">₹{totals.taxableAmount.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-natural-600">Total tax</Text>
              <Text className="text-sm font-sans-medium text-black">₹{totals.taxAmount.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-natural-600">Round off</Text>
              <Controller
                control={control}
                name="roundOff"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
            <View className="flex-row justify-between items-center border-t border-natural-100 pt-3 mt-1">
              <Text className="text-body-strong text-black">Grand Total</Text>
              <Text className="text-h2 text-black">₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View className="mb-4 z-20">
            <Controller
              control={control}
              name="paymentType"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Payment Type"
                  options={PAYMENT_TYPE_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  error={errors.paymentType?.message}
                />
              )}
            />
          </View>
          
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Due Date" 
                placeholder="YYYY-MM-DD" 
                value={value}
                onChangeText={onChange}
                error={errors.dueDate?.message}
                containerClassName="mb-4" 
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
          className="w-full bg-black py-4 rounded-xl items-center shadow-sm"
          disabled={addMutation.isPending}
        >
          <Text className="text-white text-body-strong">
            {addMutation.isPending ? "Saving..." : "Save Invoice"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
