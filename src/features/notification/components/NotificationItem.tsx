import React from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';

interface NotificationItemProps {
    store?: string;
    message: string;
    time: string;
    image?: any;
    variant?: 'default' | 'seller';
    title?: string;
    orderNo?: string;
    style?: ViewStyle;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    store,
    message,
    time,
    image,
    variant = 'default',
    title,
    orderNo,
    style
    }: NotificationItemProps) => {
        const { colors } = useTheme();
        const styles = useStyles(createStyles);
        const { t } = useTranslation();

    if (variant === 'seller') {
        return (
            <View style={[styles.sellerContainer, style]}>
                <View style={styles.content}>
                    {image && (
                        <Image source={image} style={styles.avatar} resizeMode="cover" />
                    )}
                    <View style={[styles.textContainer, !image && { marginLeft: 0 }]}>
                        <AppText color={colors.secondary} style={styles.sellerTitle}>
                            {title || store}
                        </AppText>
                        <View style={styles.messageRow}>
                            <AppText style={styles.sellerMessage}>
                                {message}
                            </AppText>
                            {orderNo && (
                                <AppText style={styles.orderNoLabel}>
                                    {' '}{t('order_no')}<AppText style={styles.orderNoValue}>{orderNo}</AppText>
                                </AppText>
                            )}
                        </View>
                    </View>
                </View>
                <AppText variant="product" color={colors.secondary} style={styles.sellerTime}>
                    {time}
                </AppText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={image} style={styles.image} resizeMode="contain" />
                <View style={styles.textContainer}>
                    <AppText style={styles.storeName}>
                        {store}
                    </AppText>
                    <AppText style={styles.message}>
                        {message}
                    </AppText>
                </View>
            </View>
            <AppText style={styles.time}>
                {time}
            </AppText>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        marginHorizontal: wp(6),
        marginBottom: hp(2),
        borderRadius: 20,
    },
    sellerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        marginHorizontal: wp(6),
        marginBottom: hp(2),
        borderRadius: 20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: hp(6),
        height: hp(6),
        borderRadius: 12,
    },
    avatar: {
        width: hp(6.5),
        height: hp(6.5),
        borderRadius: hp(3.25),
    },
    textContainer: {
        marginLeft: wp(4),
        flex: 1,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    storeName: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.text,
    },
    sellerTitle: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    message: {
        fontSize: 10,
        fontFamily: FONT.regular,
        marginTop: 2,
        color: colors.textSecondary,
    },
    sellerMessage: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginTop: 2,
    },
    orderNoLabel: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginTop: 2,
    },
    orderNoValue: {
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    time: {
        marginTop: hp(2.5),
        fontSize: 10,
        fontFamily: FONT.medium,
        marginLeft: wp(2),
        color: colors.textSecondary,
    },
    sellerTime: {
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginLeft: wp(4),
    },
});
