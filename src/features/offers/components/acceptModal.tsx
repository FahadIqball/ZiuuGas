import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';

interface AcceptOfferModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: string;
}

export const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({ visible, onClose, onConfirm, amount }) => {
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
                        <AppText style={styles.title}>{t('offer_message')}</AppText>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.rejectButton]}
                            activeOpacity={0.8}
                            onPress={onClose}
                        >
                            <AppText style={styles.rejectButtonText}>{t('NO')}</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            activeOpacity={0.8}
                            onPress={onConfirm}
                        >
                            <AppText style={styles.acceptButtonText}>{t('YES')}</AppText>
                        </TouchableOpacity>
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
        marginBottom: hp(3),
    },
    title: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: hp(1),
        gap: wp(3),
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
        backgroundColor: colors.lightGray,
    },
    acceptButton: {
        backgroundColor: colors.primary,
    },
    rejectButtonText: {
        color: colors.textSecondary,
        fontFamily: FONT.medium,
        fontSize: 16,
    },
    acceptButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 16,
    },
});