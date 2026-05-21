import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { ProductCard } from '../components/ProductCard'
import { IMAGES } from '../../../assets'
import { AppText } from '../../../common/components/Typography/Typography'
import { hp, wp } from '../../../enums/spacing'
import { FONT } from '../../../enums/typography'
import { StoreCard } from '../components/StoreCard'
import { Button } from '../../../common/components/Button'
import { ReviewsCard } from '../components/ReviewsCard'
import { Routes } from '../../../constants/routes'
import { useAuth } from '../../../context/AuthContext'
import { CustomerCard } from '../components/CustomerCard'
import { CancelOrderModal } from '../components/cancelModal'
import { OTPModal } from '../components/OTPModal'
import { orderRepository } from '../../../services/orderService'
import { reviewRepository } from '../../../services/reviewService'
import { Review } from '../../review/services/types'
import { useFocusEffect } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import { resolveProductImage } from '../../products/utils/imageResolver';

const OrderDetailsScreen = ({ navigation, route }: any) => {
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [sellerInfo, setSellerInfo] = useState<{ name: string, photo: any, rating: string } | null>(null);
    const [loadingSeller, setLoadingSeller] = useState(true);
    const { userRole } = useAuth();
    const isSeller = userRole === 'seller';
    const { order, status } = route.params || {};
    
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const fetchSellerData = useCallback(async () => {
        const sellerId = order?.rawOrder?.sellerId;
        if (!sellerId || isSeller) {
            setLoadingSeller(false);
            return;
        }

        setLoadingSeller(true);
        try {
            const sellerDoc = await firestore().collection('users').doc(sellerId).get();
            const sellerData = sellerDoc.data();
            if (sellerData) {
                setSellerInfo({
                    name: sellerData.displayName || order.sellerName || t('gas_store'),
                    photo: resolveProductImage(sellerData.photoURL || order.sellerImage),
                    rating: sellerData.rating || order.sellerRating || '4.9'
                });
            }
        } catch (err) {
            console.error('Failed to fetch seller data:', err);
        } finally {
            setLoadingSeller(false);
        }
    }, [order?.rawOrder?.sellerId, isSeller, order?.sellerName, order?.sellerImage, order?.sellerRating, t]);

    const fetchReviews = useCallback(async () => {
        const productId = order?.rawOrder?.items?.[0]?.productId;
        if (!productId) {
            setLoadingReviews(false);
            return;
        }
        
        setLoadingReviews(true);
        try {
            const data = await reviewRepository.getReviewsByProduct(productId);
            setReviews(data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [order?.rawOrder?.items]);

    useFocusEffect(
        useCallback(() => {
            fetchReviews();
            fetchSellerData();
        }, [fetchReviews, fetchSellerData])
    );

    const navigateToReview = () => {
        navigation.navigate(Routes.REVIEW, {
            orderId: order.id,
            sellerId: order.rawOrder?.sellerId,
            productId: order.rawOrder?.items[0]?.productId
        })
    }

    const renderSellerView = () => (
        <>
            <View style={styles.productContainer}>
                <ProductCard
                    title={order.title}
                    subtitle={order.subtitle}
                    price={order.price || "20"}
                    image={order.image}
                />
            </View>
 
            <View style={styles.customerContainer}>
                <AppText style={styles.title}>{t('customer_details')}</AppText>
                <CustomerCard
                    name={order.rawOrder?.userName || "Henrey"}
                    email={order.rawOrder?.userEmail || "xvy@gmail.com"}
                    address={order.rawOrder?.userAddress || "Street 1 Block V Johar"}
                    image={order.rawOrder?.userPhoto ? { uri: order.rawOrder.userPhoto } : IMAGES.MAN2}
                />
            </View>
        </>
    );
 
    const renderBuyerView = () => (
        <>
            <View style={styles.productContainer}>
                <AppText style={styles.title}>{t('Product')}</AppText>
                <ProductCard
                    title={order.title}
                    subtitle={order.subtitle}
                    price={order.price || "20"}
                    image={order.image}
                />
            </View>
 
            <View style={styles.storeContainer}>
                <AppText style={styles.title}>{t('Store_Details')}</AppText>
                <StoreCard
                    title={sellerInfo?.name || order.sellerName || t('gas_store')}
                    time={order.rawOrder?.estimatedDeliveryMin || '20'}
                    rating={sellerInfo?.rating || order.sellerRating || '4.9'}
                    image={sellerInfo?.photo || order.sellerImage || IMAGES.NOTIFICATION_CYLINDER}
                />
            </View>
            <View style={styles.reviewsContainer}>
                <View style={styles.reviewsHeader}>
                    <AppText style={styles.title}>{t('Reviews_and_Ratings')}</AppText>
                    <Button
                        title={t('Add')}
                        variant='outline'
                        style={styles.addBtn}
                        onPress={navigateToReview}
                    />
                </View>
                
                {loadingReviews ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <ReviewsCard
                            key={rev.id}
                            title={rev.userName}
                            time={rev.createdAt ? (typeof rev.createdAt.toDate === 'function' ? rev.createdAt.toDate().toLocaleDateString() : new Date(rev.createdAt).toLocaleDateString()) : ''}
                            rating={rev.rating.toString()}
                            image={rev.userAvatar ? { uri: rev.userAvatar } : IMAGES.MAN2}
                            comment={rev.comment}
                        />
                    ))
                ) : (
                    <AppText color={colors.textSecondary} style={{ textAlign: 'center', marginTop: hp(2) }}>
                        {t('no_reviews')}
                    </AppText>
                )}
            </View>
        </>
    );
 
    const handleConfirmCancel = async () => {
        setCancelModalVisible(false);
        if (order.id) {
            try {
                await orderRepository.updateOrderStatus(order.id, 'cancelled');
                Alert.alert(t('Success'), 'Order cancelled successfully.');
                navigation.goBack();
            } catch (err) {
                console.error('Failed to cancel order:', err);
                Alert.alert('Error', 'Failed to cancel order.');
            }
        }
    };
 
    const handleConfirmDelivered = async () => {
        setOtpModalVisible(false);
        if (order.id) {
            try {
                await orderRepository.updateOrderStatus(order.id, 'delivered');
                Alert.alert(t('Success'), 'Order delivered successfully.');
                navigation.goBack();
            } catch (err) {
                console.error('Failed to update status:', err);
                Alert.alert('Error', 'Failed to update order status.');
            }
        }
    };
 
    const canCancel = (isSeller && status === 'pending') || (!isSeller && order.status === 'order_placed');
 
    const getStatusColor = () => {
        const s = isSeller ? (status === 'pending' ? order.status : status) : order.status;
        switch (s) {
            case 'delivered': return colors.primary;
            case 'cancelled': return colors.error;
            case 'dispatched': return colors.orange;
            case 'order_placed': return colors.secondary;
            default: return colors.textSecondary;
        }
    };

    if (loadingSeller) {
        return (
            <View style={styles.container}>
                <ScreenHeader title={t('order_details')} showBackButton={true} />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('order_details')}
                showBackButton={true}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                        <AppText style={[styles.statusText, { color: getStatusColor() }]}>
                            {t(isSeller ? (status === 'pending' ? order.status : status) : order.status)}
                        </AppText>
                    </View>
                </View>
                {isSeller ? renderSellerView() : renderBuyerView()}
            </ScrollView>
 
            {canCancel && (
                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        activeOpacity={0.8}
                        onPress={() => setCancelModalVisible(true)}
                    >
                        <AppText style={styles.buttonText}>{t('cancel_order')}</AppText>
                    </TouchableOpacity>
                    {isSeller && (
                        <TouchableOpacity
                            style={[styles.button, styles.deliveredButton]}
                            activeOpacity={0.8}
                            onPress={() => setOtpModalVisible(true)}
                        >
                            <AppText style={styles.buttonText}>{t('delivered_btn')}</AppText>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            <CancelOrderModal
                visible={cancelModalVisible}
                onClose={() => setCancelModalVisible(false)}
                onConfirm={handleConfirmCancel}
            />
            <OTPModal
                visible={otpModalVisible}
                onClose={() => setOtpModalVisible(false)}
                onConfirm={handleConfirmDelivered}
                amount={order.price || "20"}
            />
        </View>
    )
}

export default OrderDetailsScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: hp(10),
        paddingTop: hp(2),
    },
    productContainer: {
        paddingHorizontal: wp(6),
    },
    statusBadgeContainer: {
        paddingHorizontal: wp(6),
        marginBottom: hp(2),
        alignItems: 'flex-start',
    },
    statusBadge: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontFamily: FONT.semiBold,
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 14,
        color: colors.secondary,
        fontFamily: FONT.medium,
        marginBottom: hp(2),
    },
    storeContainer: {
        paddingHorizontal: wp(6),
        marginTop: hp(2),
    },
    customerContainer: {
        paddingHorizontal: wp(6),
        marginTop: hp(2),
    },
    reviewsContainer: {
        paddingHorizontal: wp(6),
        marginTop: hp(2),
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addBtn: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        backgroundColor: colors.lytBlue,
        marginBottom: hp(2)
    },
    bottomButtons: {
        flexDirection: 'row',
        paddingHorizontal: wp(6),
        paddingVertical: hp(2),
        backgroundColor: colors.background,
        gap: wp(4),
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    button: {
        flex: 1,
        height: hp(7),
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        height: hp(6),
        backgroundColor: colors.textSecondary,
    },
    deliveredButton: {
        height: hp(6),
        backgroundColor: colors.primary,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: FONT.medium,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})