import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../features/auth/screens/SignupScreen';
import SellerSignupScreen from '../features/auth/screens/SellerSignupScreen';
import { Routes } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const ProfileCompletionStack = () => {
  const { userRole } = useAuth();
  
  // Sellers complete profile on SellerSignupScreen, others on SignupScreen
  const initialRouteName = userRole === 'seller' ? Routes.SELLER_SIGNUP : Routes.SIGNUP;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name={Routes.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={Routes.SELLER_SIGNUP} component={SellerSignupScreen} />
    </Stack.Navigator>
  );
};

export default ProfileCompletionStack;
