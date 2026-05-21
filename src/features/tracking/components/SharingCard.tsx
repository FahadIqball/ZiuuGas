import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

interface SharingCardProps {
    orderCode: string;
    onShare: () => void;
}

export const SharingCard: React.FC<SharingCardProps> = ({ orderCode, onShare }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.labelContainer}>
                    <AppText style={styles.label}>{t('share_code_msg1')}<AppText style={styles.codeTxt}>{t('code')}</AppText>{t('share_code_msg2')}</AppText>
                    <AppText style={styles.code}>{orderCode}</AppText>
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginHorizontal: wp(6),
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    labelContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    codeTxt: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.primary,
    },
    code: {
        fontSize: 40,
        fontFamily: FONT.semiBold,
        color: colors.secondary,
        marginTop: hp(0.5),
    },
    shareButton: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
