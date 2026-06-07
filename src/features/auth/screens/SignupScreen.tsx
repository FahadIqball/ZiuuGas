import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { AppText } from '../../../common/components/Typography/Typography';
import { IMAGES, SVG } from '../../../assets';
import { imageStorageRepository } from '../../../services/imageStorageService';
import { launchImageLibrary } from 'react-native-image-picker';

const SignupScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { updateProfile, user } = useAuth();

  const [name, setName] = useState(user?.displayName || '');
  const [location, setLocation] = useState(user?.location || '');
  const [photoUri, setPhotoUri] = useState<string | null>(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.location && !location) setLocation(user.location);
      if (user.photoURL && !photoUri) setPhotoUri(user.photoURL);
    }
  }, [user]);

  const handlePhotoPick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert(t('Error'), t('fill_all_fields'));
      return;
    }
    setLoading(true);
    try {
      let uploadedPhotoUrl = user?.photoURL || null;
      if (photoUri && photoUri !== user?.photoURL && !photoUri.startsWith('http')) {
        uploadedPhotoUrl = await imageStorageRepository.uploadFile(photoUri, 'profiles');
      }
      await updateProfile({
        displayName: name,
        location: location,
        photoURL: uploadedPhotoUrl,
      });
    } catch (err: any) {
      console.error('Failed to complete user signup:', err);
      Alert.alert(t('Error'), err.message || t('failed_to_send_request'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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

            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handlePhotoPick} style={styles.avatarWrapper} activeOpacity={0.7}>
                <Image
                  source={photoUri ? { uri: photoUri } : IMAGES.MAN1}
                  style={styles.avatarImage}
                />
                <View style={styles.editBadge}>
                  <SVG.Edit width={hp(2)} height={hp(2)} stroke={colors.white} />
                </View>
              </TouchableOpacity>
              <AppText color={colors.textSecondary} style={{ fontSize: 11, marginTop: spacing.s }}>
                {t('upload_image') || 'Upload Profile Picture'}
              </AppText>
            </View>

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
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Button
              title={t('signUp')}
              variant="primary"
              onPress={handleSignup}
              style={styles.signupBtn}
            />
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: hp(1.5),
  },
  avatarWrapper: {
    position: 'relative',
    borderRadius: hp(6),
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 3,
  },
  avatarImage: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(6),
    backgroundColor: colors.inputBackground,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: hp(4),
    height: hp(4),
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default SignupScreen;
