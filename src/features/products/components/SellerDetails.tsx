import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { SellerInfo } from '../dummies/productDetails';

interface SellerDetailsProps {
    seller: SellerInfo;
}

export const SellerDetails: React.FC<SellerDetailsProps> = ({ seller }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <AppText style={styles.sectionTitle}>{t('seller_details')}</AppText>

            <View style={styles.contentRow}>
                <Image source={seller.avatar} style={styles.avatar} />

                <AppText style={styles.sellerName}>{seller.name}</AppText>

                <View style={styles.statsContainer}>
                    <AppText style={styles.statValue}>{seller.positiveRatings}</AppText>
                    <View style={styles.statItem}>
                        <AppText style={styles.statLabel}>{t('positive_ratings')}</AppText>
                    </View>

                    <View style={styles.divider} />
                    <AppText style={styles.statValue}>{seller.shippingOnTime}</AppText>
                    <View style={styles.statItem}>
                        <AppText style={styles.shippingstatLabel}>{t('shipping_on_time')}</AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginTop: hp(2),
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginBottom: hp(1.5),
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: hp(5),
        height: hp(5),
        borderRadius: hp(2.5),
    },
    sellerName: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginLeft: wp(3),
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.primary,
        marginLeft: wp(1.5),
    },
    statLabel: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        textAlign: 'center',
        width: wp(20),
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    shippingstatLabel: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        textAlign: 'center',
        width: wp(17),
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    divider: {
        width: 1,
        height: hp(4),
        backgroundColor: colors.lightGray,
    },
});
