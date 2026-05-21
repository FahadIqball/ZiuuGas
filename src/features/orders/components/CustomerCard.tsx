import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { SVG } from '../../../assets';

interface CustomerCardProps {
    name: string;
    email: string;
    address: string;
    image: any;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ name, email, address, image }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <Card style={styles.container}>
            <View style={styles.content}>
                <Image source={image} style={styles.avatar} />
                <View style={styles.details}>
                    <AppText style={styles.name}>{name}</AppText>
                    <AppText style={styles.email}>{email}</AppText>
                    <View style={styles.addressRow}>
                        <SVG.Pin width={wp(2.5)} height={hp(2.5)} />
                        <AppText style={styles.addressText}>{address}</AppText>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        paddingHorizontal: wp(5),
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    content: {
        flexDirection: 'row',
    },
    avatar: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(4),
    },
    details: {
        marginLeft: wp(4),
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    email: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressText: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        marginLeft: wp(1),
    },
});
