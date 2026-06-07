import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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

const LoginScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { signInWithGoogle, signInWithEmail, registerWithEmail, loading, error } = useLogin();
  const { targetRole = 'user' } = route.params || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailAuth = async () => {
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError(t('fill_all_fields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError(t('invalid_email') || 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError(t('weak_password') || 'Password must be at least 6 characters.');
      return;
    }

    try {
      if (isSignup) {
        await registerWithEmail(email.trim(), password, targetRole);
      } else {
        await signInWithEmail(email.trim(), password, targetRole);
      }
    } catch (err) {
      // Errors are handled inside hook and exposed via error variable
    }
  };

  const OTPVerification = () => {
    navigation.navigate(Routes.OTP_VERIFICATION, { targetRole });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <AppText style={styles.welcomeText}>
              {isSignup ? t('createAccount') : t('welcomeBack')}
            </AppText>
          </View>

          <View style={styles.formContainer}>
            <AppText style={styles.tabText}>
              {isSignup ? t('signUp') : t('login')}
            </AppText>

            <View style={styles.inputSection}>
              <Input
                label={t('email')}
                placeholder={t('enterNumberEmail')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.placeholder}
                inputContainerStyle={styles.inputContainer}
                placeholderTextColor={colors.textSecondary}
              />
              <Input
                label={t('password') || 'Password'}
                placeholder={t('enterPassword') || 'Enter Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.placeholder}
                inputContainerStyle={styles.inputContainer}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.s }} />
            ) : (
              <Button
                title={isSignup ? t('signUp') : t('login')}
                variant="primary"
                onPress={handleEmailAuth}
                style={{ height: hp(6), borderRadius: 25, marginTop: spacing.s }}
              />
            )}

            <TouchableOpacity
              onPress={() => {
                setIsSignup(!isSignup);
                setLocalError(null);
              }}
              style={{ marginTop: spacing.m, alignItems: 'center' }}
            >
              <AppText color={colors.primary} style={{ fontFamily: FONT.medium, fontSize: 13 }}>
                {isSignup ? t('alreadyHaveAccount') : t('dontHaveAccount')}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            {(error || localError) && (
              <AppText style={styles.errorText}>
                {localError || error}
              </AppText>
            )}

            <GoogleSignInButton
              onPress={() => signInWithGoogle(targetRole)}
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
            </View>
          </View>
        </ScrollView>
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
