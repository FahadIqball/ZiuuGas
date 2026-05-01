import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTPVerificationScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState(['4', '6', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {/* Placeholder for the chat/lock icon */}
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>💬</Text>
            </View>
          </View>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter 4-6 digit OTP we have sent to your{'\n'}Whatsapp or e-mail
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <Button
            title="Verify Code"
            variant="primary"
            onPress={() => navigation.navigate('Signup')}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Did'nt Recieve the code? </Text>
            <TouchableOpacity>
              <Text style={styles.resendAction}>Resend it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffe6cc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: spacing.m,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.otpEmpty,
    ...typography.h3,
    color: colors.text,
  },
  otpInputFilled: {
    backgroundColor: colors.otpFilled,
    color: '#ffffff',
  },
  verifyButton: {
    width: '100%',
    marginBottom: spacing.l,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  resendAction: {
    ...typography.bodySmall,
    color: colors.orange,
    fontWeight: '600',
  },
});

export default OTPVerificationScreen;
