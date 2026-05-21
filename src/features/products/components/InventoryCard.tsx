import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { FONT } from '../../../enums/typography';

interface InventoryCardProps {
  title: string;
  stock: number;
  price: string | number;
  image: ImageSourcePropType;
  subtitle?: string;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ title, stock, price, image, subtitle }) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const renderTitle = () => {
    const regex = /^(Weight)\s+(.*?(?:kg|liter))\s+(.*)$/i;
    const match = title.match(regex);

    if (match) {
      const [_, prefix, value, suffix] = match;
      return (
        <AppText style={styles.title}>
          <AppText style={styles.titlePart}>{prefix} </AppText>
          <AppText style={styles.weightPart}>{value} </AppText>
          <AppText style={styles.suffixPart}>{suffix}</AppText>
        </AppText>
      );
    }

    return (
      <AppText style={styles.title}>
        <AppText style={styles.titlePart}>{title}</AppText>
      </AppText>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        {renderTitle()}
        <AppText style={styles.stock}>{stock} {t('inStock')}</AppText>
      </View>
      <View style={styles.priceContainer}>
        <AppText style={styles.priceLabel}>
          {t('price_label')} <AppText style={styles.priceValue}>{t('currency')}{price}</AppText>
        </AppText>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: spacing.m,
    alignItems: 'center',
  },
  imageContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: FONT.regular,
  },
  titlePart: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: FONT.regular,
  },
  weightPart: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: FONT.medium,
  },
  suffixPart: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: FONT.regular,
  },
  subtitlePart: {
    color: colors.inputPlaceholder,
    fontSize: 12,
    fontFamily: FONT.regular,
  },
  stock: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
    marginTop: hp(0.5),
  },
  priceContainer: {
    marginTop: hp(3),
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.secondary,
  },
  priceValue: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.primary,
  },
});
