import { StyleSheet, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, wp } from '../../../enums/spacing'
import { MapCard } from '../components/MapCard'
import { IMAGES } from '../../../assets'
import { useTrackOrder } from '../hooks/useTrackOrder'
import { StatusStepper } from '../components/StatusStepper'
import { SharingCard } from '../components/SharingCard'
import { AppText } from '../../../common/components/Typography/Typography'
import { FONT } from '../../../enums/typography'

const TrackOrderScreen = ({ route }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { orderId } = route?.params || {};
    const { trackingData, isLoading, handleShareCode, isStatusDone } = useTrackOrder(orderId);

    if (isLoading || !trackingData) {
        return (
            <View style={styles.container}>
                <ScreenHeader title={t('Track_Order')} showBackButton={true} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('Track_Order')}
                showBackButton={true}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.trackContainer}>
                    <View style={styles.mapContainer}>
                        {/* INSERT MAP HERE */}
                        <Image source={IMAGES.MAP} style={styles.mapImage} />
                    </View>
                </View>

                <View style={styles.storeCardSection}>
                    <MapCard
                        title={trackingData.storeName || t('gas_cylinder_store')}
                        time={trackingData.estimatedDelivery}
                        rating={trackingData.rating || '4.5'}
                        price={trackingData.price || '20'}
                        image={trackingData.storeImage ? { uri: trackingData.storeImage } : IMAGES.CYLINDER_STORE}
                        buttonText={t('view_details')}
                        onPress={() => { }}
                        orderCode={trackingData.orderCode}
                    />
                </View>

                {/* Sharing Card Section */}
                <SharingCard
                    orderCode={trackingData.orderCode}
                    onShare={handleShareCode}
                />
                <AppText style={styles.status}>{t('status')}</AppText>
                {/* Status Stepper Section */}
                <StatusStepper
                    currentStatus={trackingData.currentStatus}
                    isStatusDone={isStatusDone}
                />
            </ScrollView>
        </View>
    )
}

export default TrackOrderScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: hp(2),
    },
    trackContainer: {
        paddingHorizontal: wp(6),
        marginTop: hp(1),
    },
    mapContainer: {
        height: hp(25),
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: hp(3),
        overflow: 'hidden',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    storeCardSection: {
        marginTop: hp(2),
    },
    status: {
        marginHorizontal: wp(6),
        fontSize: 16,
        fontFamily: FONT.semiBold,
        color: colors.secondary,
    }
})