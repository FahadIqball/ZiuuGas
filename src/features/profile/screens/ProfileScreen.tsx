import { StatusBar, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { ProfileHeader } from '../components/ProfileHeader'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, wp } from '../../../enums/spacing'
import { AppText } from '../../../common/components/Typography/Typography'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FONT } from '../../../enums/typography'
import ProfileButton from '../components/ProfileButton'
import { SVG } from '../../../assets'
import { LogoutModal } from '../components/LogoutModal'
import { LanguageModal } from '../components/LanguageModal'
import { ThemeModal } from '../components/ThemeModal'
import { Routes } from '../../../constants/routes';
import { useTranslation } from '../../../hooks/useTranslation'
import { useAuth } from '../../../context/AuthContext'
const ProfileScreen = ({ navigation }: any) => {
  const { logout, userRole } = useAuth();
  const { changeLanguage, locale, t } = useTranslation();
  const { themeMode, setThemeMode, isDarkMode, colors } = useTheme();
  const styles = useStyles(createStyles);
  const isSeller = userRole === 'seller';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  const handleLanguageChange = () => {
    setIsLanguageModalVisible(true);
  };

  const handleThemeChange = () => {
    setIsThemeModalVisible(true);
  };

  const handleAccept = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
    }
    setIsModalVisible(false);
  };

  const navigateToProfileInfo = () => {
    navigation.navigate(Routes.PROFILE_INFO)
  }

  const navigateToWallet = () => {
    navigation.navigate(Routes.WALLET)
  }

  const navigateToAddress = () => {
    navigation.navigate(Routes.ADDRESS)
  }

  const navigateToDeliveryPerson = () => {
    navigation.navigate(Routes.DELIVERY_PERSON)
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.lightBlue} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.contentContainer}>
          {/* HEADER */}
          <View style={styles.topSection}>
            <ProfileHeader />
          </View>
          {/* MY PROFILE Section */}
          <View style={styles.myProfile}>
            <AppText style={styles.myProfileText}>
              {t('myProfile')}
            </AppText>
          </View>
          {/* PROFILE CONTENT */}
          <View style={styles.profileContent}>
            <ProfileButton
              title={isSeller ? t('store_information') : t('information')}
              onPress={navigateToProfileInfo}
              leftIcon={<SVG.Information style={styles.icon} />}
              rightIcon={<SVG.ForwardBtn style={styles.icon} />}
            />
            <ProfileButton
              title={t('wallet')}
              onPress={navigateToWallet}
              leftIcon={<SVG.Wallet style={styles.icon} />}
              rightIcon={<SVG.ForwardBtn style={styles.icon} />}
            />
            <ProfileButton
              title={t('addresses')}
              onPress={navigateToAddress}
              leftIcon={<SVG.Addresses style={styles.icon} />}
              rightIcon={<SVG.ForwardBtn style={styles.icon} />}
            />
            {isSeller && (
              <ProfileButton
                title={t('delivery_person')}
                onPress={navigateToDeliveryPerson}
                leftIcon={<SVG.DeliveryBike style={styles.icon} />}
                rightIcon={<SVG.ForwardBtn style={styles.icon} />}
              />
            )}
            <ProfileButton
              title={t('language')}
              onPress={handleLanguageChange}
              leftIcon={<SVG.Language style={styles.icon} />}
              rightIcon={
                <View style={styles.languageRightContainer}>
                  <AppText style={styles.localeText}>
                    {locale === 'en' ? 'English' : locale === 'es' ? 'Español' : 'Português'}
                  </AppText>
                  <SVG.ForwardBtn style={styles.icon} />
                </View>
              }
            />
            <ProfileButton
              title={t('theme')}
              onPress={handleThemeChange}
              leftIcon={<SVG.Theme style={styles.icon} />}
              rightIcon={
                <View style={styles.languageRightContainer}>
                  <AppText style={styles.localeText}>
                    {themeMode === 'light' ? t('light') : themeMode === 'dark' ? t('dark') : t('system')}
                  </AppText>
                  <SVG.ForwardBtn style={styles.icon} />
                </View>
              }
            />
            <ProfileButton
              title={t('logout')}
              onPress={handleAccept}
              leftIcon={<SVG.Logout style={styles.icon} />}
            />
          </View>
          <LogoutModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            onConfirm={handleLogout}
          />
          <LanguageModal
            visible={isLanguageModalVisible}
            onClose={() => setIsLanguageModalVisible(false)}
            onSelect={(selectedCode) => changeLanguage(selectedCode)}
            selectedLocale={locale}
          />
          <ThemeModal
            visible={isThemeModalVisible}
            onClose={() => setIsThemeModalVisible(false)}
            onSelect={(selectedMode) => setThemeMode(selectedMode)}
            selectedThemeMode={themeMode}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ProfileScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    backgroundColor: colors.lightBlue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: hp(12),
    paddingTop: hp(2),
  },
  myProfile: {
    paddingHorizontal: wp(7),
    marginTop: hp(2),
  },
  myProfileText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: colors.secondary
  },
  profileContent: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: "space-between",
    alignContent: "space-between",
    paddingHorizontal: wp(7),
  },
  icon: {
    width: hp(2.5),
    height: hp(2.5),
    marginLeft: hp(2),
  },
  languageRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  localeText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: colors.textSecondary,
  }
})
