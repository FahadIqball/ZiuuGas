import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { useTranslation } from '../../../hooks/useTranslation';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { Input } from '../../../common/components/Input';
import { Button } from '../../../common/components/Button';
import { useAuth } from '../../../context/AuthContext';
import { storeRiderRepository } from '../../../services/storeRiderService';

const AddDeliveryPersonScreen = ({ navigation }: any) => {
    const { colors, isDarkMode } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email.trim()) {
            Alert.alert(t('Error'), t('fill_all_fields'));
            return;
        }
        if (!user) return;

        setLoading(true);
        try {
            const storeName = user.displayName || t('gas_store');
            await storeRiderRepository.sendInvitation(user.uid, storeName, email);
            Alert.alert(t('Success'), t('rider_invitation_sent_success'));
            navigation.goBack();
        } catch (err: any) {
            console.error('Failed to send rider invitation:', err);
            Alert.alert(t('Error'), err.message || t('failed_to_send_request'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenHeader 
                    title={t('add_delivery_person')} 
                    showBackButton={true} 
                />
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Input
                        label={t('name')}
                        placeholder={t('enterName')}
                        value={name}
                        onChangeText={setName}
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={colors.textSecondary}
                    />
                    <Input
                        label={t('e_mail')}
                        placeholder={t('enter_email')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={colors.textSecondary}
                    />
                </ScrollView>
                <View style={styles.footer}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <Button
                            title={t('register')}
                            onPress={handleRegister}
                            style={styles.registerBtn}
                        />
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AddDeliveryPersonScreen;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: 25,
    },
    footer: {
        paddingHorizontal: wp(6),
        paddingBottom: hp(4),
    },
    registerBtn: {
        height: hp(6),
        borderRadius: 30,
    },
});