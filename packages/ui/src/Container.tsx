import React from 'react';
import { View, ViewProps } from 'react-native';

export interface ContainerProps extends ViewProps {
  maxWidth?: 'calendar' | 'detail' | 'full';
  centered?: boolean;
  children: React.ReactNode;
}

export function Container({
  maxWidth = 'full',
  centered = true,
  children,
  style,
  className,
  ...props
}: ContainerProps) {
  const maxWidthClass =
    maxWidth === 'calendar'
      ? 'max-w-calendar'
      : maxWidth === 'detail'
      ? 'max-w-detail'
      : 'w-full';

  const centerClass = centered ? 'mx-auto' : '';

  return (
    <View
      className={`${maxWidthClass} ${centerClass} px-4 ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
