import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import NotificationsScreen from '../features/notification/screens/NotificationsScreen';
import { Routes } from '../constants/routes';
import ProfileInfoScreen from '../features/profile/screens/ProfileInfoScreen';
import WalletScreen from '../features/profile/screens/WalletScreen';
import AddressScreen from '../features/profile/screens/AddressScreen';
import OrderDetailsScreen from '../features/orders/screens/OrderDetailsScreen';
import ReviewScreen from '../features/review/screens/ReviewScreen';
import ProductDetailsScreen from '../features/products/screens/ProductDetailsScreen';
import CartScreen from '../features/cart/screens/CartScreen';
import PaymentSuccessScreen from '../features/orders/screens/PaymentSuccessScreen';
import TrackOrderScreen from '../features/tracking/screens/TrackOrderScreen';
import SellerInventoryScreen from '../features/products/screens/SellerInventoryScreen';
import SellerAddInventoryScreen from '../features/products/screens/SellerAddInventoryScreen';
import SellerNotificationsScreen from '../features/notification/screens/SellerNotificationsScreen';
import SendOffer from '../features/offers/screens/SendOffer';
import DeliveryPersonScreen from '../features/profile/screens/DeliveryPersonScreen';
import AddDeliveryPersonScreen from '../features/profile/screens/AddDeliveryPersonScreen';


const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.MAIN_TABS} component={MainTabs} />
      <Stack.Screen name={Routes.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={Routes.PROFILE_INFO} component={ProfileInfoScreen} />
      <Stack.Screen name={Routes.WALLET} component={WalletScreen} />
      <Stack.Screen name={Routes.ADDRESS} component={AddressScreen} />
      <Stack.Screen name={Routes.ORDER_DETAILS} component={OrderDetailsScreen} />
      <Stack.Screen name={Routes.REVIEW} component={ReviewScreen} />
      <Stack.Screen name={Routes.PRODUCT_DETAILS} component={ProductDetailsScreen} />
      <Stack.Screen name={Routes.CART} component={CartScreen} />
      <Stack.Screen name={Routes.PAYMENT_SUCCESS} component={PaymentSuccessScreen} />
      <Stack.Screen name={Routes.TRACK_ORDER} component={TrackOrderScreen} />
      <Stack.Screen name={Routes.SELLER_INVENTORY} component={SellerInventoryScreen} />
      <Stack.Screen name={Routes.SELLER_ADD_INVENTORY} component={SellerAddInventoryScreen} />
      <Stack.Screen name={Routes.SELLER_NOTIFICATIONS} component={SellerNotificationsScreen} />
      <Stack.Screen name={Routes.SEND_OFFER} component={SendOffer} />
      <Stack.Screen name={Routes.DELIVERY_PERSON} component={DeliveryPersonScreen} />
      <Stack.Screen name={Routes.ADD_DELIVERY_PERSON} component={AddDeliveryPersonScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
