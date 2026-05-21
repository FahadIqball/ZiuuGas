import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { Input } from '../../../common/components/Input';

interface OTPModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({ visible, onClose, onConfirm, amount }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <View style={styles.doneButtonContainer}>
                            <Button
                                title={t('cancel')}
                                onPress={onClose}
                                variant='outline'
                                style={styles.doneButton}
                                textStyle={styles.doneButtonText}
                            />
                        </View>
                        <SVG.GreenLike style={styles.warningIcon} />
                        <AppText style={styles.title}>{t('congratulations')}</AppText>
                        <AppText style={styles.subtitle}>{t('order_delivered_success_otp')}</AppText>
                        <AppText style={styles.otpText}>{t('enterOTP')}</AppText>
                        <Input
                            placeholder={t('otp_success_msg')}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={styles.otpInput}
                            inputContainerStyle={styles.otpInputContainer}
                        />
                        <Button
                            title={t('submit')}
                            onPress={onConfirm}
                            style={styles.submitBtn}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(6),
    },
    content: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: hp(3),
        paddingHorizontal: wp(8),
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    iconContainer: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: hp(1),
        width: '100%',
    },
    button: {
        flex: 1,
        height: hp(5.5),
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: '#E8EBF0',
    },
    acceptButton: {
        backgroundColor: colors.primary,
    },
    rejectButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 16,
    },
    acceptButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 16,
    },
    warningIcon: {
        width: wp(10),
        height: hp(10),
        alignSelf: 'center',
        marginBottom: hp(3),
    },
    crossButton: {
        width: wp(8),
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: colors.lytBlue,
        borderRadius: 20,
    },
    crossIcon: {
        width: wp(15),
        height: hp(15),
    },
    doneButton: {
        borderRadius: hp(3),
    },
    doneButtonContainer: {
        alignSelf: 'flex-end',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    doneButtonText: {
        fontFamily: FONT.medium,
        fontSize: 12,
    },
    submitBtn: {
        height: hp(6),
        width: '100%',
        marginTop: hp(2),
        borderRadius: 35,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    otpText: {
        fontSize: 10.02,
        fontFamily: FONT.medium,
        color: colors.secondary,
        textAlign: 'left',
        marginTop: hp(2),
        width: '100%',
    },
    otpInput: {
        fontSize: 10.02,
        fontFamily: FONT.regular,
        height: hp(6),
        borderRadius: hp(3),
    },
    otpInputContainer: {
        height: hp(6),
        width: '100%',
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingLeft: wp(4),
    },
});