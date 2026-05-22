import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { usePromoterPayouts } from '../hooks/usePromoterPayouts';
import { usePromoterReferrals } from '../hooks/usePromoterReferrals';
import { Card } from '../../../common/components/Card/Card';
import { Input } from '../../../common/components/Input';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

const PromoterPayoutsScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { metrics, refreshReferrals } = usePromoterReferrals();
  const { payouts, isLoading, requestPayout, refreshPayouts } = usePromoterPayouts();

  const [amountStr, setAmountStr] = useState('');
  const [pixKey, setPixKey] = useState('');

  const totalCommissions = metrics?.totalCommissions ?? 0;
  const totalRequested = payouts.reduce((sum, p) => p.status !== 'failed' ? sum + p.amount : sum, 0);
  const currentBalance = Math.max(0, totalCommissions - totalRequested);

  const handleRequestPayout = async () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || !pixKey.trim()) {
      Alert.alert(t('Error'), t('fill_all_fields'));
      return;
    }

    if (amount < 50) {
      Alert.alert(t('Error'), t('minimum_threshold_error'));
      return;
    }

    if (amount > currentBalance) {
      Alert.alert(t('Error'), t('payout_amount_payout_exceeded'));
      return;
    }

    try {
      await requestPayout(amount, pixKey.trim());
      Alert.alert(t('Success'), t('payout_requested_success'));
      setAmountStr('');
      setPixKey('');
      refreshReferrals(); // Refresh metrics balance
    } catch (err) {
      Alert.alert(t('Error'), t('failed_to_request_payout'));
    }
  };

  const handleRefreshAll = () => {
    refreshReferrals();
    refreshPayouts();
  };

  const renderPayoutItem = ({ item }: { item: any }) => (
    <Card style={styles.payoutCard}>
      <View style={styles.cardHeader}>
        <AppText style={styles.dateText}>{item.date}</AppText>
        <AppText style={styles.amountValue}>-{item.amount}{t('currency')}</AppText>
      </View>
      <View style={styles.cardFooter}>
        <AppText style={styles.pixText}>{t('pix_key')}: {item.pixKey}</AppText>
        <AppText style={[styles.statusText, 
          item.status === 'completed' ? styles.statusCompleted : 
          item.status === 'failed' ? styles.statusFailed : styles.statusPending
        ]}>
          {t(item.status)}
        </AppText>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={t('withdrawal_requests')} showBackButton={false} />

        <FlatList
          data={payouts}
          keyExtractor={item => item.id}
          renderItem={renderPayoutItem}
          onRefresh={handleRefreshAll}
          refreshing={isLoading}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              {/* Balance Card */}
              <Card style={styles.balanceCard}>
                <AppText style={styles.balanceLabel}>{t('total_earnings')}</AppText>
                <AppText style={styles.balanceValue}>{currentBalance.toFixed(2)}{t('currency')}</AppText>
              </Card>

              {/* Request Payout Form */}
              <Card style={styles.formCard}>
                <Input
                  label={t('amount')}
                  placeholder={t('enter_payout_amount')}
                  value={amountStr}
                  onChangeText={setAmountStr}
                  keyboardType="numeric"
                />
                <Input
                  label={t('pix_key')}
                  placeholder={t('enter_pix_key')}
                  value={pixKey}
                  onChangeText={setPixKey}
                />
                <TouchableOpacity style={styles.requestBtn} activeOpacity={0.8} onPress={handleRequestPayout}>
                  <AppText style={styles.requestBtnText}>{t('request_payout')}</AppText>
                </TouchableOpacity>
              </Card>

              <AppText style={styles.historyTitle}>{t('payout_history')}</AppText>
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>{t('no_payouts_yet')}</AppText>
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
  formContainer: {
    paddingTop: hp(1),
  },
  balanceCard: {
    marginHorizontal: wp(6),
    marginBottom: hp(2.5),
    paddingVertical: hp(2.5),
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: FONT.bold,
    color: colors.white,
    marginTop: hp(0.5),
  },
  formCard: {
    marginHorizontal: wp(6),
    marginBottom: hp(3),
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(5),
    borderRadius: 24,
    backgroundColor: colors.white,
  },
  requestBtn: {
    backgroundColor: colors.primary,
    height: hp(6),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
  },
  requestBtnText: {
    color: colors.white,
    fontFamily: FONT.bold,
    fontSize: 14,
  },
  historyTitle: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
    marginHorizontal: wp(6),
    marginBottom: hp(1.5),
  },
  listContent: {
    paddingBottom: hp(4),
  },
  payoutCard: {
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
  dateText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
  },
  amountValue: {
    fontSize: 15,
    fontFamily: FONT.bold,
    color: colors.secondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  pixText: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONT.medium,
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2.5),
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusCompleted: {
    backgroundColor: colors.lightBlue,
    color: colors.primary,
  },
  statusFailed: {
    backgroundColor: colors.lightRed,
    color: colors.error,
  },
  statusPending: {
    backgroundColor: colors.orange + '15',
    color: colors.orange,
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

export default PromoterPayoutsScreen;
