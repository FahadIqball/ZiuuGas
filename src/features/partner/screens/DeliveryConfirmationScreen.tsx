import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { deliveryRepository } from '../../../services/deliveryService';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { Input } from '../../../common/components/Input';
import { Button } from '../../../common/components/Button';
import { Routes } from '../../../constants/routes';

const DeliveryConfirmationScreen: React.FC = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { orderId } = route.params || {};
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert(t('Error'), t('fill_all_fields'));
      return;
    }

    setLoading(true);
    try {
      const isVerified = await deliveryRepository.verifyDeliveryOTP(orderId, otp);
      if (isVerified) {
        Alert.alert(t('Success'), t('order_delivered_success_alert'));
        navigation.navigate(Routes.PARTNER_HOME);
      } else {
        Alert.alert(t('Error'), t('invalid_otp'));
      }
    } catch (err) {
      console.error('OTP confirmation failed:', err);
      Alert.alert(t('Error'), t('failed_to_update_order_status'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('verify_delivery')} showBackButton={true} />
      <View style={styles.content}>
        <AppText style={styles.title}>{t('enter_delivery_otp')}</AppText>
        <AppText style={styles.subtitle}>{t('otp_success_msg')}</AppText>

        <Input
          placeholder="----"
          placeholderTextColor={colors.inputPlaceholder}
          style={styles.otpInput}
          inputContainerStyle={styles.inputContainer}
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
          keyboardType="numeric"
          textAlign="center"
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: hp(4) }} />
        ) : (
          <Button
            title={t('confirm_code')}
            style={styles.verifyBtn}
            textStyle={styles.verifyBtnText}
            onPress={handleVerify}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(5),
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: colors.secondary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: hp(1.5),
    lineHeight: 18,
  },
  otpInput: {
    fontSize: 32,
    fontFamily: FONT.bold,
    letterSpacing: 8,
    color: colors.secondary,
    height: hp(8),
  },
  inputContainer: {
    marginTop: hp(6),
    width: wp(60),
    height: hp(8),
    borderRadius: 16,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBtn: {
    marginTop: hp(6),
    width: '100%',
    height: hp(6.5),
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  verifyBtnText: {
    fontSize: 16,
    fontFamily: FONT.bold,
  },
});

export default DeliveryConfirmationScreen;
