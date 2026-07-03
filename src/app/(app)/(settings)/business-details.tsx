import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Dropdown } from '@/components/shared/Dropdown';
import { USER_DATA } from '@/constants/static-data';
import { GST_STATE_CODES } from '@/constants/gst';
import { GSTINSchema, PANSchema } from '@/utils/validators';
import { Building2, Mail, MapPin, Phone, User, Globe, FileText, Briefcase, Maximize2, Minimize2 } from 'lucide-react-native';

const businessProfileSchema = z.object({
  gstin: GSTINSchema,
  companyName: z.string().min(1, "Company Name is required"),
  fullName: z.string().optional(),
  displayPhone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  companyType: z.string().optional(),
  panNumber: PANSchema,
  address: z.string().min(1, "Address is required"),
  pincode: z.string().min(6, "Valid Pincode is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  additionalLicence: z.string().optional(),
  lutNo: z.string().optional(),
  iecNo: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      fullName: USER_DATA.name,
      email: 'user@billyerp.in',
      companyName: '',
      displayPhone: '',
      address: '',
      pincode: '',
      city: '',
      state: '27',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: BusinessProfileForm) => {
    console.log("Business Profile Saved:", data);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader 
        title="Business Details" 
        subtitle="Organisation Details" 
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-6 gap-y-4">
          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mb-2">Basic Info</Text>

          <Controller
            control={control}
            name="gstin"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="GSTIN"
                placeholder="22AAAAA0000A1Z5"
                leftIcon={<FileText color="#64748B" size={20} />}
                rightIcon={
                  <Pressable 
                    className={`px-3 py-1.5 rounded-md ${value ? 'bg-black' : 'bg-natural-100'}`}
                    disabled={!value}
                    onPress={() => {
                      if (value) {
                        console.log('Auto-fill triggered for:', value);
                        // Mock autofill behavior
                      }
                    }}
                  >
                    <Text className={`text-[11px] font-bold tracking-wide ${value ? 'text-white' : 'text-natural-400'}`}>AUTO-FILL</Text>
                  </Pressable>
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="characters"
                error={errors.gstin?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company Name"
                required
                placeholder="Enter company name"
                leftIcon={<Building2 color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.companyName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="panNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="PAN Number"
                placeholder="ABCDE1234F"
                leftIcon={<FileText color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="characters"
                error={errors.panNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="companyType"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company Type"
                placeholder="e.g. Private Limited, Proprietorship"
                leftIcon={<Briefcase color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.companyType?.message}
              />
            )}
          />

          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mt-4 mb-2">Contact Details</Text>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Contact person name"
                leftIcon={<User color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="displayPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Display Phone"
                required
                placeholder="Business phone number"
                keyboardType="phone-pad"
                leftIcon={<Phone color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.displayPhone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Business email address"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Website"
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
                leftIcon={<Globe color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.website?.message}
              />
            )}
          />

          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mt-4 mb-2">Address Info</Text>

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Address"
                required
                multiline={true}
                placeholder="Street address"
                leftIcon={<MapPin color="#64748B" size={20} />}
                rightIcon={
                  <Pressable onPress={() => setIsAddressExpanded(!isAddressExpanded)} className="p-1">
                    {isAddressExpanded ? (
                      <Minimize2 color="#9CA3AF" size={18} />
                    ) : (
                      <Maximize2 color="#9CA3AF" size={18} />
                    )}
                  </Pressable>
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={isAddressExpanded ? { minHeight: 120 } : undefined}
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="City"
                required
                placeholder="City name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.city?.message}
              />
            )}
          />

          <View className="flex-row justify-between gap-x-4">
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1">
                  <Dropdown
                    label="State"
                    placeholder="Select state"
                    options={GST_STATE_CODES}
                    value={value}
                    onSelect={onChange}
                    error={errors.state?.message}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="pincode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Pincode"
                  required
                  keyboardType="number-pad"
                  placeholder="000000"
                  containerClassName="flex-1"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.pincode?.message}
                />
              )}
            />
          </View>

          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mt-4 mb-2">Additional Details</Text>

          <Controller
            control={control}
            name="additionalLicence"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Additional Licence"
                placeholder="e.g. FSSAI, Drug Licence"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.additionalLicence?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lutNo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="LUT No."
                placeholder="Letter of Undertaking No."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.lutNo?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="iecNo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="IEC No."
                placeholder="Import Export Code"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.iecNo?.message}
              />
            )}
          />

          <View className="mt-8">
            <Button
              title="Save Details"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
