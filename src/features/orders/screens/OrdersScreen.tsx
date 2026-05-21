import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { OrderCard } from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { hp, wp } from '../../../enums/spacing';
import { Routes } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { TouchableOpacity } from 'react-native';
import { FONT } from '../../../enums/typography';
import { useFocusEffect } from '@react-navigation/native';

const OrdersScreen: React.FC = ({ navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const navigateToOrderDetails = (order: any) => {
        navigation.navigate(Routes.ORDER_DETAILS, {
            order,
            status: isSeller ? activeTab : order.status
        });
    };
    const { userRole } = useAuth();
    const isSeller = userRole === 'seller';
    const { orders, pastOrders, pendingOrders, deliveredOrders, cancelledOrders, loading, refreshOrders } = useOrders();
    const [activeTab, setActiveTab] = useState<'pending' | 'delivered' | 'cancelled'>('pending');

    useFocusEffect(
        React.useCallback(() => {
            refreshOrders();
        }, [])
    );

    const tabs = [
        { key: 'pending', label: t('pending') },
        { key: 'delivered', label: t('delivered_tab') },
        { key: 'cancelled', label: t('cancelled') },
    ];

    const getOrdersForTab = () => {
        switch (activeTab) {
            case 'pending': return pendingOrders;
            case 'delivered': return deliveredOrders;
            case 'cancelled': return cancelledOrders;
            default: return [];
        }
    };

    const renderHeader = () => {
        return (
            <View style={styles.tabBar}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tabItem,
                            activeTab === tab.key && styles.activeTabItem
                        ]}
                        onPress={() => setActiveTab(tab.key as any)}
                    >
                        <AppText
                            color={activeTab === tab.key ? colors.primary : colors.textSecondary}
                            style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}
                        >
                            {tab.label}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenHeader title={t('orders')} showBackButton={false} />
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={getOrdersForTab()}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <OrderCard
                                title={item.title}
                                subtitle={item.subtitle}
                                image={item.image}
                                buttonText={item.buttonText}
                                onPress={() => navigateToOrderDetails(item)}
                            />
                        )}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', marginTop: hp(6) }}>
                                <AppText style={{ color: colors.textSecondary }}>
                                    {t('no_orders')}
                                </AppText>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    />
                )}
            </SafeAreaView>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: hp(2),
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: wp(6),
        paddingBottom: hp(2),
        backgroundColor: colors.background,
    },
    tabItem: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: colors.primary,
    },
    tabLabel: {
        fontSize: 12,
        fontFamily: FONT.medium,
    },
    activeTabLabel: {
        fontFamily: FONT.semiBold,
    },
});

export default OrdersScreen;
