import React, { useEffect } from "react";
import { Modal, Pressable, Text, View, TextInput, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { X, Truck } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import type { LorryReceipt, Paise } from "@/data/mock";

const lrSchema = z.object({
  transporter: z.string().min(1, "Transporter name is required"),
  vehicleNo: z.string().min(1, "Vehicle number is required"),
  driverName: z.string().min(1, "Driver name is required"),
  driverPhone: z.string().min(10, "Valid phone number required"),
  freightINR: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid freight amount"),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Invalid weight"),
});

type LRFormValues = z.infer<typeof lrSchema>;

interface EditLRModalProps {
  lr: LorryReceipt | null;
  visible: boolean;
  onClose: () => void;
}

export function EditLRModal({ lr, visible, onClose }: EditLRModalProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: any) => mockApi.addPayment(data), // Using a generic update
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lorryReceipts"] });
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LRFormValues>({
    resolver: zodResolver(lrSchema),
    defaultValues: {
      transporter: "",
      vehicleNo: "",
      driverName: "",
      driverPhone: "",
      freightINR: "",
      weight: "",
    },
  });

  useEffect(() => {
    if (lr && visible) {
      reset({
        transporter: lr.transporter,
        vehicleNo: lr.vehicleNo,
        driverName: lr.driverName,
        driverPhone: lr.driverPhone,
        freightINR: (lr.freightPaise / 100).toString(),
        weight: lr.weight.toString(),
      });
    }
  }, [lr, visible, reset]);

  const onSubmit = (data: LRFormValues) => {
    if (!lr) return;
    
    updateMutation.mutate({
      id: lr.id,
      payload: {
        transporter: data.transporter,
        vehicleNo: data.vehicleNo,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        freightPaise: Math.round(parseFloat(data.freightINR) * 100) as Paise,
        weight: parseFloat(data.weight),
      }
    });
    
    onClose();
  };

  if (!lr) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Pressable className="flex-1" onPress={() => { Keyboard.dismiss(); onClose(); }} />
        
        <View className="bg-white rounded-t-3xl h-[80%]">
          {/* HEADER */}
          <View className="flex-row justify-between items-center p-6 border-b border-natural-200">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-natural-100 items-center justify-center mr-3">
                <Truck size={20} color="#0F172A" />
              </View>
              <View>
                <Text className="text-lg font-sans-bold text-black">Edit Lorry Receipt</Text>
                <Text className="text-xs text-natural-500">#{lr.lrNo}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView className="p-6" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="mb-4">
              <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Transporter Name</Text>
              <Controller
                control={control}
                name="transporter"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.transporter ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter transporter name"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
              {errors.transporter && <Text className="text-red-500 text-xs mt-1">{errors.transporter.message}</Text>}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Vehicle Number</Text>
              <Controller
                control={control}
                name="vehicleNo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.vehicleNo ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="e.g. MH 04 AB 1234"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="characters"
                  />
                )}
              />
              {errors.vehicleNo && <Text className="text-red-500 text-xs mt-1">{errors.vehicleNo.message}</Text>}
            </View>

            <View className="flex-row gap-x-4 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Driver Name</Text>
                <Controller
                  control={control}
                  name="driverName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.driverName ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Name"
                      placeholderTextColor="#94A3B8"
                    />
                  )}
                />
                {errors.driverName && <Text className="text-red-500 text-xs mt-1">{errors.driverName.message}</Text>}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Driver Phone</Text>
                <Controller
                  control={control}
                  name="driverPhone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.driverPhone ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="10 digit No."
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  )}
                />
                {errors.driverPhone && <Text className="text-red-500 text-xs mt-1">{errors.driverPhone.message}</Text>}
              </View>
            </View>

            <View className="flex-row gap-x-4 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Freight (₹)</Text>
                <Controller
                  control={control}
                  name="freightINR"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.freightINR ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.freightINR && <Text className="text-red-500 text-xs mt-1">{errors.freightINR.message}</Text>}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Weight (kg)</Text>
                <Controller
                  control={control}
                  name="weight"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-black ${errors.weight ? "border-red-500" : "border-natural-300 focus:border-black"}`}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="0"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.weight && <Text className="text-red-500 text-xs mt-1">{errors.weight.message}</Text>}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="w-full py-4 bg-black rounded-xl items-center mt-4 shadow-sm"
            >
              <Text className="text-white font-sans-bold text-base">Save Changes</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
