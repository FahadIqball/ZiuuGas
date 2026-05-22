import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { SVG } from '../../../assets';

interface MapCardProps {
    title: string;
    time: string;
    rating: string;
    price: string;
    image: any;
    buttonText: string;
    onPress?: () => void;
    orderCode?: string;
}

export const MapCard: React.FC<MapCardProps> = ({ title, time, rating, price, image, buttonText, onPress, orderCode }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
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
                            <View style={styles.paymentColumn}>
                                <AppText style={styles.priceText}>{t('price')}</AppText>
                                <AppText style={styles.paypalText}>{price}{t('currency')}</AppText>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <SVG.Clock stroke={colors.textSecondary} style={styles.clock} />
                                <AppText style={styles.infoText}>{time} {t('mins')}</AppText>
                            </View>
                            <View style={styles.infoItem}>
                                <AppText style={[styles.starimage, { color: colors.orange }]}>★ </AppText>
                                <AppText style={styles.infoText}>{rating} {t('ratings')}</AppText>
                            </View>
                        </View>

                        <View style={styles.paymentRow}>
                            <AppText style={styles.orderText}>
                                {t('order_no')} <AppText style={styles.priceValue}>{orderCode ? `#${orderCode}` : ''}</AppText>
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    content: {
        gap: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 3,
    },
    image: {
        width: wp(7.5),
        height: hp(8.5),
    },
    textContainer: {
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: '700',
        fontSize: 11,
    },
    container: {
        marginBottom: hp(2),
        marginHorizontal: wp(6),
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    Viewcontainer: {
        paddingVertical: wp(1),
        paddingHorizontal: wp(1),
    },
    header: {
        flexDirection: 'row',
    },
    imageBox: {
        width: hp(5),
        height: hp(6),
        backgroundColor: colors.background,
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(0.5),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImage: {
        width: hp(4),
        height: hp(4),
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
    paymentColumn: {
        paddingHorizontal: wp(4),
        gap: wp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: 14,
        fontFamily: FONT.medium,
        flex: 1,
    },
    orderText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    priceValue: {
        color: colors.secondary,
        fontSize: 12,
        fontFamily: FONT.regular,
    },
    infoRow: {
        flexDirection: 'row',
        gap: wp(4),
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clock: {
        width: wp(1),
        height: hp(0.5),
        marginRight: wp(1),
    },
    iconPlaceholder: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        marginRight: 4,
    },
    starimage: {
        fontSize: 15,
    },
    infoText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    priceText: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    },
    paypalText: {
        color: colors.primary,
        fontSize: 14,
        fontFamily: FONT.semiBold,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: hp(1),
        gap: wp(3),
    },
    button: {
        flex: 1,
        height: hp(5),
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: colors.lightGray,
    },
    acceptButton: {
        backgroundColor: colors.primary,
    },
    rejectButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 12,
    },
    acceptButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 12,
    },
});
