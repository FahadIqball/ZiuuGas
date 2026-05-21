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
import { TxKeyPath } from '../../../context/LanguageContext';
import { SVG } from '../../../assets';

interface ProductCardProps {
    title: string;
    subtitle: string;
    price: string;
    image: any;
    onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, subtitle, price, image, onPress }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <Card style={styles.container}>
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
                            {(() => {
                                const regex = /^(Weight)\s+(.*?(?:kg|liter))/i;
                                const match = title.match(regex);
                                if (match) {
                                    const value = match[2];
                                    return (
                                        <AppText style={styles.storeName}>
                                            {t('Weight')} <AppText style={styles.weightPart}>{value}</AppText>
                                        </AppText>
                                    );
                                }
                                return title;
                            })()}
                        </AppText>
                        <View style={styles.paymentColumn}>
                            <AppText style={styles.paypalText}>{t('easypaisa')}-PK</AppText>
                            <AppText style={styles.paypalText}>{t('paypal1')}</AppText>
                            <AppText style={styles.paypalText}>{t('bank_transfer1')}</AppText>
                        </View>
                    </View>

                    <AppText style={styles.infoText}>
                        {(() => {
                            const lowerKey = subtitle.toLowerCase();
                            const trans = t(lowerKey as TxKeyPath);
                            return trans === lowerKey ? subtitle : trans;
                        })()}
                    </AppText>

                    <View style={styles.bottomRow}>
                        <View style={styles.timeRow}>
                            <SVG.Clock width={wp(3)} height={hp(2)} />
                            <AppText style={styles.timeText}>20 {t('mins')}</AppText>
                        </View>
                        <AppText style={styles.priceText}>
                            {t('price_label')} <AppText style={styles.priceValue}>{price}{t('currency')}</AppText>
                        </AppText>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginBottom: hp(2),
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: wp(4),
    },
    header: {
        flexDirection: 'row',
    },
    imageBox: {
        width: wp(15),
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImage: {
        width: '100%',
        height: '100%',
    },
    storeDetails: {
        flex: 1,
        marginLeft: wp(3),
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    storeName: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.secondary,
        flex: 1,
    },
    weightPart: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: FONT.medium,
    },
    paymentColumn: {
        alignItems: 'flex-end',
    },
    paypalText: {
        color: colors.textSecondary,
        fontSize: 10,
        fontFamily: FONT.regular,
        lineHeight: 11,
    },
    infoText: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
        marginTop: -hp(1.5),
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: hp(0.1),
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginLeft: wp(1),
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
});
