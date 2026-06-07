import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { useNotification } from '../../../context/NotificationContext';
import { FONT } from '../../../enums/typography';
import { hp, wp } from '../../../enums/spacing';
import { Routes } from '../../../constants/routes';

import { resolveProductImage } from '../../products/utils/imageResolver';

interface ActiveOrderBannerProps {
  navigation: any;
}

export const ActiveOrderBanner: React.FC<ActiveOrderBannerProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { activeOrderData } = useNotification();

  const handleTrackOrder = () => {
    if (activeOrderData?.id) {
      navigation.navigate(Routes.TRACK_ORDER, { orderId: activeOrderData.id });
    }
  };

  const imageSource = activeOrderData?.sellerImage
    ? { uri: activeOrderData.sellerImage }
    : require('../../../assets/images/notificationcylinder.png');

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Image
            source={imageSource}
            style={styles.shopImage}
          />
          <View style={styles.details}>
            <AppText variant="bodySmall" color={colors.secondary} style={styles.shopName}>
              {activeOrderData?.sellerName || t('gas_cylinder_store')}
            </AppText>
            <View style={styles.stats}>
              <View style={styles.statIconPlaceholder} />
              <AppText style={styles.statText}>
                {activeOrderData?.estimatedDeliveryMin || '20'} {t('mins')}
              </AppText>
              <AppText style={styles.statText}>
                {t('order_no')} #{activeOrderData?.orderCode || '00000'}
              </AppText>
              <AppText style={styles.priceText}>
                {t('price')}{' '}
                <AppText style={styles.priceValue}>
                  {activeOrderData?.totalPrice || '20'}{t('currency') || '$'}
                </AppText>
              </AppText>
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleTrackOrder}>
          <AppText color={colors.primary} style={styles.trackText}>
            {t('track_order')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  container: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightBlueBorder,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shopImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(23),
    marginRight: 12,
    backgroundColor: colors.white,
  },
  details: {
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 9.13,
    fontFamily: FONT.medium,
    color: colors.secondary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconPlaceholder: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    marginRight: 4,
  },
  statText: {
    fontSize: 7.83,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
    marginRight: wp(2)
  },
  priceText: {
    fontSize: 7.83,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
  },
  priceValue: {
    color: colors.primary,
    fontSize: 9.13,
    fontFamily: FONT.semiBold,
  },
  trackText: {
    marginTop: hp(2),
    fontFamily: FONT.medium,
    fontSize: 7.83,
    color: colors.primary,
    paddingLeft: 10,
  },
});

