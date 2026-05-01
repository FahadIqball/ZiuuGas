import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { colors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={require('../../../assets/images/delivery-men.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo-ziuu.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Join As</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="User"
              variant="primary"
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            />
            <Button
              title="Store"
              variant="secondary"
              style={styles.button}
              onPress={() => { }}
            />
            <Button
              title="Partner"
              variant="secondary"
              style={styles.button}
              onPress={() => { }}
            />
            <Button
              title="Promoter"
              variant="secondary"
              style={styles.button}
              onPress={() => { }}
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
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.m,
  },
  title: {
    ...typography.h2,
    color: '#ffffff',
  },
  buttonContainer: {
    gap: spacing.m,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
