import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { GoogleIcon } from './GoogleIcon';
import { hp, spacing } from '../../../enums/spacing';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  loading,
  style,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <Button
      title={t('google_sign_in')}
      variant="outline"
      leftIcon={<GoogleIcon size={hp(2.5)} />}
      onPress={onPress}
      disabled={loading}
      style={[styles.button, style]}
      textStyle={styles.text}
    />
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    height: hp(6),
    borderRadius: 30,
    elevation: 2,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  text: {
    color: colors.text,
    fontWeight: '600',
  },
});

export default GoogleSignInButton;
