import React, { useEffect } from 'react';
import { View, ViewProps, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export interface SkeletonProps extends ViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width, height, borderRadius = 8, className, style, ...rest }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#CBD5E1', // natural-300
        },
        animatedStyle,
        style,
      ]}
      {...rest}
    />
  );
}

export function ListCardSkeleton() {
  return (
    <View className="bg-white rounded-xl pl-6 pr-4 py-4 mb-4 border border-natural-200 shadow-sm mx-4 relative overflow-hidden">
      <View className="absolute top-0 bottom-0 left-0 w-1 bg-natural-200" />
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </View>
        <View className="items-end">
          <Skeleton height={20} width={50} borderRadius={4} />
        </View>
      </View>
      <View className="h-[1px] bg-natural-100 mb-3" />
      <View className="flex-row justify-between items-center mb-2">
        <Skeleton height={16} width="30%" />
        <Skeleton height={16} width="40%" />
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Skeleton height={16} width="20%" />
        <Skeleton height={16} width="25%" />
      </View>
    </View>
  );
}

export function SummaryCardSkeleton() {
  return (
    <View className="flex-1 bg-white rounded-xl p-4 border border-natural-200 shadow-sm">
      <View className="flex-row items-center gap-x-2 mb-4">
        <Skeleton height={32} width={32} borderRadius={16} />
        <Skeleton height={16} width={60} />
      </View>
      <Skeleton height={28} width="80%" className="mb-2" />
      <Skeleton height={14} width="60%" />
    </View>
  );
}

export function GSTLiabilityCardSkeleton() {
  return (
    <View className="mx-4 bg-white rounded-xl p-5 border border-natural-200 shadow-sm">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-x-3">
          <Skeleton height={40} width={40} borderRadius={20} />
          <Skeleton height={20} width={120} />
        </View>
        <Skeleton height={32} width={100} />
      </View>
      <View className="h-[1px] bg-natural-200 mb-4" />
      <View className="flex-row justify-between">
        <View>
          <Skeleton height={14} width={60} className="mb-2" />
          <Skeleton height={20} width={90} />
        </View>
        <View className="items-end">
          <Skeleton height={14} width={50} className="mb-2" />
          <Skeleton height={20} width={80} />
        </View>
      </View>
    </View>
  );
}

export function DetailsSkeleton() {
  return (
    <View className="flex-1 p-4 bg-natural-50">
      <View className="flex-row items-center mb-6">
        <Skeleton height={40} width={40} borderRadius={20} className="mr-4" />
        <View className="flex-1">
          <Skeleton height={24} width="70%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </View>
      </View>
      
      <Skeleton height={100} className="w-full rounded-2xl mb-4" />
      <Skeleton height={150} className="w-full rounded-2xl mb-4" />
      <Skeleton height={200} className="w-full rounded-2xl" />
    </View>
  );
}
