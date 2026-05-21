import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
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

const DeliveryPersonScreen = ({ navigation }: any) => {
    const { colors, isDarkMode } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();

    const [deliveryPersons, setDeliveryPersons] = useState([
        { id: '1', name: 'Andrew Ainsely', email: 'xyz@gmail.com', image: IMAGES.MAN4 },
        { id: '2', name: 'John Hamer', email: 'xyz@gmail.com', image: IMAGES.MAN5 },
        { id: '3', name: 'Henrey John', email: 'xyz@gmail.com', image: IMAGES.MAN6 },
    ]);

    const handleDelete = (id: string) => {
        setDeliveryPersons(prev => prev.filter(item => item.id !== id));
    };

    const renderItem = ({ item }: { item: typeof deliveryPersons[0] }) => (
        <Card style={styles.card}>
            <View style={styles.personInfo}>
                <Image source={item.image} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <AppText style={styles.name}>{item.name}</AppText>
                    <AppText style={styles.email}>{item.email}</AppText>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
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
                <FlatList
                    data={deliveryPersons}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
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
});