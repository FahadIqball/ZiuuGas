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
import { SVG, IMAGES } from '../../../assets';
import { AcceptOfferModal } from './acceptModal';

interface OfferCardProps {
    productTitle: string;
    time: string;
    rating: string;
    price: string;
    image: any;
    buttonText: string;
    onPress?: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    showButtons?: boolean;
    status?: string;
    userName?: string;
    userPhotoURL?: string;
    sellerName?: string;
    sellerPhotoURL?: string;
    isSeller?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
    productTitle, time, rating, price, image, buttonText, onPress, onAccept, onReject,
    showButtons = true,
    status,
    userName,
    userPhotoURL,
    sellerName,
    sellerPhotoURL,
    isSeller = false
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAccept = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirmOffer = () => {
        setIsModalVisible(false);
        if (onAccept) onAccept();
        else if (onPress) onPress();
    };

    const handleReject = () => {
        if (onReject) onReject();
    };

    const getStatusColor = () => {
        switch (status) {
            case 'accepted': return colors.primary;
            case 'rejected': return colors.error;
            case 'pending': return colors.orange;
            default: return colors.textSecondary;
        }
    };

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
                                {productTitle}
                            </AppText>
                            <View style={styles.paymentColumn}>
                                {status ? (
                                    <AppText style={[styles.statusText, { color: getStatusColor() }]}>
                                        {t(status as any)}
                                    </AppText>
                                ) : (
                                    <>
                                        <AppText style={styles.paypalText}>{t('paypal')}</AppText>
                                        <AppText style={styles.paypalText}>{t('bank_transfer')}</AppText>
                                        <AppText style={styles.paypalText}>{t('payment_method')}</AppText>
                                    </>
                                )}
                            </View>
                        </View>

                        <View style={styles.profileBadge}>
                            <Image
                                source={
                                    isSeller
                                        ? (userPhotoURL ? { uri: userPhotoURL } : IMAGES.MAN)
                                        : (sellerPhotoURL ? { uri: sellerPhotoURL } : IMAGES.GAS_STORE)
                                }
                                style={styles.profileAvatar}
                            />
                            <AppText style={styles.profileNameText}>
                                {isSeller
                                    ? `${t('requested_by')} `
                                    : `${t('offered_by')} `
                                }
                                <AppText style={styles.profileNameBold}>
                                    {isSeller
                                        ? (userName || t('user'))
                                        : (sellerName || t('gas_store'))
                                    }
                                </AppText>
                            </AppText>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <SVG.Clock fill={colors.textSecondary} style={styles.clock} />
                                <AppText style={styles.infoText}>{time} {t('mins')}</AppText>
                            </View>
                            <View style={styles.infoItem}>
                                <AppText style={[styles.starimage, { color: colors.orange }]}>★ </AppText>
                                <AppText style={styles.infoText}>{rating} {t('ratings')}</AppText>
                            </View>
                        </View>

                        <View style={styles.paymentRow}>
                            <AppText style={styles.priceText}>
                                {t('price_label')} <AppText style={styles.priceValue}>{price}{t('currency')}</AppText>
                            </AppText>
                        </View>
                    </View>
                </View>

                {showButtons && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.rejectButton]}
                            activeOpacity={0.8}
                            onPress={handleReject}
                        >
                            <AppText style={styles.rejectButtonText}>{t('reject')}</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            activeOpacity={0.8}
                            onPress={handleAccept}
                        >
                            <AppText style={styles.acceptButtonText}>{t('accept')}</AppText>
                        </TouchableOpacity>
                    </View>
                )}
                <AcceptOfferModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmOffer}
                    amount={price}
                />
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
    profileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.3),
        marginBottom: hp(0.5),
    },
    profileAvatar: {
        width: hp(2.2),
        height: hp(2.2),
        borderRadius: hp(1.1),
        marginRight: wp(1.5),
        backgroundColor: colors.background,
    },
    profileNameText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    profileNameBold: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    paymentColumn: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 0,
    },
    storeName: {
        fontSize: 14,
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
        fontSize: 14,
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
    paypalText: {
        color: colors.textSecondary,
        fontSize: 8,
        fontFamily: FONT.regular,
        flexDirection: 'column'
    },
    statusText: {
        fontSize: 10,
        fontFamily: FONT.semiBold,
        textTransform: 'capitalize',
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
        color: colors.textSecondary,
        fontFamily: FONT.medium,
        fontSize: 12,
    },
    acceptButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 12,
    },
});
