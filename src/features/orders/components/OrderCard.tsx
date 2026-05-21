import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { Routes } from '../../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';

interface OrderCardProps {
  title: string;
  subtitle: string;
  image: any;
  buttonText: string;
  onPress?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ title, subtitle, image, buttonText, onPress }) => {
  const navigation = useNavigation<any>();
  const parts = title.split(' ');
  const mainTitle = parts[0];
  const weight = parts.slice(1).join(' ');
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
          <View style={styles.titleRow}>
            <AppText variant="weight" color={colors.secondary}>{t(mainTitle as TxKeyPath)} </AppText>
            <AppText variant="kg" color={colors.primary}>{weight}</AppText>
          </View>
          <AppText variant="product" color={colors.textSecondary}>
            {(() => {
              const lowerKey = subtitle.toLowerCase();
              const trans = t(lowerKey as TxKeyPath);
              return trans === lowerKey ? subtitle : trans;
            })()}
          </AppText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onPress || (() => navigation.navigate(Routes.ORDER_DETAILS))}
      >
        <AppText style={styles.buttonText}>
          {buttonText}
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
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('5%'),
    borderRadius: hp('3%'),
    backgroundColor: colors.white,
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
    marginTop: hp('2.3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp(2.5),
  },
  buttonText: {
    color: colors.white,
    fontFamily: FONT.medium,
    fontSize: 10,
  },
});
