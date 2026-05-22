import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { usePartnerDeliveries } from '../hooks/usePartnerDeliveries';
import { usePartnerLocation } from '../hooks/usePartnerLocation';
import { Card } from '../../../common/components/Card/Card';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { Routes } from '../../../constants/routes';

const PartnerHomeScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { availableJobs, activeJob, isLoading, refreshJobs, acceptJob } = usePartnerDeliveries();
  const [isOnline, setIsOnline] = useState(true);

  // Broadcast location periodically if online
  usePartnerLocation(isOnline);

  const handleAccept = async (jobId: string) => {
    try {
      await acceptJob(jobId);
      Alert.alert(t('Success'), t('offer_sent_success'));
      navigation.navigate(Routes.ACTIVE_DELIVERIES);
    } catch (err) {
      Alert.alert(t('Error'), t('failed_to_send_offer'));
    }
  };

  const renderJobItem = ({ item }: { item: any }) => (
    <Card style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <AppText style={styles.storeName}>{item.storeName}</AppText>
        <AppText style={styles.distanceText}>{item.distance}</AppText>
      </View>
      <View style={styles.jobDetails}>
        <AppText style={styles.detailLabel}>{t('addressLabel')}:</AppText>
        <AppText style={styles.detailValue}>{item.customerAddress}</AppText>
        
        <AppText style={styles.detailLabel}>{t('Items')}:</AppText>
        <AppText style={styles.detailValue}>{item.itemsSummary}</AppText>
      </View>
      <View style={styles.payoutRow}>
        <AppText style={styles.payoutLabel}>{t('payout')}</AppText>
        <AppText style={styles.payoutValue}>{item.payout}{t('currency')}</AppText>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8}>
          <AppText style={styles.rejectText}>{t('reject')}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={() => handleAccept(item.id)}>
          <AppText style={styles.acceptText}>{t('accept')}</AppText>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={t('job_board')} showBackButton={false} />
        
        {/* Toggle Status Card */}
        <Card style={styles.statusCard}>
          <AppText style={styles.statusTitle}>
            {isOnline ? t('online') : t('offline')}
          </AppText>
          <TouchableOpacity 
            style={[styles.toggleButton, isOnline ? styles.toggleOn : styles.toggleOff]}
            activeOpacity={0.8}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View style={[styles.toggleKnob, isOnline ? styles.knobOn : styles.knobOff]} />
          </TouchableOpacity>
        </Card>

        {activeJob && (
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(Routes.ACTIVE_DELIVERIES)}>
            <Card style={styles.activeJobBanner}>
              <AppText style={styles.activeJobTitle}>{t('active_jobs')}</AppText>
              <AppText style={styles.activeJobSubtitle}>{activeJob.customerName} - {activeJob.customerAddress}</AppText>
            </Card>
          </TouchableOpacity>
        )}

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={availableJobs}
            keyExtractor={item => item.id}
            renderItem={renderJobItem}
            refreshing={isLoading}
            onRefresh={refreshJobs}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>{t('no_available_jobs')}</AppText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(6),
    marginTop: hp(1),
    marginBottom: hp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
  },
  toggleButton: {
    width: wp(14),
    height: hp(3.5),
    borderRadius: 20,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleOff: {
    backgroundColor: colors.lightGray,
  },
  toggleKnob: {
    width: hp(3),
    height: hp(3),
    borderRadius: 15,
    backgroundColor: colors.white,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
  activeJobBanner: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
    borderWidth: 1,
    marginHorizontal: wp(6),
    marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: 16,
  },
  activeJobTitle: {
    fontSize: 14,
    fontFamily: FONT.semiBold,
    color: colors.primary,
  },
  activeJobSubtitle: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.secondary,
    marginTop: hp(0.5),
  },
  listContent: {
    paddingBottom: hp(4),
  },
  jobCard: {
    marginHorizontal: wp(6),
    marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray + '50',
    paddingBottom: hp(1),
  },
  storeName: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.primary,
  },
  jobDetails: {
    marginTop: hp(1.5),
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
    marginTop: hp(0.5),
  },
  detailValue: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: colors.secondary,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
    backgroundColor: colors.background,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 12,
  },
  payoutLabel: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
  },
  payoutValue: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(4),
    marginTop: hp(2),
  },
  rejectBtn: {
    flex: 1,
    height: hp(5.5),
    backgroundColor: colors.lightGray,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    color: colors.textSecondary,
    fontFamily: FONT.medium,
    fontSize: 14,
  },
  acceptBtn: {
    flex: 2,
    height: hp(5.5),
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: colors.white,
    fontFamily: FONT.medium,
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp(8),
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: FONT.regular,
    fontSize: 14,
  },
});

export default PartnerHomeScreen;
