import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { SVG } from '../../../assets'
import { hp, wp } from '../../../enums/spacing'
import { AppText } from '../../../common/components/Typography/Typography'
import { useTranslation } from '../../../hooks/useTranslation'
import { FONT } from '../../../enums/typography'
import { Button } from '../../../common/components/Button'
import { Routes } from '../../../constants/routes'
import { useInterstitialAd } from 'react-native-google-mobile-ads'
import { AD_UNIT_IDS } from '../../../constants/ads'

const PaymentSuccessScreen = ({ navigation }: any) => {
    const { isLoaded, isClosed, load, show } = useInterstitialAd(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
    });
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    React.useEffect(() => {
        load();
    }, [load]);

    React.useEffect(() => {
        if (isClosed) {
            // Action to take when ad is closed
            navigation.reset({
                index: 0,
                routes: [{ name: Routes.MAIN_TABS }],
            });
        }
    }, [isClosed, navigation]);

    const handleDone = () => {
        if (isLoaded) {
            show();
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: Routes.MAIN_TABS }],
            });
        }
    };
    return (
        <View style={styles.container}>
            <SVG.Cart style={styles.cartIcon} />
            <AppText style={styles.congrats}>{t("Congratulations")}</AppText>
            <AppText style={styles.success}>{t("Order_Successful")}</AppText>
            <Button
                variant='outline'
                title={t("done")}
                onPress={handleDone}
                style={styles.checkoutButton}
                textStyle={styles.doneTxt}
            />
        </View>
    )
}

export default PaymentSuccessScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(6),
    },
    cartIcon: {
        width: wp(20),
        height: hp(20),
        alignSelf: 'center',
        marginBottom: hp(2),
    },
    congrats: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginBottom: 2,
    },
    success: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    checkoutButton: {
        width: '100%',
        height: hp(6),
    },
    doneTxt: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.primary,
    }
})