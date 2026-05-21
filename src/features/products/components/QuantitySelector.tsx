import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';

interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
    quantity, 
    onIncrement, 
    onDecrement,
    containerStyle,
    buttonStyle,
    textStyle
}) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onIncrement}>
                <AppText style={[styles.buttonText, textStyle]}>+</AppText>
            </TouchableOpacity>
            <AppText style={[styles.quantity, textStyle]}>{quantity}</AppText>
            <TouchableOpacity
                style={[styles.button, buttonStyle]}
                onPress={onDecrement}
                disabled={quantity <= 1}
            >
                <AppText style={[styles.buttonText, textStyle, quantity <= 1 && styles.disabledText]}>−</AppText>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderRadius: 20,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        alignSelf: 'flex-start',
    },
    button: {
        width: wp(8),
        height: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: colors.primary,
        fontFamily: FONT.bold,
    },
    disabledText: {
        color: colors.lightGray,
    },
    quantity: {
        fontSize: 11.82,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginHorizontal: wp(4),
    },
});
