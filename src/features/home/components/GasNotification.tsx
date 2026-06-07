import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useNotification } from '../../../context/NotificationContext';

export const GasNotification: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { gasNotificationData, acceptOffer, rejectOffer } = useNotification();

  const imageSource = gasNotificationData?.sellerPhotoURL
    ? { uri: gasNotificationData.sellerPhotoURL }
    : require('../../../assets/images/notificationcylinder.png');

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={imageSource}
            style={styles.storeImage}
          />
          <View style={styles.storeDetails}>
            <View style={styles.titleRow}>
              <AppText color={colors.secondary} style={styles.storeName}>
                {gasNotificationData?.sellerName || t('gas_cylinder_store')}
              </AppText>
              <AppText style={styles.priceText}>
                {t('price_label') || 'Price:'}{' '}
                <AppText style={styles.priceValue}>
                  {gasNotificationData?.price || '20'}{t('currency') || '$'}
                </AppText>
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.iconPlaceholder} />
                <AppText style={styles.infoText}>
                  {gasNotificationData?.estimatedTime || '20'} {t('mins')}
                </AppText>
              </View>
              <View style={styles.infoItem}>
                <AppText style={[styles.infoText, { color: colors.orange }]}>★ </AppText>
                <AppText style={styles.infoText}>
                  {gasNotificationData?.rating || '4.5'} {t('ratings')}
                </AppText>
              </View>
            </View>

            <View style={styles.paymentRow}>
              <View style={styles.iconPlaceholder} />
              <AppText style={styles.paymentText}>
                {t('pay_by')} <AppText style={styles.paypalText}>{t('paypal')}</AppText>
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={rejectOffer}
            activeOpacity={0.8}
          >
            <AppText style={styles.rejectButtonText}>{t('reject')}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={acceptOffer}
            activeOpacity={0.8}
          >
            <AppText style={styles.acceptButtonText}>{t('accept')}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: hp(3.75),
    paddingHorizontal: wp(6),
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: wp(3.5),
  },
  header: {
    flexDirection: 'row',
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storeDetails: {
    flex: 1,
    marginLeft: wp(3),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 14,
    fontFamily: FONT.medium,
    flex: 1,
  },
  priceText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
  },
  priceValue: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: FONT.semiBold,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: wp(4),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginRight: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  paymentText: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  paypalText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: FONT.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp(2),
    gap: wp(3),
  },
  button: {
    flex: 1,
    height: hp(5),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: colors.lightGray,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  rejectButtonText: {
    color: colors.white,
    fontFamily: FONT.medium,
    fontSize: 12,
  },
  acceptButtonText: {
    color: colors.white,
    fontFamily: FONT.medium,
    fontSize: 12,
  },
});
