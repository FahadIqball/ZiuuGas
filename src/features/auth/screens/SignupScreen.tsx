import React from 'react';
import { View, StyleSheet, Image, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo-ziuu.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Create An Account</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.tabText}>Sign Up</Text>

            <View style={styles.inputSection}>
              <Input
                label="Name"
                placeholder="Enter your name"
              />
              <Input
                label="Location"
                placeholder="Enter your location"
              // Ideally add icon here
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            title="Sign Up"
            variant="primary"
            onPress={() => navigation.navigate('Home')}
          />
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
});

export default SignupScreen;
