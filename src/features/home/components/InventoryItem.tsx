import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { spacing } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { FONT } from '../../../enums/typography';

interface InventoryItemProps {
    title: string;
    stock: number;
    price: string | number;
    image: ImageSourcePropType;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ title, stock, price, image }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} resizeMode="contain" />
            <View style={styles.content}>
                <AppText style={styles.title}>{title}</AppText>
                <AppText style={styles.stock}>{stock} {t('inStock')}</AppText>
            </View>
            <View style={styles.priceContainer}>
                <AppText style={styles.priceLabel}>{t('price')}</AppText>
                <AppText style={styles.priceValue}>${price}</AppText>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: spacing.m,
        marginBottom: spacing.m,
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        marginRight: spacing.m,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        color: colors.secondary,
        fontFamily: FONT.regular
    },
    stock: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.secondary,
    },
    priceValue: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.primary
    },
});
