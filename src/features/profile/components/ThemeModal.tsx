import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';

interface ThemeModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (themeMode: 'light' | 'dark' | 'system') => void;
    selectedThemeMode: 'light' | 'dark' | 'system';
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
    visible,
    onClose,
    onSelect,
    selectedThemeMode
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [localThemeMode, setLocalThemeMode] = useState<'light' | 'dark' | 'system'>(selectedThemeMode);

    useEffect(() => {
        if (visible) {
            setLocalThemeMode(selectedThemeMode);
        }
    }, [visible, selectedThemeMode]);

    const handleDone = () => {
        onSelect(localThemeMode);
        onClose();
    };

    const THEME_OPTIONS = [
        { code: 'light' as const, labelKey: 'light' },
        { code: 'dark' as const, labelKey: 'dark' },
        { code: 'system' as const, labelKey: 'system' },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType="slide"
        >
            <TouchableOpacity 
                style={styles.overlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={styles.content}
                >
                    <View style={styles.header}>
                        <AppText style={styles.title}>{t('theme')}</AppText>
                        <TouchableOpacity style={styles.doneContainer} onPress={handleDone}>
                            <AppText style={styles.doneText}>{t('done')}</AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        {THEME_OPTIONS.map((option) => {
                            const isSelected = localThemeMode === option.code;

                            return (
                                <TouchableOpacity
                                    key={option.code}
                                    style={styles.row}
                                    onPress={() => setLocalThemeMode(option.code)}
                                    activeOpacity={0.7}
                                >
                                    <AppText style={styles.rowTitle}>{t(option.labelKey as any)}</AppText>
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
                </TouchableOpacity>
            </TouchableOpacity>
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
        marginBottom: hp(2),
        position: 'relative',
    },
    title: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    doneContainer: {
        position: 'absolute',
        right: wp(8),
    },
    doneText: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.primary,
    },
    listContainer: {
        paddingHorizontal: wp(8),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    radioWrapper: {
        marginLeft: wp(2),
    },
});
