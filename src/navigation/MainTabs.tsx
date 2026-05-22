import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SVG } from '../assets';
import { Routes } from '../constants/routes';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

// Feature Screens
import HomeScreen from '../features/home/screens/HomeScreen';
import SellerHomeScreen from '../features/home/screens/SellerHomeScreen';
import OrdersScreen from '../features/orders/screens/OrdersScreen';
import OffersScreen from '../features/offers/screens/OffersScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

// New Feature Screens for Partner & Promoter
import PartnerHomeScreen from '../features/partner/screens/PartnerHomeScreen';
import ActiveDeliveriesScreen from '../features/partner/screens/ActiveDeliveriesScreen';
import PartnerEarningsScreen from '../features/partner/screens/PartnerEarningsScreen';
import PromoterHomeScreen from '../features/promoter/screens/PromoterHomeScreen';
import PromoterPayoutsScreen from '../features/promoter/screens/PromoterPayoutsScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    const { userRole } = useAuth();
    const { colors } = useTheme();
    const { t, locale } = useTranslation();

    const getTabBarIcon = (routeName: string, focused: boolean) => {
        switch (routeName) {
            case Routes.HOME:
            case Routes.PROMOTER_HOME:
            case Routes.PARTNER_HOME:
                return focused ? <SVG.HomeSelected /> : <SVG.Home />;
            case Routes.ORDERS:
                return focused ? <SVG.OrdersSelected /> : <SVG.Orders />;
            case Routes.ACTIVE_DELIVERIES:
                return <SVG.DeliveryBike width={24} height={24} fill={focused ? colors.primary : colors.textSecondary} color={focused ? colors.primary : colors.textSecondary} />;
            case Routes.OFFERS:
                return focused ? <SVG.OffersSelected /> : <SVG.Offers />;
            case Routes.PARTNER_EARNINGS:
            case Routes.PROMOTER_PAYOUTS:
                return <SVG.Wallet width={24} height={24} fill={focused ? colors.primary : colors.textSecondary} color={focused ? colors.primary : colors.textSecondary} />;
            case Routes.ACCOUNT:
                return focused ? <SVG.ProfileSelected /> : <SVG.Profile />;
            default:
                return null;
        }
    };

    if (userRole === 'partner') {
        return (
            <Tab.Navigator
                key={locale}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
                })}
                initialRouteName={Routes.PARTNER_HOME}>
                <Tab.Screen
                    name={Routes.PARTNER_HOME}
                    component={PartnerHomeScreen}
                    options={{ tabBarLabel: t('job_board') }}
                />
                <Tab.Screen
                    name={Routes.ACTIVE_DELIVERIES}
                    component={ActiveDeliveriesScreen}
                    options={{ tabBarLabel: t('active_jobs') }}
                />
                <Tab.Screen
                    name={Routes.PARTNER_EARNINGS}
                    component={PartnerEarningsScreen}
                    options={{ tabBarLabel: t('earnings') }}
                />
                <Tab.Screen
                    name={Routes.ACCOUNT}
                    component={ProfileScreen}
                    options={{ tabBarLabel: t('profile') }}
                />
            </Tab.Navigator>
        );
    }

    if (userRole === 'promoter') {
        return (
            <Tab.Navigator
                key={locale}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
                })}
                initialRouteName={Routes.PROMOTER_HOME}>
                <Tab.Screen
                    name={Routes.PROMOTER_HOME}
                    component={PromoterHomeScreen}
                    options={{ tabBarLabel: t('promoter_dashboard') }}
                />
                <Tab.Screen
                    name={Routes.PROMOTER_PAYOUTS}
                    component={PromoterPayoutsScreen}
                    options={{ tabBarLabel: t('withdrawal_requests') }}
                />
                <Tab.Screen
                    name={Routes.ACCOUNT}
                    component={ProfileScreen}
                    options={{ tabBarLabel: t('profile') }}
                />
            </Tab.Navigator>
        );
    }

    // Default Buyer/Seller tab navigator
    const isSeller = userRole === 'seller';
    return (
        <Tab.Navigator
            key={locale}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
            })}
            initialRouteName={Routes.HOME}>
            <Tab.Screen
                name={Routes.HOME}
                component={isSeller ? SellerHomeScreen : HomeScreen}
                options={{ tabBarLabel: t('home') }}
            />
            <Tab.Screen
                name={Routes.ORDERS}
                component={OrdersScreen}
                options={{ tabBarLabel: t('orders') }}
            />
            <Tab.Screen
                name={Routes.OFFERS}
                component={OffersScreen}
                options={{ tabBarLabel: t('offers') }}
            />
            <Tab.Screen
                name={Routes.ACCOUNT}
                component={ProfileScreen}
                options={{ tabBarLabel: t('profile') }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;