import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { SVG } from '../../../assets';

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  showEditButton?: boolean;
  onEditPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  backgroundColor,
  showEditButton = false,
  onEditPress,
}) => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const styles = useStyles(createStyles);

  const headerBgColor = backgroundColor || colors.background;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: headerBgColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={headerBgColor} />
      <View style={styles.content}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <SVG.Backbtn style={styles.backIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <AppText variant="h2" color={colors.secondary} style={styles.screenTitle}>
          {title}
        </AppText>

        {showEditButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onEditPress}
            activeOpacity={0.8}
          >
            <SVG.Edit style={styles.editIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: 20,
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(8),
    height: wp(8),
  },
  editIcon: {
    width: wp(8),
    height: wp(8),
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: FONT.semiBold,
  },
  placeholder: {
    width: 40,
  },
});
