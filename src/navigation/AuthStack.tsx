import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../features/onboarding/screens/SplashScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import OTPVerificationScreen from '../features/auth/screens/OTPVerificationScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
