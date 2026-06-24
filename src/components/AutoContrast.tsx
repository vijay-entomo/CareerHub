import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { getContrastColor } from '@/constants/theme';
import { LucideIcon, LucideProps } from 'lucide-react-native';

interface AutoContrastTextProps extends TextProps {
  bgColor: string;
}

export const AutoContrastText = ({ bgColor, style, ...props }: AutoContrastTextProps) => {
  const contrastColor = getContrastColor(bgColor);
  
  return (
    <Text 
      style={[style, { color: contrastColor }]} 
      {...props} 
    />
  );
};

interface AutoContrastIconProps extends Omit<LucideProps, 'color'> {
  Icon: LucideIcon;
  bgColor: string;
}

export const AutoContrastIcon = ({ Icon, bgColor, ...props }: AutoContrastIconProps) => {
  const contrastColor = getContrastColor(bgColor);
  
  return (
    <Icon 
      color={contrastColor} 
      {...props} 
    />
  );
};
