import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { SVG } from '../../../assets';
export const HomeSearchBar: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchIconContainer}>
          {/* Search Icon*/}
          <SVG.SearchIcon />
        </View>
        <TextInput
          style={styles.input}
          placeholder={t('search')}
          placeholderTextColor={colors.inputPlaceholder}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  searchLine: {
    width: 6,
    height: 2,
    backgroundColor: colors.secondary,
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 0,
  },
});

