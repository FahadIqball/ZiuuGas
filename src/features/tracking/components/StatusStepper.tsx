import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusItem } from './StatusItem';
import { OrderStatus, STATUS_LIST } from '../dummies/trackOrder';
import { SVG } from '../../../assets';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';

interface StatusStepperProps {
    currentStatus: OrderStatus;
    isStatusDone: (status: OrderStatus) => boolean;
}

const getIcon = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PLACED: return SVG.TrackCart;
        case OrderStatus.DISPATCHED: return SVG.Dispatched;
        case OrderStatus.DELIVERED: return SVG.Delivered;
        default: return SVG.TrackCart;
    }
};

export const StatusStepper: React.FC<StatusStepperProps> = ({ isStatusDone }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);

    return (
        <View style={styles.container}>
            {STATUS_LIST.map((item, index) => (
                <StatusItem
                    key={item.key}
                    label={item.label}
                    isDone={isStatusDone(item.key)}
                    isLast={index === STATUS_LIST.length - 1}
                    Icon={getIcon(item.key)}
                />
            ))}
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginTop: hp(2),
        paddingHorizontal: wp(6),
    },
});
