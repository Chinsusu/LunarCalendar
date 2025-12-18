import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  shadow = 'sm',
  padding = 'md',
  style,
  className,
  ...props
}: CardProps) {
  const shadowClass =
    shadow === 'none'
      ? ''
      : shadow === 'sm'
      ? 'shadow-sm'
      : shadow === 'md'
      ? 'shadow-md'
      : 'shadow-lg';

  const paddingClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
      ? 'p-2'
      : padding === 'md'
      ? 'p-4'
      : 'p-6';

  return (
    <View
      className={`bg-white rounded-xl ${shadowClass} ${paddingClass} ${className || ''}`}
      style={[{ elevation: shadow === 'sm' ? 1 : shadow === 'md' ? 2 : shadow === 'lg' ? 3 : 0 }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
