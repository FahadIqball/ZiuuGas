import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, spacing } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';

interface EarningCardProps {
    title: string;
    value: string | number;
}

export const EarningCard: React.FC<EarningCardProps> = ({ title, value }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <View style={styles.card}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.value}>{value}</AppText>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: spacing.s,
        paddingLeft: hp(1),
        width: '48%',
        marginBottom: spacing.s,
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.secondary,
        marginBottom: hp(1),
    },
    value: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: FONT.regular,
    },
});
