import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { hp, wp } from '../../../enums/spacing'
import { AppText } from '../../../common/components/Typography/Typography'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { FONT } from '../../../enums/typography'
import { LogoutModal } from './LogoutModal'

type Props = {
    title: string;
    onPress: () => void;
    leftIcon: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const ProfileButton = ({ title, onPress, leftIcon, rightIcon }: Props) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={styles.button}
            >
                <View style={styles.icon}>
                    {leftIcon}
                    <AppText style={styles.buttonText}>{title}</AppText>
                </View>
                <View style={styles.rightIcon}>
                    {rightIcon}
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileButton

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcon: {
        marginRight: hp(2),
    },
    buttonText: {
        fontFamily: FONT.medium,
        fontSize: 12,
        color: colors.secondary,
        marginLeft: hp(2),
    },
    button: {
        width: "100%",
        height: hp(6),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        justifyContent: "space-between",
        marginTop: hp(1.5),
        borderRadius: 10,
    }
})