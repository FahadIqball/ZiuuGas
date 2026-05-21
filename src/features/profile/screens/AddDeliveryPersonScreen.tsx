import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { useTranslation } from '../../../hooks/useTranslation';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { Input } from '../../../common/components/Input';
import { Button } from '../../../common/components/Button';

const AddDeliveryPersonScreen = ({ navigation }: any) => {
    const { colors, isDarkMode } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = () => {
        // Simple functional navigation back after registration
        if (name && email) {
            navigation.goBack();
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
                    <Button
                        title={t('register')}
                        onPress={handleRegister}
                        style={styles.registerBtn}
                    />
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