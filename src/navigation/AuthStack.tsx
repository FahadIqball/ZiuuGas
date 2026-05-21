import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../features/onboarding/screens/SplashScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import OTPVerificationScreen from '../features/auth/screens/OTPVerificationScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import SellerSignupScreen from '../features/auth/screens/SellerSignupScreen';
import { Routes } from '../constants/routes';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={Routes.SPLASH}>
      <Stack.Screen name={Routes.SPLASH} component={SplashScreen} />
      <Stack.Screen name={Routes.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={Routes.OTP_VERIFICATION} component={OTPVerificationScreen} />
      <Stack.Screen name={Routes.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={Routes.SELLER_SIGNUP} component={SellerSignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
