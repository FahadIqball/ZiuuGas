import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { GoogleIcon } from './GoogleIcon';
import { hp, spacing } from '../../../enums/spacing';

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

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    height: hp(6),
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  text: {
    color: '#1E293B',
    fontWeight: '600',
  },
});
export default GoogleSignInButton;
