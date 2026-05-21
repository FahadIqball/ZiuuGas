import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import { colors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'outline';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, leftIcon, rightIcon, textStyle, ...props }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'whatsapp': return colors.whatsapp;
      case 'outline': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline': return colors.primary;
      default: return '#ffffff';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.leftIcon}>
        {leftIcon}
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      </View>
      <View style={styles.rightIcon}>
        {rightIcon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: spacing.s,
    // paddingHorizontal: spacing.l,
    borderRadius: 30,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.button,
  },
  leftIcon: {
    flexDirection: 'row',
    // alignItems: "center",
    justifyContent: "center",
    gap: hp(1),
  },
  rightIcon: {
    marginRight: hp(2),
  },
});
