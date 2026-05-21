import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { useTranslation } from '../../../hooks/useTranslation';

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (method: { id: string; title: string }) => void;
    selectedMethodId?: string;
}

export const PaymentMethodModal: React.FC<PaymentModalProps> = ({
    visible,
    onClose,
    onSelect,
    selectedMethodId
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [localSelectedId, setLocalSelectedId] = useState(selectedMethodId || '');

    const paymentMethods = React.useMemo(() => [
        { id: '1', title: t('paypal1') },
        { id: '2', title: t('bank_transfer1') },
        { id: '3', title: t('easypaisa') },
    ], [t]);

    useEffect(() => {
        if (visible) {
            setLocalSelectedId(selectedMethodId || '');
        }
    }, [visible, selectedMethodId]);

    const handleSelect = (method: { id: string; title: string }) => {
        setLocalSelectedId(method.id);
        onSelect(method);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType='slide'
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText style={styles.title}>{t('select_payment_method')}</AppText>
                    </View>
                    <View style={styles.listContainer}>
                        {paymentMethods.map((method) => {
                            const isSelected = localSelectedId === method.id;

                            return (
                                <TouchableOpacity
                                    key={method.id}
                                    style={styles.methodRow}
                                    onPress={() => handleSelect(method)}
                                    activeOpacity={0.7}
                                >
                                    <AppText style={styles.methodTitle}>{method.title}</AppText>
                                    <View style={styles.radioWrapper}>
                                        {isSelected ? (
                                            <SVG.RadioSelected stroke={colors.primary} width={hp(2)} height={hp(2)} />
                                        ) : (
                                            <SVG.RadioUnSelected stroke={colors.textSecondary} width={hp(2)} height={hp(2)} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
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
        justifyContent: 'flex-end',
    },
    content: {
        width: '100%',
        paddingVertical: hp(3),
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: hp(25),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(8),
        marginBottom: hp(3),
        position: 'relative',
    },
    title: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    listContainer: {
        paddingHorizontal: wp(6),
        gap: hp(2),
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        height: hp(6),
        paddingHorizontal: wp(4),
    },
    methodTitle: {
        flex: 1,
        fontSize: 12,
        fontFamily: FONT.regular,
        color: colors.secondary,
    },
    radioWrapper: {
        marginLeft: wp(2),
    },
});