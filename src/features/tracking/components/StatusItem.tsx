import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';

interface StatusItemProps {
    label: TxKeyPath;
    isDone: boolean;
    isLast: boolean;
    Icon: React.FC<any>;
}

export const StatusItem: React.FC<StatusItemProps> = ({ label, isDone, isLast, Icon }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.leftColumn}>
                <View style={[styles.iconWrapper, isDone ? styles.iconDone : styles.iconPending]}>
                    <Icon
                        width={wp(5)}
                        height={wp(5)}
                        fill={isDone ? colors.white : colors.primary}
                    />
                </View>
                {!isLast && <View style={[styles.connector, isDone && styles.connectorDone]} />}
            </View>
            <View style={styles.rightColumn}>
                <AppText style={[styles.label, isDone ? styles.labelDone : styles.labelPending]}>
                    {t(label)}
                </AppText>
                <AppText style={styles.time}>June 10,2025 | 3:45pm</AppText>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    leftColumn: {
        alignItems: 'center',
        width: wp(12),
    },
    iconWrapper: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    iconDone: {
        backgroundColor: colors.primary,
    },
    iconPending: {
        backgroundColor: colors.lytBlue,
    },
    connector: {
        width: 2,
        height: hp(5),
        backgroundColor: colors.lytBlue,
        marginTop: -hp(0.5),
        marginBottom: -hp(0.5),
    },
    connectorDone: {
        backgroundColor: colors.primary,
    },
    rightColumn: {
        justifyContent: 'center',
        marginLeft: wp(2),
        height: wp(10),
    },
    label: {
        fontSize: 12,
        fontFamily: FONT.medium,
    },
    labelDone: {
        color: colors.secondary,
    },
    labelPending: {
        color: colors.textSecondary,
    },
    time: {
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    }
});
