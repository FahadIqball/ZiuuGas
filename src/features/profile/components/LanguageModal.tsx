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
import { LocaleType } from '../../../context/LanguageContext';

interface LanguageModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (locale: LocaleType) => void;
    selectedLocale: LocaleType;
}

const LANGUAGES: { code: LocaleType; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
    visible,
    onClose,
    onSelect,
    selectedLocale
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [localLocale, setLocalLocale] = useState<LocaleType>(selectedLocale);

    useEffect(() => {
        if (visible) {
            setLocalLocale(selectedLocale);
        }
    }, [visible, selectedLocale]);

    const handleDone = () => {
        onSelect(localLocale);
        onClose();
    };

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
                        <AppText style={styles.title}>{t('selectLanguage')}</AppText>
                        <TouchableOpacity style={styles.doneContainer} onPress={handleDone}>
                            <AppText style={styles.doneText}>{t('done')}</AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        {LANGUAGES.map((lang) => {
                            const isSelected = localLocale === lang.code;

                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={styles.row}
                                    onPress={() => setLocalLocale(lang.code)}
                                    activeOpacity={0.7}
                                >
                                    <AppText style={styles.rowTitle}>{lang.label}</AppText>
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
