import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  
  // Base classes for the button container
  const baseContainerClasses = "h-14 rounded-lg flex-row items-center justify-center px-4 w-full";
  
  // Variant specific container classes
  const primaryContainerClasses = "bg-black";
  const secondaryContainerClasses = "bg-natural-100"; // Light gray shade

  const containerClasses = [
    baseContainerClasses,
    isPrimary ? primaryContainerClasses : secondaryContainerClasses,
    (disabled || isLoading) ? 'opacity-50' : '',
    className
  ].filter(Boolean).join(' ');

  // Text classes
  const textClasses = [
    "text-lg font-medium",
    isPrimary ? "text-white" : "text-black",
  ].filter(Boolean).join(' ');

  return (
    <TouchableOpacity
      className={containerClasses}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#000000'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text className={textClasses}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}
