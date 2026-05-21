import React from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { FONT, typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { useTranslation } from '../../../hooks/useTranslation';
import { Routes } from '../../../constants/routes';
import { wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useLogin } from '../hooks/useLogin';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

const LoginScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { signInWithGoogle, loading, error } = useLogin();

  const OTPVerification = () => {
    navigation.navigate(Routes.OTP_VERIFICATION);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <AppText style={styles.welcomeText}>{t('welcomeBack')}</AppText>
        </View>

        <View style={styles.formContainer}>
          <AppText style={styles.tabText}>{t('login')}</AppText>

          <View style={styles.inputSection}>
            <Input
              label={t('numberEmail')}
              placeholder={t('enterNumberEmail')}
              style={styles.placeholder}
              inputContainerStyle={styles.inputContainer}
              placeholderTextColor={colors.textSecondary}
            />
            <AppText style={styles.helperText}>
              {t('loginHelper')}
            </AppText>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          {error && (
            <AppText style={styles.errorText}>
              {error}
            </AppText>
          )}

          <GoogleSignInButton
            onPress={signInWithGoogle}
            loading={loading}
            style={styles.googleButton}
          />

          <View style={styles.actionButtons}>
            <Button
              title={t('whatsapp')}
              variant="whatsapp"
              style={styles.halfButton}
              onPress={OTPVerification}
            />
            <Button
              title={t('email')}
              variant="primary"
              style={styles.halfButton}
              onPress={OTPVerification}
            />
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
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.m,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  tabText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.l,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: colors.text,
  },
  inputSection: {
    marginBottom: spacing.l,
  },
  helperText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  googleButton: {
    marginBottom: spacing.l,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  halfButton: {
    flex: 1,
    height: hp(6)
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: wp(2),
  },
});

export default LoginScreen;
