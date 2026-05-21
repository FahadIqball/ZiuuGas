import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose, onConfirm }) => {
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
                        <AppText style={styles.title}>{t('logout_message')}</AppText>
                    </View>

                    <View style={styles.buttonRow}>
                        <Button
                            title={t('NO')}
                            variant='outline'
                            activeOpacity={0.8}
                            onPress={onClose}
                            style={styles.rejectButton}
                            textStyle={styles.rejectButtonText}
                        />
                        <Button
                            title={t('YES')}
                            variant='primary'
                            activeOpacity={0.8}
                            onPress={onConfirm}
                            style={styles.acceptButton}
                            textStyle={styles.acceptButtonText}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(1),
        width: '100%',
        height: hp(5.5),
    },
    button: {
        flex: 1,
        height: hp(5.5),
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        width: wp(35),
        height: hp(6),
        borderRadius: hp(4),
        backgroundColor: colors.lightGray,
    },
    acceptButton: {
        width: wp(35),
        height: hp(6),
        borderRadius: hp(4),
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
});