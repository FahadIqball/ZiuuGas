import React from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { AppText } from '../../../common/components/Typography/Typography';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { FONT } from '../../../enums/typography';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useNotification } from '../../../context/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../constants/routes';
import { TouchableOpacity } from 'react-native';
import { TxKeyPath } from '../../../context/LanguageContext';

const NotificationsScreen: React.FC = () => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const navigation = useNavigation<any>();
    const { notifications } = useNotifications();
    const { showGasNotification } = useNotification();
    const { t } = useTranslation();

    const handleNotificationPress = (id: string) => {
        showGasNotification(id);
        navigation.navigate(Routes.MAIN_TABS, { screen: Routes.HOME });
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenHeader title={t('notifications')} />
                <SectionList
                    sections={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => handleNotificationPress(item.id)}
                            activeOpacity={0.8}
                        >
                            <NotificationItem
                                store={t(item.store as TxKeyPath)}
                                message={t(item.message as TxKeyPath)}
                                time={t(item.time as TxKeyPath)}
                                image={item.image}
                            />
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <AppText color={colors.secondary} style={styles.sectionTitle}>
                            {t(title as TxKeyPath)}
                        </AppText>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    stickySectionHeadersEnabled={false}
                />
            </SafeAreaView>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: hp(2),
    },
    sectionTitle: {
        paddingHorizontal: wp(6),
        marginTop: hp(2),
        marginBottom: hp(2),
        fontSize: 14,
        fontFamily: FONT.semiBold,
        textTransform: 'capitalize',
    },
});

export default NotificationsScreen;
