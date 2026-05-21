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

interface ProductCardProps {
  title: string;
  subtitle: string;
  image: any;
  onPress?: () => void;
  onRequestOffer?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, subtitle, image, onPress, onRequestOffer }) => {
  const parts = title.split(' ');
  const mainTitle = parts[0];
  const weight = parts.slice(1).join(' ');
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Card style={styles.container}>
      <TouchableOpacity 
        style={styles.contentWrapper} 
        activeOpacity={0.7} 
        onPress={onPress}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <AppText variant="weight" color={colors.secondary}>{mainTitle} </AppText>
              <AppText variant="kg" color={colors.primary}>{weight}</AppText>
            </View>
            <AppText variant="product" color={colors.textSecondary}>{subtitle}</AppText>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8} 
        onPress={onRequestOffer || onPress}
      >
        <AppText variant="bodySmall" color={colors.inputBackground} style={styles.buttonText}>
          {t('request_offer')}
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
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: hp('3%'),
    backgroundColor: colors.white,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    gap: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 5,
  },
  image: {
    width: wp(7.5),
    height: hp(8.5),
  },
  textContainer: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp(1.7),
  },
  buttonText: {
    fontFamily: FONT.medium,
    fontSize: 10,
  },
});
