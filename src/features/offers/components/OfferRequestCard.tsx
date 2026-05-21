import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';
import { FONT } from '../../../enums/typography';

import { IMAGES } from '../../../assets';

interface OfferRequestCardProps {
    title: string;
    subtitle: string;
    image: ImageSourcePropType;
    userName?: string;
    userPhotoURL?: string;
    onSendOffer?: () => void;
}

export const OfferRequestCard: React.FC<OfferRequestCardProps> = ({ 
    title, 
    subtitle, 
    image, 
    userName, 
    userPhotoURL, 
    onSendOffer 
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const renderTitle = () => {
        const regex = /^(Weight)\s+(.*?(?:kg|liter))/i;
        const match = title.match(regex);

        if (match) {
            const [_, prefix, value] = match;
            return (
                <AppText style={styles.title}>
                    {t('Weight')} <AppText style={styles.weightPart}>{value}</AppText>
                </AppText>
            );
        }

        return <AppText style={styles.title}>{title}</AppText>;
    };

    const renderSubtitle = () => {
        const lowerKey = subtitle.toLowerCase();
        const trans = t(lowerKey as TxKeyPath);
        return trans === lowerKey ? subtitle : trans;
    };

    const avatarSource = userPhotoURL ? { uri: userPhotoURL } : IMAGES.MAN;

    return (
        <View style={styles.container}>
            {userName && (
                <View style={styles.requesterHeader}>
                    <Image source={avatarSource} style={styles.avatar} />
                    <AppText style={styles.requesterText}>
                        {t('requested_by')} <AppText style={styles.requesterName}>{userName}</AppText>
                    </AppText>
                </View>
            )}
            {userName && <View style={styles.divider} />}
            <View style={styles.productRow}>
                <View style={styles.leftSection}>
                    <View style={styles.imageWrapper}>
                        <Image source={image} style={styles.image} resizeMode="contain" />
                    </View>
                    <View style={styles.textContainer}>
                        {renderTitle()}
                        <AppText style={styles.subtitle}>{renderSubtitle()}</AppText>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onSendOffer}>
                    <AppText style={styles.buttonText}>{t('send_offer')}</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        marginHorizontal: wp(6),
        marginBottom: hp(2),
        alignItems: 'stretch',
    },
    requesterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    avatar: {
        width: hp(3),
        height: hp(3),
        borderRadius: hp(1.5),
        marginRight: wp(2.5),
        backgroundColor: colors.inputBackground,
    },
    requesterText: {
        fontSize: 11,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    requesterName: {
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: hp(1),
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    imageWrapper: {
        width: hp(6),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(3),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.secondary,
    },
    weightPart: {
        fontSize: 12,
        color: colors.primary,
        fontFamily: FONT.medium,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
        marginTop: 2,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 10,
        fontFamily: FONT.medium,
    },
});
