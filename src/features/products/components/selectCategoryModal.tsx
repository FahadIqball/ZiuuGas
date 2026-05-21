import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';
import { hp, wp } from '../../../enums/spacing';
import { SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';

import { CATEGORIES } from '../dummies/inventory';

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (category: { id: string; title: string }) => void;
    selectedCategoryId?: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    visible,
    onClose,
    onSelect,
    selectedCategoryId
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [localSelectedId, setLocalSelectedId] = useState(selectedCategoryId || '');

    useEffect(() => {
        if (visible) {
            setLocalSelectedId(selectedCategoryId || '');
        }
    }, [visible, selectedCategoryId]);

    const handleDone = () => {
        const category = CATEGORIES.find(c => c.id === localSelectedId);
        if (category) {
            onSelect({ id: category.id, title: category.title });
        }
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
                        <AppText style={styles.title}>{t('select_category')}</AppText>
                        <TouchableOpacity style={styles.doneContainer} onPress={handleDone}>
                            <AppText style={styles.doneText}>{t('done')}</AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        {CATEGORIES.map((category) => {
                            const isSelected = localSelectedId === category.id;
                            const Icon = category.icon;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.categoryRow}
                                    onPress={() => setLocalSelectedId(category.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconWrapper}>
                                        <Icon width={hp(2)} height={hp(2)} fill={colors.primary} />
                                    </View>
                                    <AppText style={styles.categoryTitle}>{t(category.title as TxKeyPath)}</AppText>
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
        minHeight: hp(30),
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
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1),
    },
    iconWrapper: {
        width: hp(4),
        height: hp(4),
        borderRadius: hp(2.5),
        backgroundColor: colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    categoryTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    radioWrapper: {
        marginLeft: wp(2),
    },
});