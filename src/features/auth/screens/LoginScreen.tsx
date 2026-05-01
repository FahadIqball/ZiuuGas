import React from 'react';
import { View, StyleSheet, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { t } from '../../../languages';

const LoginScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo-ziuu.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>{t('welcomeBack')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.tabText}>{t('login')}</Text>

          <View style={styles.inputSection}>
            <Input
              label={t('numberEmail')}
              placeholder={t('enterNumberEmail')}
            />
            <Text style={styles.helperText}>
              {t('loginHelper')}
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.actionButtons}>
            <Button
              title={t('whatsapp')}
              variant="whatsapp"
              style={styles.halfButton}
              onPress={() => navigation.navigate('OTPVerification')}
            />
            <Button
              title={t('email')}
              variant="primary"
              style={styles.halfButton}
              onPress={() => navigation.navigate('OTPVerification')}
            />
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
  inputSection: {
    marginBottom: spacing.l,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  halfButton: {
    flex: 1,
  },
});

export default LoginScreen;
