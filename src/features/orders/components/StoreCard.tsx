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

interface StoreCardProps {
    title: string;
    time: string;
    rating: string;
    image: any;
    onPress?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ title, time, rating, image, onPress }) => {
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
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <SVG.Clock style={styles.clock} />
                                <AppText style={styles.infoText}>{time} {t('mins')}</AppText>
                            </View>
                            <View style={styles.infoItem}>
                                <SVG.Star style={styles.star} />
                                <AppText style={styles.infoRatingText}>{rating} {t('ratings')}</AppText>
                            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImage: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(2)
    },
    storeDetails: {
        flex: 1,
        marginLeft: hp(2),
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(0.5),
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
        justifyContent: 'center',
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
    star: {
        width: wp(2),
        height: hp(1),
    },
    infoText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    infoRatingText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginLeft: wp(1),
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
