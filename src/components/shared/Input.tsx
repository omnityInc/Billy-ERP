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
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </Text>
      )}
      <View className={`border border-natural-200 rounded-lg bg-white px-4 flex-row ${props.multiline ? 'min-h-[56px] py-3 items-start' : 'h-14 items-center'} ${error ? 'border-red-500' : ''}`}>
        {leftIcon && <View className={`mr-2 ${props.multiline ? 'mt-0.5' : ''}`}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          className={`flex-1 text-sm text-black ${props.multiline ? '' : 'h-full'} ${className}`}
          placeholderTextColor="#9CA3AF"
          textAlignVertical={props.multiline ? "top" : "center"}
          {...props}
        />
        {rightIcon && <View className={`ml-2 ${props.multiline ? 'mt-0.5' : ''}`}>{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';
