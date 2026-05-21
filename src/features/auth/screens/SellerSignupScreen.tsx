import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing, wp } from '../../../enums/spacing';
import { FONT, typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { AreaSlider } from '../../../common/components/AreaSlider';
import { MapPreview } from '../../../common/components/MapPreview';
import { IMAGES, SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { useLogin } from '../hooks/useLogin';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { storage } from '../../../utils/storage';

const SellerSignupScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { login, updateProfile, isAuthenticated, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [areaInKm, setAreaInKm] = useState(15);
  const { signInWithGoogle, loading, error } = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggingIn(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      if (user.cnpj) setCnpj(user.cnpj);
      if (user.address) setAddress(user.address);
      if (user.areaInKm) setAreaInKm(user.areaInKm);
    }
  }, [user]);

  const handleGoogleSignup = async () => {
    try {
      // If the seller pre-filled details (and not logging in), cache them. Do not block sign-in if empty.
      if (!isLoggingIn && (cnpj.trim() || address.trim())) {
        storage.set('PENDING_SELLER_INFO', JSON.stringify({ cnpj, address, areaInKm }));
      }
      await signInWithGoogle('seller');
    } catch (err) {
      console.error('Google Sign-up/Login failed for Seller:', err);
      storage.remove('PENDING_SELLER_INFO');
    }
  };

  const handleSignupPress = async () => {
    if (isLoggingIn) {
      try {
        await login('seller');
      } catch (err: any) {
        console.error('Seller login failed:', err);
        Alert.alert(t('Error'), err.message || t('failed_to_send_request'));
      }
      return;
    }

    if (!cnpj.trim() || !address.trim()) {
      Alert.alert(t('Error'), t('fill_all_fields'));
      return;
    }
    try {
      if (isAuthenticated) {
        await updateProfile({
          cnpj,
          address,
          areaInKm,
          displayName: user?.displayName || t('gas_store'),
        });
      } else {
        await login('seller', {
          cnpj,
          address,
          areaInKm,
          displayName: t('gas_store'),
        });
      }
    } catch (err: any) {
      console.error('Seller signup failed:', err);
      Alert.alert(t('Error'), err.message || t('failed_to_send_request'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <AppText style={styles.welcomeText}>
              {isLoggingIn ? t('welcomeBack') : t('createAccount')}
            </AppText>
          </View>

          <View style={styles.formContainer}>
            <AppText style={styles.tabText}>
              {isLoggingIn ? t('login') : t('signUp')}
            </AppText>

            {!isLoggingIn && (
              <View style={styles.inputSection}>
                <Input
                  label={t('addCnpjCpf')}
                  placeholder={t('enterCnpjCpf')}
                  value={cnpj}
                  onChangeText={setCnpj}
                  inputContainerStyle={styles.inputContainer}
                  placeholderTextColor={colors.textSecondary}
                />
                <Input
                  label={t('addressLabel')}
                  placeholder={t('enterAddress')}
                  value={address}
                  onChangeText={setAddress}
                  icon={<SVG.Pin style={styles.icon} />}
                  inputContainerStyle={styles.inputContainer}
                  placeholderTextColor={colors.textSecondary}
                />

                <AppText style={styles.areaLabel}>{t('areaOfOperation')}</AppText>
                <AreaSlider
                  value={areaInKm}
                  onValueChange={(val) => setAreaInKm(Array.isArray(val) ? val[0] : val)}
                />

                <View style={styles.mapContainer}>
                  {/* <MapPreview radiusInKm={areaInKm} /> */}
                  <Image source={IMAGES.MAP} style={styles.mapImage} />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          {error && (
            <AppText style={styles.errorText}>
              {error}
            </AppText>
          )}

          <GoogleSignInButton
            onPress={handleGoogleSignup}
            loading={loading}
            style={styles.googleBtn}
          />

          <Button
            title={isLoggingIn ? t('login') : t('signUp')}
            variant="primary"
            onPress={handleSignupPress}
            style={styles.signupBtn}
          />

          {!isAuthenticated && (
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setIsLoggingIn(!isLoggingIn)}
            >
              <AppText style={styles.toggleText}>
                {isLoggingIn ? t('dontHaveAccount') : t('alreadyHaveAccount')}
              </AppText>
            </TouchableOpacity>
          )}
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
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.l,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.m,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.secondary,
  },
  formContainer: {
    paddingHorizontal: spacing.l,
  },
  tabText: {
    ...typography.h3,
    fontFamily: FONT.medium,
    color: colors.primary,
    marginBottom: spacing.s,
  },
  inputSection: {
    // marginBottom: spacing.l,
  },
  areaLabel: {
    ...typography.body,
    color: colors.secondary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    paddingTop: spacing.m,
  },
  googleBtn: {
    marginBottom: spacing.s,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  signupBtn: {
    height: hp(6)
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.s,
  },
  toggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  mapContainer: {
    height: hp(15),
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: spacing.m,
  },
  mapImage: {
    resizeMode: 'cover',
    height: "100%",
    width: "100%",
    borderRadius: spacing.m,
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: wp(2),
  },
  icon: {
    height: hp(2.5),
    width: wp(2.5)
  }
});

export default SellerSignupScreen;
