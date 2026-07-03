import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { USER_DATA } from '@/constants/static-data';
import { 
  User, 
  Store, 
  Bell, 
  Moon, 
  CloudUpload, 
  Download, 
  Trash2, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';

const SectionItem = ({ icon: Icon, title, subtitle, isDestructive = false }: any) => (
  <Pressable className="flex-row items-center py-4 border-b border-natural-100 last:border-b-0">
    <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDestructive ? 'bg-red-50' : 'bg-natural-50'}`}>
      <Icon color={isDestructive ? '#EF4444' : '#1A1A1A'} size={20} />
    </View>
    <View className="flex-1">
      <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-black'}`}>{title}</Text>
      {subtitle && <Text className="text-[13px] text-natural-500 mt-0.5">{subtitle}</Text>}
    </View>
    <ChevronRight color="#9CA3AF" size={20} />
  </Pressable>
);

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader 
        title="Settings" 
        subtitle="Manage your account & preferences" 
        onBack={() => router.navigate("/(app)/(dashboard)/dashboard")}
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Profile Block Section */}
        <View className="px-6 py-6 border-b border-natural-100">
          <View className="flex-row items-center">
            <Image 
              source={USER_DATA.avatarUrl} 
              style={{ width: 64, height: 64, borderRadius: 32 }} 
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-black">{USER_DATA.name}</Text>
              <Text className="text-sm text-natural-500 mt-1">user@billyerp.in</Text>
              <View className="bg-natural-100 self-start px-2 py-1 rounded mt-2">
                <Text className="text-[10px] font-medium text-natural-600 uppercase tracking-wider">Pro Plan</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mb-2">Account</Text>
          <View className="bg-white">
            <SectionItem icon={User} title="Edit Profile" subtitle="Change your name, avatar, and contact info" />
            <SectionItem icon={Store} title="Business Details" subtitle="Update your company name and GSTIN" />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mb-2">Preferences</Text>
          <View className="bg-white">
            <SectionItem icon={Bell} title="Notifications" subtitle="Control push and email alerts" />
            <SectionItem icon={Moon} title="Appearance" subtitle="Switch between Light and Dark themes" />
          </View>
        </View>

        {/* Data Section */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-semibold text-natural-500 uppercase tracking-wider mb-2">Data</Text>
          <View className="bg-white">
            <SectionItem icon={CloudUpload} title="Backup to Cloud" subtitle="Safely store your local data online" />
            <SectionItem icon={Download} title="Export Data" subtitle="Download spreadsheets and PDFs" />
          </View>
        </View>

        {/* Danger Zone Section */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Danger Zone</Text>
          <View className="bg-white rounded-xl border border-red-100 overflow-hidden px-4">
            <SectionItem icon={LogOut} title="Log Out" isDestructive />
            <SectionItem icon={Trash2} title="Delete Account" subtitle="Permanently remove your account and data" isDestructive />
          </View>
        </View>

        {/* Copyright Caption */}
        <View className="px-6 mt-12 mb-2 items-center">
          <Text className="text-[11px] text-natural-400 text-center leading-relaxed font-medium">
            Copyright © 2026{"\n"}
            Billy - Omnity Industries Software{"\n"}
            All rights reserved.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
