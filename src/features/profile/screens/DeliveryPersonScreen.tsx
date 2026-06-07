import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { useTranslation } from '../../../hooks/useTranslation';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { SVG, IMAGES } from '../../../assets';
import { Card } from '../../../common/components/Card/Card';
import { Routes } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { storeRiderRepository } from '../../../services/storeRiderService';
import { useFocusEffect } from '@react-navigation/native';
import { UserProfile } from '../../auth/services/types';

const DeliveryPersonScreen = ({ navigation }: any) => {
    const { colors, isDarkMode } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();

    const [deliveryPersons, setDeliveryPersons] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLinkedRiders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await storeRiderRepository.getLinkedRiders(user.uid);
            setDeliveryPersons(data);
        } catch (err) {
            console.error('Failed to fetch linked riders:', err);
            Alert.alert(t('Error'), t('failed_to_fetch_data'));
        } finally {
            setLoading(false);
        }
    }, [user, t]);

    useFocusEffect(
        useCallback(() => {
            fetchLinkedRiders();
        }, [fetchLinkedRiders])
    );

    const handleDelete = async (riderId: string) => {
        if (!user) return;
        Alert.alert(
            t('confirm'),
            t('confirm_delete_rider'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await storeRiderRepository.removeRiderLink(user.uid, riderId);
                            setDeliveryPersons(prev => prev.filter(item => item.uid !== riderId));
                        } catch (err) {
                            console.error('Failed to unlink rider:', err);
                            Alert.alert(t('Error'), t('failed_to_delete_rider'));
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: UserProfile }) => (
        <Card style={styles.card}>
            <View style={styles.personInfo}>
                <Image source={item.photoURL ? { uri: item.photoURL } : IMAGES.MAN4} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <AppText style={styles.name}>{item.displayName || t('delivery_person')}</AppText>
                    <AppText style={styles.email}>{item.email || ''}</AppText>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.uid)}
                activeOpacity={0.7}
            >
                <SVG.Trash width={hp(2)} height={hp(2)} fill={colors.error} />
            </TouchableOpacity>
        </Card>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenHeader
                    title={t('delivery_person')}
                    showBackButton={true}
                />
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={deliveryPersons}
                        keyExtractor={item => item.uid}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <AppText style={styles.emptyText}>{t('no_linked_riders')}</AppText>
                            </View>
                        }
                    />
                )}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate(Routes.ADD_DELIVERY_PERSON)}
                    activeOpacity={0.8}
                >
                    <AppText style={styles.fabText}>+</AppText>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

export default DeliveryPersonScreen;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
        paddingBottom: hp(12),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp(4),
        borderRadius: 15,
        marginBottom: hp(2),
        backgroundColor: colors.white,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: hp(5.5),
        height: hp(5.5),
    },
    textContainer: {
        marginLeft: wp(3),
    },
    name: {
        fontSize: 14,
        fontFamily: FONT.semiBold,
        color: colors.secondary,
    },
    email: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginTop: hp(0.2),
    },
    deleteBtn: {
        width: hp(4),
        height: hp(4),
        borderRadius: hp(1),
        backgroundColor: colors.lightRed,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: hp(4),
        right: wp(6),
        width: hp(7),
        height: hp(7),
        borderRadius: hp(3.5),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabText: {
        fontSize: 30,
        color: colors.white,
        fontWeight: '300',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp(10),
    },
    emptyText: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
});