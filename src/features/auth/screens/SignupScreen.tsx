import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing, wp } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { AppText } from '../../../common/components/Typography/Typography';

const SignupScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert(t('Error'), t('fill_all_fields'));
      return;
    }
    try {
      await updateProfile({
        displayName: name,
        location: location,
      });
    } catch (err: any) {
      console.error('Failed to complete user signup:', err);
      Alert.alert(t('Error'), err.message || t('failed_to_send_request'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <AppText style={styles.welcomeText}>{t('createAccount')}</AppText>
          </View>

          <View style={styles.formContainer}>
            <AppText style={styles.tabText}>{t('signUp')}</AppText>

            <View style={styles.inputSection}>
              <Input
                label={t('name')}
                placeholder={t('enterName')}
                value={name}
                onChangeText={setName}
                inputContainerStyle={styles.inputContainer}
                placeholderTextColor={colors.textSecondary}
              />
              <Input
                label={t('location')}
                placeholder={t('enterLocation')}
                value={location}
                onChangeText={setLocation}
                inputContainerStyle={styles.inputContainer}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            title={t('signUp')}
            variant="primary"
            onPress={handleSignup}
            style={styles.signupBtn}
          />
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
  scrollContent: {
    flexGrow: 1,
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
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
  },
  signupBtn: {
    height: hp(6)
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: wp(2.5),
  },
});

export default SignupScreen;
