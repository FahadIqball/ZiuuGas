import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { SVG, IMAGES } from '../../../assets';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../constants/routes';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

import { useAuth } from '../../../context/AuthContext';

export const ProfileHeader: React.FC = () => {
    const navigation = useNavigation<any>();
    const { userRole, user } = useAuth();
    const isSeller = userRole === 'seller';
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Image
                    source={user?.photoURL ? { uri: user.photoURL } : IMAGES.MAN1}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <AppText variant="h2" color={colors.secondary} style={styles.userName}>
                        {user?.displayName || 'Guest User'}
                    </AppText>
                </View>
            </View>
            <TouchableOpacity
                style={styles.notificationBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(isSeller ? Routes.SELLER_NOTIFICATIONS : Routes.NOTIFICATIONS)}
            >
                <View style={styles.dot} />
                <SVG.Bell style={styles.bellIcon} />
            </TouchableOpacity>
        </View>
    );
};


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 15,
        position: 'relative',
        backgroundColor: colors.background
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        marginVertical: hp(-10.5),
    },
    avatar: {
        width: hp(7),
        height: hp(7),
        borderRadius: 24,
        borderColor: colors.primary,
    },
    textContainer: {
        marginLeft: 12,
        marginTop: hp(1),
    },
    userName: {
        fontFamily: FONT.medium,
        fontSize: 14,
        marginTop: 2,
    },
    notificationBtn: {
        width: hp(5),
        height: hp(5),
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignSelf: "flex-end",
        position: "absolute",
        top: hp(0.1),
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0086FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    dot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#FF4D4F',
        zIndex: 1,
        borderWidth: 1.5,
        borderColor: '#0086FF',
    },
    bellIcon: {
        width: hp(6),
        height: hp(6),
    },
});

