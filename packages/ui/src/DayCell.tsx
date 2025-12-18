import React from 'react';
import { Pressable, Text, PressableProps, Platform } from 'react-native';

export interface DayCellProps extends PressableProps {
  solarDay: number;
  lunarDay: number;
  lunarMonth?: number;
  isToday?: boolean;
  isHoangDao?: boolean;
  isSunday?: boolean;
  isFirstLunarDay?: boolean;
}

export function DayCell({
  solarDay,
  lunarDay,
  lunarMonth,
  isToday = false,
  isHoangDao = false,
  isSunday = false,
  isFirstLunarDay = false,
  style,
  className,
  ...props
}: DayCellProps) {
  const bgClass = isToday
    ? 'bg-primary'
    : isHoangDao
    ? 'bg-hoang-dao'
    : '';

  const hoverClass = Platform.OS === 'web' ? 'hover:scale-105 transition-transform cursor-pointer' : '';

  const solarTextClass = isToday
    ? 'text-white'
    : isSunday
    ? 'text-primary'
    : 'text-gray-900';

  const lunarTextClass = isToday
    ? 'text-white'
    : isFirstLunarDay
    ? 'text-primary font-semibold'
    : 'text-gray-500';

  return (
    <Pressable
      className={`aspect-square items-center justify-center p-1 rounded-lg ${bgClass} ${hoverClass} ${className || ''}`}
      style={style}
      {...props}
    >
      <Text className={`text-base font-medium ${solarTextClass}`}>
        {solarDay}
      </Text>
      <Text className={`text-xs ${lunarTextClass}`}>
        {isFirstLunarDay ? `${lunarDay}/${lunarMonth}` : lunarDay}
      </Text>
    </Pressable>
  );
}
