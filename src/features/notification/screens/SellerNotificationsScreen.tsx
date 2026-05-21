import React from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { hp, wp } from '../../../enums/spacing';
import { NotificationItem } from '../components/NotificationItem';
import { IMAGES } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { Routes } from '../../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../../../context/NotificationContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';

const getSellerNotifications = (t: (key: TxKeyPath) => string) => [
    {
        title: t('today'),
        data: [
            {
                id: '1',
                title: 'Henrey Ainsely',
                message: t('sent_request_offer'),
                time: t('just_now'),
                image: IMAGES.MAN1,
            },
            {
                id: '2',
                title: t('order_delivered_success'),
                message: '', // Message is empty as design shows "Order no #..."
                orderNo: ' ' + '#' + '27257372',
                time: t('1h_ago'),
                image: null,
            },
        ],
    },
    {
        title: t('yesterday'),
        data: [
            {
                id: '3',
                title: 'John Andrew',
                message: t('sent_request_offer'),
                time: t('11_20_am'),
                image: IMAGES.MAN2,
            },
            {
                id: '4',
                title: 'Henrey',
                message: t('accepted_offer'),
                time: t('12_30_pm'),
                image: IMAGES.MAN3,
            },
        ],
    },
];

const SellerNotificationsScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const navigation = useNavigation<any>();
    const { showGasNotification } = useNotification();
    const { t } = useTranslation();

    const notifications = React.useMemo(() => getSellerNotifications(t), [t]);

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
                                title={item.title}
                                message={item.message}
                                orderNo={item.orderNo}
                                time={item.time}
                                image={item.image}
                                variant="seller"
                            />
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <AppText color={colors.secondary} style={styles.sectionTitle}>
                            {title}
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

export default SellerNotificationsScreen;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background, // Seller notification screen has a plain white background in design
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
        marginBottom: hp(1),
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        textTransform: 'capitalize',
    },
});