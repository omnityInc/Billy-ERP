import React from 'react';
import { View, ScrollView, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { USER_DATA } from '@/constants/static-data';
import { User, Mail, Phone, Camera } from 'lucide-react-native';

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: USER_DATA.name,
      email: 'user@billyerp.in',
      phone: '9876543210', // Mock data
    },
    mode: 'onChange',
  });

  const onSubmit = (data: EditProfileForm) => {
    console.log("Profile Saved:", data);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader 
        title="Edit Profile" 
        subtitle="Manage your personal information" 
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View className="items-center mt-8 mb-6">
          <View className="relative">
            <Image 
              source={USER_DATA.avatarUrl} 
              style={{ width: 96, height: 96, borderRadius: 48 }} 
            />
            <Pressable className="absolute bottom-0 right-0 bg-black w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Camera color="#FFFFFF" size={14} />
            </Pressable>
          </View>
        </View>

        <View className="px-6 mt-6 gap-y-4">
          <Text className="text-sm font-sans-semibold text-natural-500 uppercase tracking-wider mb-2">Personal Details</Text>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                required
                placeholder="Enter your full name"
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
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                required
                placeholder="Enter your email"
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
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                required
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                leftIcon={<Phone color="#64748B" size={20} />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
              />
            )}
          />

          <View className="mt-8">
            <Button
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
