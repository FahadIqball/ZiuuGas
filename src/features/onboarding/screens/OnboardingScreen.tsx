import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, Alert } from 'react-native';
import { hp, spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Routes } from '../../../constants/routes';
import { useTranslation } from '../../../hooks/useTranslation';

const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const handleLogin = () => {
    navigation.navigate(Routes.LOGIN);
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/delivery-men.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('joinAs')}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={t('user')}
              variant="primary"
              style={styles.button}
              onPress={handleLogin}
            />
            <Button
              title={t('store')}
              variant="secondary"
              style={styles.button}
              onPress={() => navigation.navigate(Routes.SELLER_SIGNUP)}
            />
            <Button
              title={t('partner')}
              variant="secondary"
              style={styles.button}
              onPress={() => Alert.alert(t('partner'), t('coming_soon'))}
            />
            <Button
              title={t('promoter')}
              variant="secondary"
              style={styles.button}
              onPress={() => Alert.alert(t('promoter'), t('coming_soon'))}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.m,
    marginTop: 250
  },
  title: {
    ...typography.h2,
    color: '#ffffff',
  },
  buttonContainer: {
    rowGap: spacing.m,
  },
  button: {
    width: '100%',
    height: hp(6),
  },
});

export default OnboardingScreen;
