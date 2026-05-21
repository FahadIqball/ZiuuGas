import React from 'react';
import { Text, TextStyle, TextProps, StyleProp } from 'react-native';
import { typography } from '../../../enums/typography';
import { useTheme } from '../../../hooks/useTheme';

interface AppTextProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}


export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const textColor = color || colors.text;

  return (
    <Text
      style={[
        { color: textColor },
        typography[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
