import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../common/components/Card/Card';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { deliveryRepository } from '../../../services/deliveryService';

const PartnerEarningsScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchEarnings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const deliveries = await deliveryRepository.getCompletedDeliveries(user.uid);
      const balance = deliveries.reduce((sum, item) => sum + item.payout, 0);
      setCompletedDeliveries(deliveries);
      setTotalBalance(balance);
    } catch (err) {
      console.error('Failed to load rider earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [user]);

  const handleWithdraw = () => {
    Alert.alert(t('information'), t('coming_soon'));
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <Card style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <AppText style={styles.codeText}>#{item.orderCode}</AppText>
        <AppText style={styles.amountText}>+{item.payout}{t('currency')}</AppText>
      </View>
      <View style={styles.cardFooter}>
        <AppText style={styles.customerText}>{item.customerName}</AppText>
        <AppText style={styles.dateText}>{item.date}</AppText>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={t('earnings')} showBackButton={false} />

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <AppText style={styles.balanceLabel}>{t('total_earnings')}</AppText>
          <AppText style={styles.balanceValue}>{totalBalance.toFixed(2)}{t('currency')}</AppText>
          
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8} onPress={handleWithdraw}>
            <AppText style={styles.withdrawText}>{t('withdrawal_requests')}</AppText>
          </TouchableOpacity>
        </Card>

        <AppText style={styles.historyTitle}>{t('earnings_history')}</AppText>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={completedDeliveries}
            keyExtractor={item => item.id}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContent}
            onRefresh={fetchEarnings}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>{t('no_orders')}</AppText>
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
  balanceCard: {
    marginHorizontal: wp(6),
    marginTop: hp(1),
    marginBottom: hp(3),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 36,
    fontFamily: FONT.bold,
    color: colors.white,
    marginTop: hp(1),
  },
  withdrawBtn: {
    marginTop: hp(2.5),
    backgroundColor: colors.primary,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6),
    borderRadius: 20,
  },
  withdrawText: {
    color: colors.white,
    fontFamily: FONT.semiBold,
    fontSize: 13,
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
  historyCard: {
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
  codeText: {
    fontSize: 14,
    fontFamily: FONT.semiBold,
    color: colors.secondary,
  },
  amountText: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  customerText: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
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

export default PartnerEarningsScreen;
