import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, wp } from '../../../enums/spacing'
import { MapCard } from '../components/MapCard'
import { IMAGES, SVG } from '../../../assets'
import { useTrackOrder } from '../hooks/useTrackOrder'
import { StatusStepper } from '../components/StatusStepper'
import { SharingCard } from '../components/SharingCard'
import { AppText } from '../../../common/components/Typography/Typography'
import { FONT } from '../../../enums/typography'
import { Card } from '../../../common/components/Card/Card'

const TrackOrderScreen = ({ route }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { orderId } = route?.params || {};
    const { trackingData, isLoading, handleShareCode, isStatusDone } = useTrackOrder(orderId);

    const handleCall = (phone?: string) => {
        const num = phone || '1234567890';
        Linking.openURL(`tel:${num}`);
    };

    const handleWhatsApp = (phone?: string) => {
        const num = phone || '1234567890';
        Linking.openURL(`whatsapp://send?phone=${num}`);
    };

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
                        <Image source={IMAGES.MAP} style={styles.mapImage} />
                    </View>
                </View>

                {trackingData.riderId && (
                    <Card style={styles.riderCard}>
                        <View style={styles.riderHeader}>
                            <View style={styles.riderImageContainer}>
                                <Image
                                    source={trackingData.riderPhoto ? { uri: trackingData.riderPhoto } : IMAGES.MAN}
                                    style={styles.riderImage}
                                />
                            </View>
                            <View style={styles.riderInfo}>
                                <AppText style={styles.riderRoleText}>
                                    {t('delivery_partner')}
                                </AppText>
                                <AppText style={styles.riderNameText}>
                                    {trackingData.riderName}
                                </AppText>
                                {trackingData.riderPhone ? (
                                    <AppText style={styles.riderPhoneText}>
                                        {trackingData.riderPhone}
                                    </AppText>
                                ) : null}
                            </View>
                            <View style={styles.contactButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.contactButton, { backgroundColor: colors.lightGray }]}
                                    onPress={() => handleCall(trackingData.riderPhone)}
                                >
                                    <AppText style={[styles.contactButtonText, { color: colors.secondary }]}>
                                        {t('call')}
                                    </AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.contactButton, { backgroundColor: colors.whatsappBrand }]}
                                    onPress={() => handleWhatsApp(trackingData.riderPhone)}
                                >
                                    <AppText style={[styles.contactButtonText, { color: colors.white }]}>
                                        {t('whatsapp')}
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card>
                )}

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
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        backgroundColor: colors.white,
        padding: 6,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: colors.primary,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    riderCard: {
        marginHorizontal: wp(6),
        marginTop: hp(2),
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    riderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(1),
    },
    riderImageContainer: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(3),
        overflow: 'hidden',
        backgroundColor: colors.background,
    },
    riderImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    riderInfo: {
        flex: 1,
        marginLeft: hp(1.5),
    },
    riderRoleText: {
        fontSize: 11,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    riderNameText: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginTop: hp(0.2),
    },
    riderPhoneText: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginTop: hp(0.1),
    },
    contactButtonsContainer: {
        flexDirection: 'row',
        gap: wp(2),
    },
    contactButton: {
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(3),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactButtonText: {
        fontSize: 11,
        fontFamily: FONT.medium,
    },
})