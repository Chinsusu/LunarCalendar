import React from 'react';
import { View, Text, ViewProps, TextStyle } from 'react-native';

export interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'good' | 'bad' | 'neutral' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  style,
  className,
  textStyle,
  ...props
}: BadgeProps) {
  const variantClasses = {
    good: 'bg-good-hour border-good-hour-dark',
    bad: 'bg-bad-hour border-bad-hour-dark',
    neutral: 'bg-gray-100 border-gray-300',
    primary: 'bg-primary border-primary',
  };

  const textVariantClasses = {
    good: 'text-good-hour-dark',
    bad: 'text-bad-hour-dark',
    neutral: 'text-gray-700',
    primary: 'text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={`rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      style={style}
      {...props}
    >
      <Text
        className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}
