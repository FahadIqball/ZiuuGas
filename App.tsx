import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';
import RNBootSplash from 'react-native-bootsplash';
import { LanguageProvider, useLocalization } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';

const AppContent = () => {
  const { locale } = useLocalization();

  React.useEffect(() => {
    mobileAds().initialize();

    const timeout = setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
