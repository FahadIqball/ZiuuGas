import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { AppText } from '../../../common/components/Typography/Typography'
import { hp, wp } from '../../../enums/spacing'
import { FONT } from '../../../enums/typography'
import { Input } from '../../../common/components/Input'
import { SVG } from '../../../assets'
import { Button } from '../../../common/components/Button'
import { RechargeWalletModal } from '../components/rechargeWallet'
import { PaymentMethodModal } from '../components/paymentMethodModal'
import { useAuth } from '../../../context/AuthContext'
import { offerRepository } from '../../../services/offerService'

const SendOffer = ({ route, navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    const request = route.params?.request;

    const [price, setPrice] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ id: string, title: string } | null>(null);
    
    const [rechargeWalletModalVisible, setRechargeWalletModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendOffer = async () => {
        if (!user || !request) return;

        if (!price || !estimatedTime || !selectedPaymentMethod) {
            Alert.alert(t('Error'), t('fill_all_fields'));
            return;
        }

        setIsSubmitting(true);
        try {
            await offerRepository.sendOffer({
                requestId: request.id,
                sellerId: user.uid,
                sellerName: user?.displayName || t('gas_store'),
                userId: request.userId,
                price: parseFloat(price),
                estimatedTime: estimatedTime,
                paymentMethod: selectedPaymentMethod.title,
                status: 'pending',
                title: request.title,
                image: request.image,
            });

            Alert.alert(t('Success'), t('offer_sent_success'), [
                { text: t('OK'), onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            console.error('Error sending offer:', err);
            Alert.alert(t('Error'), t('failed_to_send_offer'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('send_offer')}
                showBackButton={true}
            />
            <View style={styles.content}>
                <Input
                    placeholder={t('enter_price')}
                    placeholderTextColor={colors.inputPlaceholder}
                    inputContainerStyle={styles.inputContainerStyle}
                    label={t('price')}
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <Input
                    placeholder={t('enter_estimated_time')}
                    placeholderTextColor={colors.inputPlaceholder}
                    inputContainerStyle={styles.inputContainerStyle}
                    label={t('estimated_time')}
                    style={styles.input}
                    value={estimatedTime}
                    onChangeText={setEstimatedTime}
                />

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setPaymentModalVisible(true)}
                >
                    <Input
                        placeholder={t('enter_payment_method')}
                        placeholderTextColor={colors.inputPlaceholder}
                        inputContainerStyle={styles.inputContainerStyle}
                        editable={false}
                        pointerEvents="none"
                        label={t('payment_method1')}
                        rightIcon={<SVG.ArrowDown stroke={colors.secondary} style={styles.arrowIcon} />}
                        style={styles.input}
                        value={selectedPaymentMethod?.title || ''}
                    />
                </TouchableOpacity>
            </View>
            <Button
                title={t('send_offer')}
                style={styles.sendOfferButton}
                onPress={handleSendOffer}
                disabled={isSubmitting}
            >
                {isSubmitting ? <ActivityIndicator color={colors.white} /> : null}
            </Button>
            
            <RechargeWalletModal
                visible={rechargeWalletModalVisible}
                onClose={() => setRechargeWalletModalVisible(false)}
                onConfirm={() => setRechargeWalletModalVisible(false)}
                amount="1000"
            />
            <PaymentMethodModal
                visible={paymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                selectedMethodId={selectedPaymentMethod?.id}
                onSelect={(method) => setSelectedPaymentMethod(method)}
            />
        </View>
    )
}

export default SendOffer

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginBottom: hp(1),
    },
    inputContainerStyle: {
        height: hp(6),
        borderRadius: 10,
        paddingLeft: wp(3),
        backgroundColor: colors.inputBackground,
        borderColor: colors.border,
    },
    arrowIcon: {
        width: wp(5),
        height: hp(5),
    },
    sendOfferButton: {
        height: hp(6),
        marginHorizontal: wp(6),
        marginBottom: hp(2),
        borderRadius: 20,
    },
    input: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.secondary,
    }
});