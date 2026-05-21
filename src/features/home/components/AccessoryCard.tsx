import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

interface AccessoryCardProps {
  title: string;
  image: any;
  rating: number;
  reviews: number;
  price: number;
  onPress?: () => void;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({
  title,
  image,
  rating,
  reviews,
  price,
  onPress,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <AppText variant="weight" color={colors.secondary} numberOfLines={1} style={styles.title}>
            {title}
          </AppText>

          <View style={styles.ratingRow}>
            <AppText color={colors.orange} style={styles.star}>★ </AppText>
            <AppText color={colors.textSecondary} style={styles.ratingText}>
              {rating}({reviews} {t('reviews')})
            </AppText>
          </View>

          <View style={styles.priceRow}>
            <AppText color={colors.textSecondary} style={styles.priceLabel}>
              {t('price_label')}
            </AppText>
            <AppText variant="bodySmall" color={colors.primary} style={styles.priceValue}>
              {price}{t('currency')}
            </AppText>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
        <AppText variant="bodySmall" color={colors.white} style={styles.buttonText}>
          {t('view_details')}
        </AppText>
      </TouchableOpacity>
    </Card>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    marginHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: hp('3%'),
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(1),

  },
  imageContainer: {
    marginRight: 5,
  },
  image: {
    width: hp(6),
    height: hp(5),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.secondary,
    lineHeight: 15,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.2),
  },
  star: {
    fontSize: 10,
  },
  ratingText: {
    fontFamily: FONT.regular,
    fontSize: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.2),
  },
  priceLabel: {
    fontFamily: FONT.medium,
    fontSize: 12,
  },
  priceValue: {
    fontFamily: FONT.semiBold,
    fontSize: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: hp('3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp(1.7),
  },
  buttonText: {
    fontFamily: FONT.medium,
    fontSize: 10,
  },
});
