import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { usePartnerDeliveries } from '../hooks/usePartnerDeliveries';
import { IMAGES } from '../../../assets';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { Card } from '../../../common/components/Card/Card';
import { Routes } from '../../../constants/routes';

const ActiveDeliveriesScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { activeJob, isLoading, refreshJobs, pickupOrder } = usePartnerDeliveries();

  const handleCall = () => {
    Linking.openURL('tel:1234567890');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=1234567890');
  };

  const handlePickedUp = async () => {
    if (!activeJob) return;
    try {
      await pickupOrder(activeJob.orderId);
    } catch (err) {
      console.error('Failed to update status to dispatched:', err);
    }
  };

  const handleArrived = () => {
    if (!activeJob) return;
    navigation.navigate(Routes.DELIVERY_CONFIRMATION, { orderId: activeJob.orderId });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!activeJob) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={t('active_jobs')} showBackButton={true} />
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>{t('no_active_jobs')}</AppText>
        </View>
      </View>
    );
  }

  // Determine current stage based on status
  // If order status is order_placed or pending in job terms, rider is picking it up.
  // If order status is dispatched, rider has picked it up and is navigating to the customer.
  const isPickedUp = activeJob.status === 'picked_up';
  
  return (
    <View style={styles.container}>
      <ScreenHeader title={t('active_jobs')} showBackButton={true} />
      
      {/* Map View Background */}
      <View style={styles.mapContainer}>
        <Image source={IMAGES.MAP} style={styles.mapImage} />
      </View>

      {/* Stepper & Details Floating Sheet */}
      <View style={styles.detailsSheet}>
        {/* Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepActive]} />
            <AppText style={[styles.stepLabel, styles.activeStepText]}>{t('pickup_item')}</AppText>
          </View>
          <View style={[styles.stepLine, isPickedUp && styles.stepLineActive]} />
          <View style={styles.step}>
            <View style={[styles.stepDot, isPickedUp && styles.stepActive]} />
            <AppText style={[styles.stepLabel, isPickedUp && styles.activeStepText]}>{t('navigate_to_customer')}</AppText>
          </View>
        </View>

        {/* Customer Details Card */}
        <Card style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <Image source={IMAGES.MAN2} style={styles.avatar} />
            <View style={styles.customerInfo}>
              <AppText style={styles.customerName}>{activeJob.customerName}</AppText>
              <AppText style={styles.customerAddress}>{activeJob.customerAddress}</AppText>
            </View>
          </View>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={handleCall} activeOpacity={0.8}>
              <AppText style={styles.contactText}>{t('contact_customer')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, styles.whatsappBtn]} onPress={handleWhatsApp} activeOpacity={0.8}>
              <AppText style={styles.whatsappText}>{t('whatsapp')}</AppText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Action Button */}
        {!isPickedUp ? (
          <TouchableOpacity style={styles.actionButton} onPress={handlePickedUp} activeOpacity={0.8}>
            <AppText style={styles.actionBtnText}>{t('pickup_item')}</AppText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleArrived} activeOpacity={0.8}>
            <AppText style={styles.actionBtnText}>{t('arrived_at_destination')}</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    paddingBottom: hp(4),
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    marginBottom: hp(2.5),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  stepDot: {
    width: hp(2),
    height: hp(2),
    borderRadius: hp(1),
    backgroundColor: colors.lightGray,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.lightGray,
    marginHorizontal: wp(2),
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
  },
  activeStepText: {
    color: colors.secondary,
    fontFamily: FONT.semiBold,
  },
  customerCard: {
    backgroundColor: colors.white,
    padding: wp(4),
    borderRadius: 20,
    marginBottom: hp(2.5),
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  avatar: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
  },
  customerAddress: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
    marginTop: hp(0.5),
  },
  contactRow: {
    flexDirection: 'row',
    gap: wp(4),
    marginTop: hp(2),
  },
  contactBtn: {
    flex: 1,
    height: hp(5),
    backgroundColor: colors.lightGray + '40',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    color: colors.secondary,
    fontFamily: FONT.medium,
    fontSize: 12,
  },
  whatsappBtn: {
    backgroundColor: colors.whatsappBrand + '20',
  },
  whatsappText: {
    color: colors.whatsappBrand,
    fontFamily: FONT.medium,
    fontSize: 12,
  },
  actionButton: {
    height: hp(6.5),
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: colors.white,
    fontFamily: FONT.bold,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: FONT.regular,
    fontSize: 14,
  },
});

export default ActiveDeliveriesScreen;
