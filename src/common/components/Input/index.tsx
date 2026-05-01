import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Text } from 'react-native';
import { colors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.inputPlaceholder}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.s,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 30,
    paddingHorizontal: spacing.m,
  },
  iconContainer: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    height: 50,
    ...typography.body,
    color: colors.text,
  },
});
