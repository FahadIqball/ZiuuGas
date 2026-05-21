import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Text, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { FONT, typography } from '../../../enums/typography';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  style,
  containerStyle,
  inputContainerStyle,
  rightIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.inputPlaceholder}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>
          {rightIcon}
        </View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    color: colors.secondary,
    marginBottom: spacing.s,
    fontFamily: FONT.medium,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
  },
  iconContainer: {
    marginLeft: spacing.s
    // marginRight: spacing.s,
  },
  input: {
    flex: 1,
    minHeight: 50,
    ...typography.body,
    color: colors.inputPlaceholder,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s,
  },
  rightIconContainer: {
    marginRight: spacing.m,
  },
});
