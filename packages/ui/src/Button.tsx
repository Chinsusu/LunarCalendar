import React from 'react';
import { Pressable, Text, PressableProps, TextStyle, Platform } from 'react-native';

export interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  textStyle?: TextStyle;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  style,
  className,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary active:bg-red-700',
    secondary: 'bg-gray-200 active:bg-gray-300',
    ghost: 'bg-transparent active:bg-gray-100',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    ghost: 'text-primary',
  };

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const disabledClass = disabled ? 'opacity-50' : '';

  // Add hover effect for web
  const hoverClass = Platform.OS === 'web' && variant === 'primary' && !disabled
    ? 'hover:bg-red-700 transition-colors'
    : '';

  return (
    <Pressable
      className={`rounded-lg items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${hoverClass} ${className || ''}`}
      style={style}
      disabled={disabled}
      {...props}
    >
      <Text
        className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        style={textStyle}
      >
        {children}
      </Text>
    </Pressable>
  );
}
