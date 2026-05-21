import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { FONT, typography } from '../../../enums/typography';
import { wp } from '../../../enums/spacing';

interface CategoryItemProps {
  title: string;
  icon: React.ElementType;
  isSelected?: boolean;
  onPress?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ title, icon: Icon, isSelected, onPress }) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon style={styles.icon} />
        </View>
        <AppText
          variant="bodySmall"
          color={isSelected ? colors.primary : colors.secondary}
          style={[styles.title, isSelected && styles.selectedTitle]}
        >
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};


const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedContainer: {
    backgroundColor: colors.lightBlue,
    borderWidth: 1,
    borderColor: colors.lightBlueBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  title: {
    ...typography.kg,
    fontSize: 10,
    fontFamily: FONT.medium,
  },
  selectedTitle: {
    color: colors.primary,
  },
  icon: {
    width: wp(5),
    height: wp(5),
  }
});
