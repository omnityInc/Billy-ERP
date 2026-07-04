import { useState, useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View, Platform, Keyboard } from "react-native";
import { X, IndianRupee } from "lucide-react-native";
import { formatINR } from "@/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockApi } from "@/data/mockApi";
import type { PaymentType, Paise } from "@/data/mock";
import { toPaise } from "@/data/mock";

interface RecordPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  invoiceId: string;
  partyId: string;
  partyName: string;
  outstandingAmountPaise: Paise;
}

const PAYMENT_METHODS: { label: string; value: PaymentType }[] = [
  { label: "UPI", value: "UPI" },
  { label: "Cash", value: "CASH" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Bank Transfer", value: "NEFT" },
];

export function RecordPaymentModal({
  visible,
  onClose,
  invoiceId,
  partyId,
  partyName,
  outstandingAmountPaise,
}: RecordPaymentModalProps) {
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: (data: any) => mockApi.addPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    }
  });

  const paymentSchema = z.object({
    amountStr: z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be greater than 0")
    .refine((val) => {
      const num = parseFloat(val);
      return Math.round(num * 100) <= outstandingAmountPaise;
    }, "Cannot exceed outstanding amount"),
    paymentType: z.enum(["UPI", "CASH", "CHEQUE", "NEFT"] as const),
    remarks: z.string().optional(),
  });

  type PaymentFormValues = z.infer<typeof paymentSchema>;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amountStr: "",
      paymentType: "UPI",
      remarks: "",
    }
  });

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      reset({
        amountStr: (outstandingAmountPaise / 100).toString(),
        paymentType: "UPI",
        remarks: "",
      });
    }
  }, [visible, outstandingAmountPaise, reset]);

  // Reliable manual keyboard height tracking
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSubmit = (data: PaymentFormValues) => {
    const amountNum = parseFloat(data.amountStr);
    
    addMutation.mutate({
      id: Math.random().toString(36).substring(7),
      receiptNo: `RCPT-${Math.floor(Math.random() * 10000)}`,
      invoiceId,
      partyId,
      amountPaise: toPaise(amountNum),
      paymentType: data.paymentType,
      paymentDate: new Date().toISOString().substring(0, 10),
      remarks: data.remarks || "",
    });

    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-end"
        style={{ 
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingBottom: keyboardHeight 
        }}
      >
        <Pressable className="flex-1" onPress={() => { Keyboard.dismiss(); onClose(); }} />

        <View className="bg-white rounded-t-3xl p-6 pb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-sans-bold text-black">Record Payment</Text>
              <Text className="text-sm text-natural-500 mt-1">From {partyName}</Text>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-natural-100 rounded-full">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* AMOUNT INPUT */}
          <View className="mb-6">
            <View className="flex-row justify-between items-end mb-2">
              <Text className="text-sm font-sans-semibold text-natural-700">Payment Amount</Text>
              <Text className="text-xs text-natural-500">
                Outstanding: <Text className="font-sans-bold text-black">{formatINR(outstandingAmountPaise)}</Text>
              </Text>
            </View>
            
            <Controller
              control={control}
              name="amountStr"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className={`flex-row items-center border rounded-xl px-4 py-3 bg-natural-50 ${errors.amountStr ? "border-red-500" : "border-natural-300 focus:border-black"}`}>
                  <IndianRupee size={20} color="#0F172A" />
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    className="flex-1 ml-2 text-2xl font-sans-bold text-black"
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}
            />
            {errors.amountStr && <Text className="text-red-500 text-xs mt-1">{errors.amountStr.message}</Text>}
          </View>

          {/* PAYMENT METHOD */}
          <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-natural-700 mb-3">Payment Method</Text>
            <Controller
              control={control}
              name="paymentType"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isActive = value === method.value;
                    return (
                      <Pressable
                        key={method.value}
                        onPress={() => onChange(method.value)}
                        className={`px-4 py-2 rounded-full border ${
                          isActive 
                            ? "bg-black border-black" 
                            : "bg-white border-natural-200"
                        }`}
                      >
                        <Text
                          className={`text-sm font-sans-semibold ${
                            isActive ? "text-white" : "text-natural-600"
                          }`}
                        >
                          {method.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
            {errors.paymentType && <Text className="text-red-500 text-xs mt-1">{errors.paymentType.message}</Text>}
          </View>

          {/* REMARKS */}
          <View className="mb-8">
            <Text className="text-sm font-sans-semibold text-natural-700 mb-2">Remarks (Optional)</Text>
            <Controller
              control={control}
              name="remarks"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="e.g. Transaction ID, UTR, Cheque No."
                  className={`border rounded-xl px-4 py-3 text-sm text-black bg-white ${errors.remarks ? "border-red-500" : "border-natural-300"}`}
                  placeholderTextColor="#94A3B8"
                />
              )}
            />
            {errors.remarks && <Text className="text-red-500 text-xs mt-1">{errors.remarks.message}</Text>}
          </View>

          {/* ACTIONS */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="w-full bg-black py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-sans-bold text-base">Confirm Payment</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
