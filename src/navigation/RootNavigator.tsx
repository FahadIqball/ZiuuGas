import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import ProfileCompletionStack from './ProfileCompletionStack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { useTheme } from '../hooks/useTheme';

const Navigation = () => {
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { isDarkMode, colors } = useTheme();

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    dark: isDarkMode,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.white,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        isProfileComplete ? <MainStack /> : <ProfileCompletionStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const RootNavigator = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Navigation />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default RootNavigator;
