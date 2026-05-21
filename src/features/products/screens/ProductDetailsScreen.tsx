import { StyleSheet, View, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { Button } from '../../../common/components/Button';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductInfo } from '../components/ProductInfo';
import { SellerDetails } from '../components/SellerDetails';
import { QuantitySelector } from '../components/QuantitySelector';
import { ReviewsCard } from '../../orders/components/ReviewsCard';
import { AddressModal } from '../components/addressModal';
import { useAuth } from '../../../context/AuthContext';
import { cartRepository } from '../../../services/cartService';

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const productId = route.params?.productId;
    const { product, isLoading } = useProductDetails(productId);
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    const handleIncrement = () => setQuantity(q => q + 1);
    const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleBuyNow = async () => {
        if (!user || !product) return;
        try {
            await cartRepository.addToCart(user.uid, {
                id: product.id,
                title: product.name,
                price: parseFloat(product.price) || 0,
                image: product.imageRaw || product.image,
                quantity,
                rating: product.rating,
                sellerId: product.sellerId,
            });
            setAddressModalVisible(true);
        } catch (err) {
            console.error('Failed to add to cart:', err);
            Alert.alert('Error', 'Could not add item to cart.');
        }
    }

    const handleCloseAddressModal = () => {
        setAddressModalVisible(false);
    }

    const handleConfirmAddressModal = () => {
        setAddressModalVisible(false);
    }

    if (isLoading || !product) {
        return (
            <View style={styles.container}>
                <ScreenHeader title={t('details')} showBackButton={true} />
                {/* Loading state can be added here */}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('details')}
                showBackButton={true}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Product Image Section */}
                <View style={styles.imageCard}>
                    <Image
                        source={product.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Product Info Section */}
                <ProductInfo
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                />

                {/* Seller Details Section */}
                <SellerDetails seller={product.seller} />

                {/* Description Section */}
                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>{t('description')}</AppText>
                    <AppText style={styles.descriptionText}>
                        {product.description}
                    </AppText>
                </View>

                {/* Quantity Section */}
                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>{t('quantity')}</AppText>
                    <QuantitySelector
                        quantity={quantity}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                </View>

                {/* Reviews Section */}
                <View style={[styles.section, { paddingBottom: hp(10) }]}>
                    <AppText style={styles.sectionTitle}>{t('reviews')}</AppText>
                    {product.reviews.length > 0 ? product.reviews.map(review => (
                        <ReviewsCard
                            key={review.id}
                            title={review.userName}
                            image={review.avatar}
                            rating={review.rating.toString()}
                            time={review.time}
                            comment={review.comment}
                        />
                    )) : (
                        <AppText color={colors.textSecondary} style={{ textAlign: 'center', marginTop: hp(2) }}>
                            {t('no_reviews')}
                        </AppText>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Buy Now Button */}
            <View style={styles.footer}>
                <Button
                    title={t('buy_now')}
                    variant="primary"
                    style={styles.buyButton}
                    onPress={handleBuyNow}
                />
            </View>
            <AddressModal
                visible={addressModalVisible}
                onClose={handleCloseAddressModal}
                onConfirm={handleConfirmAddressModal}
                navigation={navigation}
            />
        </View>
    )
}

export default ProductDetailsScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: wp(6),
        flexGrow: 1,
    },
    imageCard: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(20),
        borderRadius: 20,
        backgroundColor: colors.white,
        padding: wp(4),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginTop: hp(1),
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    descriptionText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: wp(6),
        paddingBottom: hp(2),
        paddingTop: hp(1),
        backgroundColor: colors.background,
    },
    buyButton: {
        width: '100%',
        height: hp(6.5),
    },
})