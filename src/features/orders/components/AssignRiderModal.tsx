import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { UserProfile } from '../../auth/services/types';
import { IMAGES } from '../../../assets';

interface AssignRiderModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectRider: (rider: UserProfile) => void;
    riders: UserProfile[];
    loading: boolean;
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
    visible,
    onClose,
    onSelectRider,
    riders,
    loading,
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const renderRiderItem = ({ item }: { item: UserProfile }) => (
        <TouchableOpacity
            style={styles.riderItem}
            activeOpacity={0.7}
            onPress={() => onSelectRider(item)}
        >
            <Image
                source={item.photoURL ? { uri: item.photoURL } : IMAGES.MAN2}
                style={styles.avatar}
            />
            <View style={styles.riderInfo}>
                <AppText style={styles.riderName}>{item.displayName || item.email}</AppText>
                <View style={styles.statusRow}>
                    <View style={styles.onlineDot} />
                    <AppText style={styles.onlineText}>{t('online')}</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText style={styles.title}>{t('select_rider')}</AppText>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                            <AppText style={styles.closeText}>✕</AppText>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={riders}
                            keyExtractor={(item) => item.uid}
                            renderItem={renderRiderItem}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <AppText style={styles.emptyText}>{t('no_online_riders')}</AppText>
                                </View>
                            }
                        />
                    )}
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
        maxHeight: hp(60),
        backgroundColor: colors.white,
        borderRadius: 24,
        paddingTop: hp(2.5),
        paddingBottom: hp(2),
        paddingHorizontal: wp(5),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '50',
        paddingBottom: hp(1.5),
        marginBottom: hp(1.5),
    },
    title: {
        fontSize: 18,
        fontFamily: FONT.semiBold,
        color: colors.secondary,
    },
    closeBtn: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        backgroundColor: colors.lightGray + '50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontFamily: FONT.bold,
    },
    listContent: {
        paddingVertical: hp(0.5),
    },
    riderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        borderRadius: 16,
        backgroundColor: colors.background,
        marginBottom: hp(1),
    },
    avatar: {
        width: hp(5.5),
        height: hp(5.5),
        borderRadius: hp(2.75),
        backgroundColor: colors.lightGray,
    },
    riderInfo: {
        flex: 1,
        marginLeft: wp(3),
    },
    riderName: {
        fontSize: 15,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    onlineDot: {
        width: hp(1),
        height: hp(1),
        borderRadius: hp(0.5),
        backgroundColor: '#4CAF50',
        marginRight: wp(1.5),
    },
    onlineText: {
        fontSize: 11,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    },
    center: {
        paddingVertical: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: hp(6),
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontFamily: FONT.regular,
        fontSize: 14,
        textAlign: 'center',
    },
});
