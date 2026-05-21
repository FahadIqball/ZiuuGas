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
import { Rating } from 'react-native-ratings';


interface ReviewsCardProps {
    title: string;
    time: string;
    rating: string;
    image: any;
    comment: string;
}

export const ReviewsCard: React.FC<ReviewsCardProps> = ({ title, time, rating, image, comment }) => {
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
                        <View style={styles.nameBox}>
                            <View>
                                <View style={styles.titleRow}>
                                    <AppText color={colors.secondary} style={styles.storeName}>
                                        {title}
                                    </AppText>
                                </View>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Rating
                                            type='star'
                                            ratingCount={5}
                                            imageSize={15}
                                            readonly
                                            startingValue={parseFloat(rating)}
                                            fractions={1}
                                        />
                                    </View>
                                </View>
                            </View>
                            <AppText style={styles.infoText}>{time}</AppText>
                        </View>
                    </View>
                </View>
                <View style={styles.reviewContainer}>
                    <AppText style={styles.reviewText}>{comment}</AppText>
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
        borderRadius: hp(6)
    },
    storeDetails: {
        flex: 1,
        marginLeft: hp(2),
    },
    titleRow: {
        flexDirection: 'row',
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
        fontSize: 10.45,
        fontFamily: FONT.medium,
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
    reviewContainer: {
        marginTop: hp(1.5),
    },
    reviewText: {
        fontSize: 10.45,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    nameBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
