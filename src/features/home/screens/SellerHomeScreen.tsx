import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { spacing, hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { EarningCard } from '../components/EarningCard';
import { InventoryItem } from '../components/InventoryItem';
import { IMAGES } from '../../../assets';
import { FONT } from '../../../enums/typography';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { productRepository } from '../../../services/productService';
import { orderRepository } from '../../../services/orderService';
import { resolveProductImage } from '../../products/utils/imageResolver';
import { Routes } from '../../../constants/routes';

const SellerHomeScreen: React.FC = ({ navigation }: any) => {
    const { colors, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = useStyles(createStyles);
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        earnings: '$0',
        cylinders: '0',
        waterCans: '0',
        completedOrders: '0'
    });
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);

    const navigateToAddInventory = () => {
        navigation.navigate(Routes.SELLER_ADD_INVENTORY);
    };

    const navigateToSellerNotifications = () => {
        navigation.navigate(Routes.SELLER_NOTIFICATIONS);
    };

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch inventory items
            const inventory = await productRepository.getSellerInventory(user.uid);
            
            // Calculate inventory stats
            let gasCylinderStock = 0;
            let waterCanStock = 0;
            
            inventory.forEach(item => {
                const stockVal = Number(item.stock) || 0;
                if (item.categoryId === '1' || item.categoryId === '3') {
                    gasCylinderStock += stockVal;
                } else if (item.categoryId === '2') {
                    waterCanStock += stockVal;
                }
            });

            // Fetch orders
            const orders = await orderRepository.getOrdersBySeller(user.uid);
            const deliveredOrders = orders.filter(o => o.status === 'delivered');
            
            const totalEarning = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

            setStats({
                earnings: `$${totalEarning}`,
                cylinders: gasCylinderStock.toString(),
                waterCans: waterCanStock.toString(),
                completedOrders: deliveredOrders.length.toString()
            });

            setInventoryItems(inventory.slice(0, 3)); // show top 3 items on dashboard
        } catch (err) {
            console.error('Failed to fetch seller dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDashboardData();
        }, [user])
    );

    const earningStats = [
        { title: t('totalEarnings'), value: stats.earnings },
        { title: t('totalGasCylinders'), value: stats.cylinders },
        { title: t('totalWaterCans'), value: stats.waterCans },
        { title: t('completedOrders'), value: stats.completedOrders },
    ];

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.lightBlue} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Header & Search Section */}
                    <View style={styles.topSection}>
                        <HomeHeader notificationOnPress={navigateToSellerNotifications} />
                        <HomeSearchBar />
                    </View>

                    <View style={styles.content}>
                        {/* Earning Status Section */}
                        <View style={styles.section}>
                            <AppText color={colors.secondary} style={styles.sectionTitle}>
                                {t('earningStatus')}
                            </AppText>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: hp(2) }} />
                            ) : (
                                <View style={styles.statsGrid}>
                                    {earningStats.map((stat, index) => (
                                        <EarningCard key={index} title={stat.title} value={stat.value} />
                                    ))}
                                </View>
                            )}
                        </View>
 
                        {/* Inventory Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AppText variant="h2" color={colors.secondary} style={styles.sectionTitle}>
                                    {t('inventory')}
                                </AppText>
                                <TouchableOpacity onPress={() => navigation.navigate(Routes.SELLER_INVENTORY)}>
                                    <AppText style={styles.viewAllText}>{t('viewAll')}</AppText>
                                </TouchableOpacity>
                            </View>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: hp(2) }} />
                            ) : inventoryItems.length === 0 ? (
                                <View style={{ alignItems: 'center', marginVertical: hp(2) }}>
                                    <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>
                                        {t('no_products')}
                                    </AppText>
                                </View>
                            ) : (
                                <View style={styles.inventoryList}>
                                    {inventoryItems.map((item) => (
                                        <InventoryItem
                                            key={item.id}
                                            title={item.title}
                                            stock={item.stock}
                                            price={item.price}
                                            image={resolveProductImage(item.image)}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={navigateToAddInventory}
                >
                    <AppText style={styles.fabIcon}>+</AppText>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100, // Extra space for FAB and bottom tabs
    },
    topSection: {
        backgroundColor: colors.lightBlue,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 35,
        paddingTop: 10,
    },
    content: {
        paddingHorizontal: wp(6),
    },
    section: {
        marginTop: hp(2.5),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: spacing.s,
    },
    viewAllText: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.primary,
    },
    inventoryList: {
        marginTop: spacing.s,
    },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabIcon: {
        color: colors.white,
        fontSize: 30,
        fontWeight: '300',
    },
});

export default SellerHomeScreen;
