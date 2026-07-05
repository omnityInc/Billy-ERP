import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Camera } from "lucide-react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { Dropdown } from "@/components/shared/Dropdown";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";



const UOM_OPTIONS = [
  { label: "PCS - Pieces", value: "PCS" },
  { label: "KGS - Kilograms", value: "KGS" },
  { label: "MTR - Meters", value: "MTR" },
  { label: "BOX - Boxes", value: "BOX" },
  { label: "LTR - Liters", value: "LTR" },
];

const GST_SLAB_OPTIONS = [
  { label: "0% GST", value: "0" },
  { label: "5% GST", value: "5" },
  { label: "12% GST", value: "12" },
  { label: "18% GST", value: "18" },
  { label: "28% GST", value: "28" },
];

const CESS_OPTIONS = [
  { label: "None", value: "0" },
  { label: "12%", value: "12" },
  { label: "22%", value: "22" },
];

const PRODUCT_GROUP_OPTIONS = [
  { label: "Electronics", value: "Electronics" },
  { label: "Hardware", value: "Hardware" },
  { label: "Apparel", value: "Apparel" },
  { label: "Services", value: "Services" },
];

const productSchema = z.object({
  itemType: z.enum(["Goods", "Services"]),
  name: z.string().min(1, "Item name is required"),
  sku: z.string().optional(),
  uom: z.string().min(1, "Unit is required"),
  productGroup: z.string().optional(),
  
  salePrice: z.coerce.number().optional().default(0),
  purchasePrice: z.coerce.number().optional().default(0),
  taxInclusive: z.boolean().default(false),
  
  gstSlab: z.string().optional(),
  hsnCode: z.string().optional(),
  cess: z.string().optional(),
  
  trackInventory: z.boolean().default(true),
  openingStock: z.coerce.number().optional().default(0),
  lowStockAlert: z.coerce.number().optional().default(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductScreen() {
  
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      itemType: "Goods",
      name: "",
      sku: "",
      uom: "PCS",
      productGroup: "",
      salePrice: 0,
      purchasePrice: 0,
      taxInclusive: false,
      gstSlab: "18",
      hsnCode: "",
      cess: "0",
      trackInventory: true,
      openingStock: 0,
      lowStockAlert: 0,
    }
  });

  const itemType = watch("itemType");
  const trackInventory = watch("trackInventory");


  const onSubmit = (data: ProductFormValues) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <StatusBar style="dark" />
      <ScreenHeader title="Add Product" subtitle="Create a new inventory item or service" />

      <FilterTabs
        tabs={["Goods", "Services"]}
        activeTab={itemType}
        onChange={(val) => setValue("itemType", val as "Goods" | "Services")}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-50">
          <Text className="text-h3 text-black mb-4">Basic Details</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                label="Item Name" 
                placeholder="Enter product or service name" 
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
            name="sku"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Item Code / SKU"
                placeholder="e.g. ITEM-001"
                containerClassName="mb-4"
                value={value}
                onChangeText={onChange}
                autoCapitalize="characters"
                error={errors.sku?.message}
                rightIcon={
                  <Pressable className="p-1" onPress={() => console.log('Scan Barcode')}>
                    <Camera size={20} color="#6B7280" />
                  </Pressable>
                }
              />
            )}
          />
          
          <View className="flex-row gap-x-4">
            <View className="flex-1 mb-4 z-20">
              <Controller
                control={control}
                name="uom"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Unit (UOM)"
                    options={UOM_OPTIONS}
                    value={value}
                    onSelect={onChange}
                    error={errors.uom?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1 mb-4 z-10">
              <Controller
                control={control}
                name="productGroup"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Group/Category"
                    options={PRODUCT_GROUP_OPTIONS}
                    value={value}
                    onSelect={onChange}
                    placeholder="Select"
                    error={errors.productGroup?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-40">
          <Text className="text-h3 text-black mb-4">Pricing</Text>
          
          <View className="flex-row gap-x-4 mb-4">
            <Controller
              control={control}
              name="salePrice"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Sale Price" 
                  placeholder="0.00" 
                  keyboardType="numeric" 
                  value={value ? String(value) : ""} 
                  onChangeText={onChange}
                  error={errors.salePrice?.message}
                  containerClassName="flex-1" 
                />
              )}
            />
            <Controller
              control={control}
              name="purchasePrice"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Purchase Price" 
                  placeholder="0.00" 
                  keyboardType="numeric" 
                  value={value ? String(value) : ""} 
                  onChangeText={onChange}
                  error={errors.purchasePrice?.message}
                  containerClassName="flex-1" 
                />
              )}
            />
          </View>

          <View className="flex-row items-center justify-between bg-natural-50 p-3 rounded-lg border border-natural-100">
            <View>
              <Text className="text-sm font-sans-medium text-black">Tax Inclusive</Text>
              <Text className="text-xs text-natural-500 mt-1">Is tax included in the price?</Text>
            </View>
            <Controller
              control={control}
              name="taxInclusive"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>
        </View>

        {/* GST & Compliance Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm z-30">
          <Text className="text-h3 text-black mb-4">GST & Compliance</Text>
          
          <View className="flex-row gap-x-4 mb-4">
            <View className="flex-1 z-20">
              <Controller
                control={control}
                name="gstSlab"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="GST Tax Rate"
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
                  placeholder="e.g. 1234" 
                  keyboardType="numeric" 
                  value={value} 
                  onChangeText={onChange}
                  error={errors.hsnCode?.message}
                  containerClassName="flex-1" 
                />
              )}
            />
          </View>

          <View className="z-10">
            <Controller
              control={control}
              name="cess"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="CESS Amount/Rate"
                  options={CESS_OPTIONS}
                  value={value}
                  onSelect={onChange}
                  error={errors.cess?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Inventory Tracking */}
        {itemType === "Goods" && (
          <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm z-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-h3 text-black">Inventory Tracking</Text>
              <Controller
                control={control}
                name="trackInventory"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>

            {trackInventory && (
              <View className="flex-row gap-x-4 pt-2 border-t border-natural-100">
                <Controller
                  control={control}
                  name="openingStock"
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="Opening Stock" 
                      placeholder="0" 
                      keyboardType="numeric" 
                      value={value ? String(value) : ""} 
                      onChangeText={onChange}
                      error={errors.openingStock?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lowStockAlert"
                  render={({ field: { onChange, value } }) => (
                    <Input 
                      label="Low Stock Alert" 
                      placeholder="5" 
                      keyboardType="numeric" 
                      value={value ? String(value) : ""} 
                      onChangeText={onChange}
                      error={errors.lowStockAlert?.message}
                      containerClassName="flex-1" 
                    />
                  )}
                />
              </View>
            )}
          </View>
        )}
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
            {isSaving ? "Saving..." : "Save Product"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
