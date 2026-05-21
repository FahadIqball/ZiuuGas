import React from 'react';
import { View, StyleSheet, FlatList, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { CategoryItem } from '../components/CategoryItem';
import { ProductCard } from '../components/ProductCard';
import { AccessoryCard } from '../components/AccessoryCard';
import { GasNotification } from '../components/GasNotification';
import { ActiveOrderBanner } from '../components/ActiveOrderBanner';
import { hp, wp, spacing } from '../../../enums/spacing';
import { typography } from '../../../enums/typography';
import { useHome } from '../hooks/useHome';
import { useNotification } from '../../../context/NotificationContext';
import { Routes } from '../../../constants/routes';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../../constants/ads';
import { resolveProductImage } from '../../products/utils/imageResolver';
import { useAuth } from '../../../context/AuthContext';
import { offerRepository } from '../../../services/offerService';

const HomeScreen: React.FC = ({ navigation }: any) => {
    const { categories, products, selectedCategoryId, handleCategorySelect, isLoading, error } = useHome();
    const { hasGasNotification, hasActiveOrder } = useNotification();
    const { isDarkMode, colors } = useTheme();
    const { user } = useAuth();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const navigateToProductDetails = (productId: string) => {
        navigation.navigate(Routes.PRODUCT_DETAILS, { productId });
    };

    const navigateToNotifications = () => {
        navigation.navigate(Routes.NOTIFICATIONS);
    };

    const handleRequestOffer = async (product: any) => {
        if (!user) {
            Alert.alert(t('login_required'), t('please_login_to_request_offer'));
            return;
        }

        try {
            await offerRepository.createOfferRequest({
                userId: user.uid,
                userName: user?.displayName || '',
                productId: product.id,
                title: product.title,
                subtitle: product.subtitle || '',
                image: product.image,
                status: 'pending',
            });
            Alert.alert(t('Success'), t('offer_request_sent'));
        } catch (err) {
            console.error('Error creating offer request:', err);
            Alert.alert(t('Error'), t('failed_to_send_request'));
        }
    };

    const renderHeader = () => (
        <>
            {/* Header & Search Section */}
            <View style={styles.topSection}>
                <HomeHeader notificationOnPress={navigateToNotifications} />
                <HomeSearchBar />
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
                <AppText variant="h2" color={colors.secondary} style={styles.categoryTitle}>
                    {t('Categories')}
                </AppText>
                <View style={styles.categoriesGrid}>
                    {categories.map((item) => (
                        <CategoryItem
                            key={item.id}
                            title={t(item.title as TxKeyPath)}
                            icon={item.icon}
                            isSelected={item.id === selectedCategoryId}
                            onPress={() => handleCategorySelect(item.id)}
                        />
                    ))}
                </View>
            </View>

            {/* Product List Title */}
            <View style={styles.section}>
                <AppText variant="h2" color={colors.secondary} style={styles.sectionTitle}>
                    {t('select')}
                </AppText>
            </View>
        </>
    );

    const renderFooter = () => (
        <View style={{ height: 140 }} />
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.lightBlue} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.contentContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            if (selectedCategoryId === '4') {
                                return (
                                    <AccessoryCard
                                        title={item.title}
                                        image={resolveProductImage(item.image)}
                                        rating={4.5}
                                        reviews={(item.reviews ?? []).length || 150}
                                        price={item.price || 0}
                                        onPress={() => navigateToProductDetails(item.id)}
                                    />
                                );
                            }
                            return (
                                <ProductCard
                                    title={item.title}
                                    subtitle={item.subtitle ?? ''}
                                    image={resolveProductImage(item.image)}
                                    onPress={() => navigateToProductDetails(item.id)}
                                    onRequestOffer={() => handleRequestOffer(item)}
                                />
                            );
                        }}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={() => {
                            if (isLoading) {
                                return (
                                    <View style={styles.centerContainer}>
                                        <ActivityIndicator size="large" color={colors.primary} />
                                    </View>
                                );
                            }
                            if (error) {
                                return (
                                    <View style={styles.centerContainer}>
                                        <AppText style={styles.errorText}>{error}</AppText>
                                    </View>
                                );
                            }
                            return (
                                <View style={styles.centerContainer}>
                                    <AppText style={styles.emptyText}>
                                        {t('no_products')}
                                    </AppText>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={true}
                    />
                    {/* Floating Banner */}
                    {hasActiveOrder && <ActiveOrderBanner navigation={navigation} />}
                </View>
                <View style={styles.adContainer}>
                    <BannerAd
                        unitId={AD_UNIT_IDS.BANNER}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                    />
                </View>
                {hasGasNotification && <GasNotification />}
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
    contentContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    topSection: {
        backgroundColor: colors.lightBlue,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 35,
        paddingTop: 10,
    },
    section: {
        marginTop: hp(2),
    },
    categoryTitle: {
        paddingHorizontal: wp(7),
        marginBottom: hp(1.7),
        ...typography.category,
    },
    sectionTitle: {
        paddingHorizontal: wp(7),
        marginBottom: hp(1.7),
        ...typography.select,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 25,
        justifyContent: 'flex-start',
    },
    adContainer: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        ...typography.body,
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: 'center',
        ...typography.body,
    },
});

export default HomeScreen;
