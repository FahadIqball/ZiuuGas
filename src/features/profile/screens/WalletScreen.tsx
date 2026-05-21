import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { AppText } from '../../../common/components/Typography/Typography'
import { Input } from '../../../common/components/Input'
import { hp, wp } from '../../../enums/spacing'
import { FONT } from '../../../enums/typography'
import { Button } from '../../../common/components/Button'

const WalletScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('wallet')}
                showBackButton={true}
            />
            <View style={styles.addPixContainer}>
                <AppText style={styles.addPixHeader}>
                    {t('addPixKey')}
                </AppText>
                <Input
                    placeholder={"Add pix key"}
                    value={""}
                    inputContainerStyle={styles.inputContainer}
                    style={styles.inputStyle}
                    placeholderTextColor={colors.textSecondary}
                />
            </View>
            <View style={styles.footer}>
                <Button
                    title={t('done')}
                    variant="primary"
                    style={styles.footerButton}
                />
            </View>
        </View>
    )
}

export default WalletScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    addPixContainer: {
        flex: 1,
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
    },
    addPixHeader: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginBottom: hp(1.5),
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: wp(2),
    },
    inputStyle: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: wp(6),
        paddingBottom: hp(4),
        backgroundColor: colors.background,
        alignItems: 'center',
    },
    footerButton: {
        alignContent: 'flex-end',
        width: '100%',
        height: hp(6),
    },
})