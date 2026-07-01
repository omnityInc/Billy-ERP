import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm text-black mb-2">
          {label}
          {required && <Text className="text-danger">*</Text>}
        </Text>
      )}
      <View className={`h-14 border border-natural-200 rounded-lg bg-white px-4 flex-row items-center ${error ? 'border-danger' : ''}`}>
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          ref={ref}
          className={`flex-1 text-sm text-black h-full ${className}`}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';
