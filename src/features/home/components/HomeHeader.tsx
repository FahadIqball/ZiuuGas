import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { SVG } from '../../../assets';
import { useAuth } from '../../../context/AuthContext';

interface HomeHeaderProps {
  notificationOnPress: () => void;
}
export const HomeHeader: React.FC<HomeHeaderProps> = ({ notificationOnPress }: HomeHeaderProps) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { user } = useAuth();

  const displayName = user?.displayName || 'Guest';
  const avatarSource = user?.photoURL
    ? { uri: user.photoURL }
    : require('../../../assets/images/man.png');

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={avatarSource}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.greetingText}>
            {t('home_greeting')}
          </AppText>
          <AppText variant="h2" color={colors.secondary} style={styles.userName}>
            {displayName}
          </AppText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationBtn}
        activeOpacity={0.8}
        onPress={notificationOnPress}
      >
        <View style={styles.dot} />
        <SVG.Bell width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
};


const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  textContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
  },
  userName: {
    fontWeight: '700',
    fontSize: 18,
    marginTop: 2,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0086FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dot: {

    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF4D4F',
    zIndex: 1,
    borderWidth: 1.5,
    borderColor: '#0086FF',
  },
});

