import React from 'react';
import { View, ViewProps } from 'react-native';

export interface GridProps extends ViewProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}

export function Grid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  style,
  className,
  ...props
}: GridProps) {
  const { mobile = 1, tablet = 2, desktop = 3 } = columns;

  // Generate grid columns classes
  const gridCols = `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  const gapClass = `gap-${gap}`;

  return (
    <View
      className={`grid ${gridCols} ${gapClass} ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
