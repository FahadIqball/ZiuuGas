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

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    const { userRole } = useAuth();
    const isSeller = userRole === 'seller';
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case Routes.HOME:
                            return focused ? <SVG.HomeSelected /> : <SVG.Home />;
                        case Routes.ORDERS:
                            return focused ? <SVG.OrdersSelected /> : <SVG.Orders />;
                        case Routes.OFFERS:
                            return focused ? <SVG.OffersSelected /> : <SVG.Offers />;
                        case Routes.ACCOUNT:
                            return focused ? <SVG.ProfileSelected /> : <SVG.Profile />;
                        default:
                            return null;
                    }
                },
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