import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { SVG } from '../../../assets';
import { wp, spacing } from '../../../enums/spacing';

interface SwipeableInventoryItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const SwipeableInventoryItem: React.FC<SwipeableInventoryItemProps> = ({
  children,
  onDelete,
  onEdit,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);

  const renderRightActions = () => {
    return (
      <View style={styles.rightActionsWrapper}>
        <View style={styles.rightActionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <SVG.Edit1 width={wp(4)} height={wp(4)} fill={colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <SVG.Trash width={wp(4)} height={wp(4)} fill={colors.error} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        containerStyle={styles.swipeContainer}
      >
        {children}
      </Swipeable>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  mainWrapper: {
    borderRadius: 15,
    marginBottom: spacing.m,
    overflow: 'hidden',
  },
  swipeContainer: {
    backgroundColor: colors.lightBlue,
  },
  rightActionsWrapper: {
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightActionsContainer: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: wp(2),
    height: '100%',
    width: '100%',
  },
  actionButton: {
    width: wp(9),
    height: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
  iconContainer: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(3),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
