import React from 'react';
import { View, Text, ViewProps, Platform } from 'react-native';

export interface HourCardProps extends ViewProps {
  chi: string;
  timeRange: string;
  starName: string;
  canChi: string;
  isGood: boolean;
}

export function HourCard({
  chi,
  timeRange,
  starName,
  canChi,
  isGood,
  style,
  className,
  ...props
}: HourCardProps) {
  const bgClass = isGood ? 'bg-good-hour' : 'bg-bad-hour';
  const hoverClass = Platform.OS === 'web' ? 'hover:shadow-md transition-shadow' : '';

  return (
    <View
      className={`rounded-lg p-3 items-center ${bgClass} ${hoverClass} ${className || ''}`}
      style={[{ minWidth: 100 }, style]}
      {...props}
    >
      <Text className="text-base font-bold text-gray-900">{chi}</Text>
      <Text className="text-xs text-gray-600 mt-1">{timeRange}</Text>
      <Text className="text-xs text-gray-700 mt-2">{starName}</Text>
      <Text className="text-xs text-gray-500 mt-1">{canChi}</Text>
    </View>
  );
}
