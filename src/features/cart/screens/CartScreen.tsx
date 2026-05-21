import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { hp, wp } from '../../../enums/spacing'
import { CartCard } from '../components/CartCard'
import { Button } from '../../../common/components/Button'
import { Routes } from '../../../constants/routes'
import { useAuth } from '../../../context/AuthContext'
import { cartRepository } from '../../../services/cartService'
import { CartItem } from '../services/types'
import { resolveProductImage } from '../../products/utils/imageResolver'
import { AppText } from '../../../common/components/Typography/Typography'
import { orderRepository } from '../../../services/orderService'
import { addressRepository } from '../../../services/addressService'

const CartScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const items = await cartRepository.getCartItems(user.uid);
            setCartItems(items);
        } catch (err) {
            console.error('Failed to fetch cart items:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    const handlePayNow = async () => {
        if (!user || cartItems.length === 0) return;
        setLoading(true);
        try {
            const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            
            const addresses = await addressRepository.getAddresses(user.uid);
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
            const addressString = defaultAddress 
                ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}, ${defaultAddress.country}`
                : 'Default Address';

            const newOrder = {
                userId: user.uid,
                userName: user.displayName || user.email || 'Jane Doe',
                userEmail: user.email || '',
                userPhoto: user.photoURL || '',
                userAddress: addressString,
                sellerId: cartItems[0]?.sellerId || 'system_default',
                items: cartItems.map(item => ({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                totalPrice,
                status: 'order_placed' as const,
                orderCode: Math.floor(10000 + Math.random() * 90000).toString(),
                estimatedDeliveryMin: '20',
            };

            await orderRepository.placeOrder(newOrder);
            await cartRepository.clearCart(user.uid);
            navigation.navigate(Routes.PAYMENT_SUCCESS);
        } catch (err) {
            console.error('Checkout failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        try {
            await cartRepository.removeFromCart(user.uid, id);
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to delete cart item:', err);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('Cart')}
                showBackButton={true}
            />
            {loading ? (
                <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {cartItems.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <AppText style={{ color: colors.textSecondary, textAlign: 'center' }}>
                                Your cart is empty.
                            </AppText>
                        </View>
                    ) : (
                        cartItems.map((item) => (
                            <CartCard
                                key={item.id}
                                title={item.title}
                                rating={item.rating ? item.rating.toString() : "4.5"}
                                price={item.price.toString()}
                                image={resolveProductImage(item.image)}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))
                    )}
                </ScrollView>
            )}
            {!loading && cartItems.length > 0 && (
                <View style={styles.footer}>
                    <Button
                        onPress={handlePayNow}
                        title={t('Paynow')}
                        style={styles.checkoutButton}
                    />
                </View>
            )}
        </View>
    )
}

export default CartScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        marginTop: hp(1),
        paddingHorizontal: wp(6),
        flexGrow: 1,
    },
    footer: {
        paddingHorizontal: wp(6),
        paddingBottom: hp(2),
    },
    checkoutButton: {
        width: '100%',
        height: hp(6),
    },
})