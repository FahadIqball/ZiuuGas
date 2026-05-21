import React, { useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../../hooks/useTranslation';
import { Routes } from '../../../constants/routes';
import { AppText } from '../../../common/components/Typography/Typography';
import { useAuth } from '../../../context/AuthContext';

const OTPVerificationScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState(['4', '6', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { login } = useAuth();

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

  const handleVerifyCode = async () => {
    try {
      await login('user');
    } catch (err) {
      console.error('OTP verify login failed:', err);
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
            <Image
              source={require('../../../assets/images/verification.png')}
              style={styles.iconPlaceholder}
              resizeMode="contain"
            />
          </View>
          <AppText style={styles.title}>{t('verificationCode')}</AppText>
          <AppText style={styles.subtitle}>
            {t('otpInstruction')}
          </AppText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputs.current[index] = ref; }}
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
                placeholderTextColor={colors.textSecondary}
              />
            ))}
          </View>

          <Button
            title={t('verifyCode')}
            variant="primary"
            onPress={handleVerifyCode}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <AppText style={styles.resendText}>{t('didntReceive')}</AppText>
            <TouchableOpacity>
              <AppText style={styles.resendAction}>{t('resendCode')}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 3,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: hp(6)
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
