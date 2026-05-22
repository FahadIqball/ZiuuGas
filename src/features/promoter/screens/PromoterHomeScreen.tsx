import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Share, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { usePromoterReferrals } from '../hooks/usePromoterReferrals';
import { Card } from '../../../common/components/Card/Card';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

const PromoterHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { metrics, referrals, isLoading, refreshReferrals } = usePromoterReferrals();

  const handleShareCode = async () => {
    if (!metrics?.referralCode) return;
    try {
      await Share.share({
        message: `${t('copy_referral_code')}: ${metrics.referralCode}`,
      });
    } catch (err) {
      console.error('Error sharing referral code:', err);
    }
  };

  const renderReferralItem = ({ item }: { item: any }) => (
    <Card style={styles.referralCard}>
      <View style={styles.cardHeader}>
        <AppText style={styles.nameText}>{item.name || t('user')}</AppText>
        <AppText style={[styles.statusText, item.status === 'active' ? styles.statusActive : styles.statusPending]}>
          {t(item.status)}
        </AppText>
      </View>
      <View style={styles.cardFooter}>
        <AppText style={styles.emailText}>{item.email}</AppText>
        <AppText style={styles.dateText}>{item.registrationDate}</AppText>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={t('promoter_dashboard')} showBackButton={false} />

        <FlatList
          data={referrals}
          keyExtractor={item => item.id}
          renderItem={renderReferralItem}
          onRefresh={refreshReferrals}
          refreshing={isLoading}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {/* Metrics Card */}
              <Card style={styles.metricsCard}>
                <View style={styles.metricItem}>
                  <AppText style={styles.metricLabel}>{t('referral_signups')}</AppText>
                  <AppText style={styles.metricValue}>{metrics?.totalSignups ?? 0}</AppText>
                </View>
                <View style={styles.divider} />
                <View style={styles.metricItem}>
                  <AppText style={styles.metricLabel}>{t('commission_earned')}</AppText>
                  <AppText style={styles.metricValue}>
                    {metrics?.totalCommissions ?? 0}
                    {t('currency')}
                  </AppText>
                </View>
              </Card>

              {/* Referral Code Card */}
              <Card style={styles.codeCard}>
                <AppText style={styles.codeLabel}>{t('copy_referral_code')}</AppText>
                <AppText style={styles.codeValue}>{metrics?.referralCode ?? '...'}</AppText>
                <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} onPress={handleShareCode}>
                  <AppText style={styles.shareText}>{t('share_code')}</AppText>
                </TouchableOpacity>
              </Card>

              <AppText style={styles.listTitle}>{t('referrals_list')}</AppText>
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>{t('no_referrals_yet')}</AppText>
              </View>
            )
          }
        />
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
  metricsCard: {
    flexDirection: 'row',
    marginHorizontal: wp(6),
    marginTop: hp(1),
    marginBottom: hp(2.5),
    paddingVertical: hp(2.5),
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: FONT.bold,
    color: colors.secondary,
    marginTop: hp(0.5),
  },
  divider: {
    width: 1,
    height: hp(5),
    backgroundColor: colors.lightGray,
  },
  codeCard: {
    marginHorizontal: wp(6),
    marginBottom: hp(3),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  codeValue: {
    fontSize: 28,
    fontFamily: FONT.bold,
    color: colors.white,
    marginTop: hp(0.8),
    letterSpacing: 1,
  },
  shareBtn: {
    marginTop: hp(2),
    backgroundColor: colors.primary,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(8),
    borderRadius: 20,
  },
  shareText: {
    color: colors.white,
    fontFamily: FONT.semiBold,
    fontSize: 13,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
    marginHorizontal: wp(6),
    marginBottom: hp(1.5),
  },
  listContent: {
    paddingBottom: hp(4),
  },
  referralCard: {
    marginHorizontal: wp(6),
    marginBottom: hp(1.5),
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 14,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONT.medium,
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2.5),
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: colors.lightBlue,
    color: colors.primary,
  },
  statusPending: {
    backgroundColor: colors.orange + '15',
    color: colors.orange,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  emailText: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  loader: {
    marginTop: hp(4),
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp(4),
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: FONT.regular,
    fontSize: 14,
  },
});

export default PromoterHomeScreen;
