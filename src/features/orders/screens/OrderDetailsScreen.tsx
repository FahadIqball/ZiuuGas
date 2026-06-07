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
import { AssignRiderModal } from '../components/AssignRiderModal';
import { storeRiderRepository } from '../../../services/storeRiderService';
import { deliveryRepository } from '../../../services/deliveryService';
import { UserProfile } from '../../auth/services/types';

const OrderDetailsScreen = ({ navigation, route }: any) => {
    const { order, orderId, status: initialStatus } = route.params || {};
    const [currentOrder, setCurrentOrder] = useState(order || { id: orderId });
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [sellerInfo, setSellerInfo] = useState<{ name: string, photo: any, rating: string } | null>(null);
    const [loadingSeller, setLoadingSeller] = useState(true);

    // Rider assignment states
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [riders, setRiders] = useState<UserProfile[]>([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const [assignedRider, setAssignedRider] = useState<UserProfile | null>(null);
    const [loadingAssignedRider, setLoadingAssignedRider] = useState(false);

    const { user, userRole } = useAuth();
    const isSeller = userRole === 'seller';
    const currentStatus = currentOrder?.status || initialStatus;

    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    // Subscribe to order changes in real-time
    useEffect(() => {
        const oId = order?.id || orderId;
        if (!oId) return;
        const unsubscribe = firestore()
            .collection('orders')
            .doc(oId)
            .onSnapshot((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    if (data) {
                        setCurrentOrder((prev: any) => ({
                            ...prev,
                            id: doc.id,
                            status: data.status || prev.status,
                            riderId: data.riderId || prev.riderId,
                            payout: data.payout || prev.payout,
                            products: data.products || prev.products,
                            totalPrice: data.totalPrice || prev.totalPrice,
                            sellerName: data.sellerName || prev.sellerName,
                            sellerImage: data.sellerImage || prev.sellerImage,
                            sellerRating: data.sellerRating || prev.sellerRating,
                            rawOrder: {
                                ...prev.rawOrder,
                                ...data,
                            }
                        }));
                    }
                }
            }, (err) => {
                console.error('Order subscription failed:', err);
            });
        return unsubscribe;
    }, [order?.id, orderId]);

    const fetchOnlineRiders = useCallback(async () => {
        if (!user?.uid || !isSeller) return;
        setLoadingRiders(true);
        try {
            const data = await storeRiderRepository.getLinkedRiders(user.uid);
            const onlineRiders = data.filter(r => r.isOnline !== false);
            setRiders(onlineRiders);
        } catch (err) {
            console.error('Failed to fetch online riders:', err);
        } finally {
            setLoadingRiders(false);
        }
    }, [user?.uid, isSeller]);

    const fetchAssignedRider = useCallback(async () => {
        const rId = currentOrder?.riderId || currentOrder?.rawOrder?.riderId;
        if (!rId) {
            setAssignedRider(null);
            return;
        }
        setLoadingAssignedRider(true);
        try {
            const doc = await firestore().collection('users').doc(rId).get();
            const data = doc.data();
            if (data) {
                setAssignedRider({
                    uid: doc.id,
                    email: data.email || null,
                    displayName: data.displayName || null,
                    photoURL: data.photoURL || null,
                    role: data.role || null,
                    cnpj: data.cnpj,
                    address: data.address,
                    location: data.location,
                    areaInKm: data.areaInKm,
                    storeId: data.storeId || null,
                    isOnline: data.isOnline !== false,
                    createdAt: data.createdAt || '',
                    updatedAt: data.updatedAt || '',
                });
            }
        } catch (err) {
            console.error('Failed to fetch assigned rider:', err);
        } finally {
            setLoadingAssignedRider(false);
        }
    }, [currentOrder?.riderId, currentOrder?.rawOrder?.riderId]);

    useEffect(() => {
        fetchAssignedRider();
    }, [currentOrder?.riderId, currentOrder?.rawOrder?.riderId, fetchAssignedRider]);

    const fetchSellerData = useCallback(async () => {
        const sellerId = currentOrder?.rawOrder?.sellerId;
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
                    name: sellerData.displayName || currentOrder.sellerName || t('gas_store'),
                    photo: resolveProductImage(sellerData.photoURL || currentOrder.sellerImage),
                    rating: sellerData.rating || currentOrder.sellerRating || '4.9'
                });
            }
        } catch (err) {
            console.error('Failed to fetch seller data:', err);
        } finally {
            setLoadingSeller(false);
        }
    }, [currentOrder?.rawOrder?.sellerId, isSeller, currentOrder?.sellerName, currentOrder?.sellerImage, currentOrder?.sellerRating, t]);

    const fetchReviews = useCallback(async () => {
        const productId = currentOrder?.rawOrder?.items?.[0]?.productId;
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
    }, [currentOrder?.rawOrder?.items]);

    useFocusEffect(
        useCallback(() => {
            fetchReviews();
            fetchSellerData();
            fetchOnlineRiders();
        }, [fetchReviews, fetchSellerData, fetchOnlineRiders])
    );

    const navigateToReview = () => {
        navigation.navigate(Routes.REVIEW, {
            orderId: currentOrder.id,
            sellerId: currentOrder.rawOrder?.sellerId,
            productId: currentOrder.rawOrder?.items[0]?.productId
        })
    }

    const handleAssignRider = async (selectedRider: UserProfile) => {
        if (!currentOrder.id) return;
        try {
            setAssignModalVisible(false);
            await deliveryRepository.acceptJob(currentOrder.id, selectedRider.uid);
            Alert.alert(t('Success'), t('rider_invitation_sent_success'));
        } catch (err) {
            console.error('Failed to assign rider:', err);
            Alert.alert(t('Error'), t('failed_to_fetch_data'));
        }
    };

    const renderSellerView = () => (
        <>
            <View style={styles.productContainer}>
                <ProductCard
                    title={currentOrder.title}
                    subtitle={currentOrder.subtitle}
                    price={currentOrder.price || "20"}
                    image={currentOrder.image}
                />
            </View>
 
            <View style={styles.customerContainer}>
                <AppText style={styles.title}>{t('customer_details')}</AppText>
                <CustomerCard
                    name={currentOrder.rawOrder?.userName || "Henrey"}
                    email={currentOrder.rawOrder?.userEmail || "xvy@gmail.com"}
                    address={currentOrder.rawOrder?.userAddress || "Street 1 Block V Johar"}
                    image={currentOrder.rawOrder?.userPhoto ? { uri: currentOrder.rawOrder.userPhoto } : IMAGES.MAN2}
                />
            </View>

            <View style={styles.riderContainer}>
                <AppText style={styles.title}>{t('delivery_partner')}</AppText>
                {loadingAssignedRider ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : assignedRider ? (
                    <CustomerCard
                        name={assignedRider.displayName || assignedRider.email || ''}
                        email={assignedRider.email || ''}
                        address={assignedRider.isOnline ? t('online') : t('offline')}
                        image={assignedRider.photoURL ? { uri: assignedRider.photoURL } : IMAGES.MAN2}
                    />
                ) : (
                    <View style={styles.noRiderCard}>
                        <AppText style={styles.noRiderText}>{t('no_rider_assigned')}</AppText>
                        {currentOrder.status === 'order_placed' && (
                            <TouchableOpacity
                                style={styles.assignRiderButton}
                                activeOpacity={0.8}
                                onPress={() => setAssignModalVisible(true)}
                            >
                                <AppText style={styles.assignRiderButtonText}>{t('assign_rider')}</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </>
    );
 
    const renderBuyerView = () => (
        <>
            <View style={styles.productContainer}>
                <AppText style={styles.title}>{t('Product')}</AppText>
                <ProductCard
                    title={currentOrder.title}
                    subtitle={currentOrder.subtitle}
                    price={currentOrder.price || "20"}
                    image={currentOrder.image}
                />
            </View>
 
            <View style={styles.storeContainer}>
                <AppText style={styles.title}>{t('Store_Details')}</AppText>
                <StoreCard
                    title={sellerInfo?.name || currentOrder.sellerName || t('gas_store')}
                    time={currentOrder.rawOrder?.estimatedDeliveryMin || '20'}
                    rating={sellerInfo?.rating || currentOrder.sellerRating || '4.9'}
                    image={sellerInfo?.photo || currentOrder.sellerImage || IMAGES.NOTIFICATION_CYLINDER}
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

            {assignedRider && (
                <View style={styles.riderContainer}>
                    <AppText style={styles.title}>{t('delivery_partner')}</AppText>
                    <CustomerCard
                        name={assignedRider.displayName || assignedRider.email || ''}
                        email={assignedRider.email || ''}
                        address={assignedRider.isOnline ? t('online') : t('offline')}
                        image={assignedRider.photoURL ? { uri: assignedRider.photoURL } : IMAGES.MAN2}
                    />
                </View>
            )}
        </>
    );
 
    const handleConfirmCancel = async () => {
        setCancelModalVisible(false);
        if (currentOrder.id) {
            try {
                await orderRepository.updateOrderStatus(currentOrder.id, 'cancelled');
                Alert.alert(t('Success'), t('order_cancelled_success'));
                navigation.goBack();
            } catch (err) {
                console.error('Failed to cancel order:', err);
                Alert.alert(t('Error'), t('failed_to_cancel_order'));
            }
        }
    };
 
    const handleConfirmDelivered = async () => {
        setOtpModalVisible(false);
        if (currentOrder.id) {
            try {
                await orderRepository.updateOrderStatus(currentOrder.id, 'delivered');
                Alert.alert(t('Success'), t('order_delivered_success_alert'));
                navigation.goBack();
            } catch (err) {
                console.error('Failed to update status:', err);
                Alert.alert(t('Error'), t('failed_to_update_order_status'));
            }
        }
    };
 
    const canCancel = (isSeller && currentStatus === 'pending') || (!isSeller && currentOrder.status === 'order_placed');
 
    const getStatusColor = () => {
        const s = isSeller ? (currentStatus === 'pending' ? currentOrder.status : currentStatus) : currentOrder.status;
        switch (s) {
            case 'delivered': return colors.primary;
            case 'cancelled': return colors.error;
            case 'dispatched': return colors.orange;
            case 'order_placed': return colors.secondary;
            default: return colors.textSecondary;
        }
    };
 
    const isOrderLoading = !currentOrder || (!currentOrder.products && (!currentOrder.rawOrder || !currentOrder.rawOrder.products));

    if (loadingSeller || isOrderLoading) {
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
                            {t(isSeller ? (currentStatus === 'pending' ? currentOrder.status : currentStatus) : currentOrder.status)}
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
                amount={currentOrder.price || "20"}
            />
            <AssignRiderModal
                visible={assignModalVisible}
                onClose={() => setAssignModalVisible(false)}
                onSelectRider={handleAssignRider}
                riders={riders}
                loading={loadingRiders}
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
    riderContainer: {
        paddingHorizontal: wp(6),
        marginTop: hp(2),
    },
    noRiderCard: {
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2.5),
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray + '50',
    },
    noRiderText: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginBottom: hp(1.5),
    },
    assignRiderButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: wp(6),
        paddingVertical: hp(1.2),
        borderRadius: 20,
    },
    assignRiderButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 14,
    },
})