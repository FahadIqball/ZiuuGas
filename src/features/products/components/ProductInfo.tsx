import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { Rating } from 'react-native-ratings';

interface ProductInfoProps {
    name: string;
    price: string;
    rating: number;
    reviewCount: number;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ name, price, rating, reviewCount }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText style={styles.name}>{name}</AppText>
                <AppText style={styles.priceLabel}>
                    {t('price_label')} <AppText style={styles.priceValue}>{price}{t('currency')}</AppText>
                </AppText>
            </View>

            <View style={styles.ratingRow}>
                <Rating
                    type='star'
                    ratingCount={1}
                    imageSize={14}
                    readonly
                    startingValue={rating}
                    fractions={1}
                    style={styles.rating}
                    tintColor={colors.background}
                />
                <AppText style={styles.reviewCount}>
                    {rating}({reviewCount} {t('reviews')})
                </AppText>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginTop: hp(2),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    },
    priceValue: {
        fontSize: 14,
        fontFamily: FONT.semiBold,
        color: colors.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    rating: {
        alignItems: 'flex-start',
    },
    reviewCount: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginLeft: wp(1),
    },
});
