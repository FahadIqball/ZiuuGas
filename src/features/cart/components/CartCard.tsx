import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { SVG } from '../../../assets';
import { QuantitySelector } from '../../products/components/QuantitySelector';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

interface CartCardProps {
    title: string;
    rating: string;
    price: string;
    image: any;
    onDelete?: () => void;
}

export const CartCard: React.FC<CartCardProps> = ({ title, rating, price, image, onDelete }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const renderRightActions = () => {
        return (
            <TouchableOpacity
                style={styles.deleteButtonContainer}
                onPress={onDelete}
                activeOpacity={0.8}
            >
                <View style={styles.deleteButton}>
                    <SVG.Trash fill={colors.error} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
            <Card style={styles.container}>
                <View style={styles.Viewcontainer}>
                    <View style={styles.header}>
                        <View style={styles.imageBox}>
                            <Image
                                source={image}
                                style={styles.storeImage}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.storeDetails}>
                            <View style={styles.titleRow}>
                                <AppText color={colors.secondary} style={styles.storeName}>
                                    {title}
                                </AppText>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <AppText style={[styles.starimage, { color: colors.orange }]}>★ </AppText>
                                    <AppText style={styles.infoText}>{rating} {"(150 " + t('reviews') + ")"}</AppText>
                                </View>
                            </View>

                            <View style={styles.paymentRow}>
                                <AppText style={styles.priceText}>
                                    {t('price_label')} <AppText style={styles.priceValue}>{price}{t('currency')}</AppText>
                                </AppText>
                            </View>
                            <View>
                                <QuantitySelector
                                    quantity={quantity}
                                    onIncrement={handleIncrement}
                                    onDecrement={handleDecrement}
                                    containerStyle={styles.quantitySelector}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        </Swipeable>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginBottom: hp(2),
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    deleteButtonContainer: {
        marginBottom: hp(2),
        marginLeft: wp(3),
        justifyContent: 'center',
    },
    deleteButton: {
        width: wp(16),
        height: '100%',
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.lightRed,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantitySelector: {
        paddingHorizontal: wp(-1),
        height: hp(2.8),
    },
    Viewcontainer: {
    },
    header: {
        flexDirection: 'row',
    },
    imageBox: {
        width: hp(9),
        height: hp(11),
        backgroundColor: colors.background,
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(0.5),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImage: {
        resizeMode: "contain",
        width: hp(6),
        height: hp(6),
    },
    storeDetails: {
        flex: 1,
        marginLeft: hp(1.5),
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: 12,
        fontFamily: FONT.medium,
        flex: 1,
    },
    priceText: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    },
    priceValue: {
        color: colors.primary,
        fontSize: 12,
        fontFamily: FONT.semiBold,
    },
    infoRow: {
        flexDirection: 'row',
        gap: wp(4),
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starimage: {
        fontSize: 15,
    },
    infoText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
