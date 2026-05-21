import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, wp } from '../../../enums/spacing';
import { useOffers } from '../hooks/useOffers';
import { OfferCard } from '../components/OffersCard';
import { Routes } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { OfferRequestCard } from '../components/OfferRequestCard';
import { AppText } from '../../../common/components/Typography/Typography';
import { resolveProductImage } from '../../products/utils/imageResolver';
import { offerRepository } from '../../../services/offerService';
import { FONT } from '../../../enums/typography';

const OffersScreen: React.FC = ({ navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { userRole } = useAuth();
    const isSeller = userRole === 'seller';
    const { currentOffers, offerRequests, sentOffers, isLoading, refresh } = useOffers();
    const { t } = useTranslation();
    const [sellerTab, setSellerTab] = useState<'requests' | 'sent'>('requests');
    
    const navigateToSendOffer = (request: any) => {
        navigation.navigate(Routes.SEND_OFFER, { request });
    }

    const handleAcceptOffer = async (offer: any) => {
        try {
            await offerRepository.updateOfferStatus(offer.id, 'accepted');
            Alert.alert(t('Success'), t('offer_accepted_success'));
            refresh();
        } catch (err) {
            console.error('Error accepting offer:', err);
            Alert.alert(t('Error'), t('failed_to_accept_offer'));
        }
    };

    const handleRejectOffer = async (offer: any) => {
        try {
            await offerRepository.updateOfferStatus(offer.id, 'rejected');
            Alert.alert(t('Success'), t('offer_rejected_success'));
            refresh();
        } catch (err) {
            console.error('Error rejecting offer:', err);
            Alert.alert(t('Error'), t('failed_to_reject_offer'));
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {isSeller && (
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, sellerTab === 'requests' && styles.activeTab]}
                        onPress={() => setSellerTab('requests')}
                    >
                        <AppText style={[styles.tabText, sellerTab === 'requests' && styles.activeTabText]}>
                            {t('offers_request')}
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, sellerTab === 'sent' && styles.activeTab]}
                        onPress={() => setSellerTab('sent')}
                    >
                        <AppText style={[styles.tabText, sellerTab === 'sent' && styles.activeTabText]}>
                            {t('sent_offers')}
                        </AppText>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (isLoading && !currentOffers.length && !offerRequests.length && !sentOffers.length) {
        return (
            <View style={styles.mainContainer}>
                <ScreenHeader
                    title={isSeller ? t('offers_request') : t('offers')}
                    showBackButton={false}
                />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    const getData = () => {
        if (!isSeller) return currentOffers;
        return sellerTab === 'requests' ? offerRequests : sentOffers;
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenHeader
                    title={isSeller ? (sellerTab === 'requests' ? t('offers_request') : t('sent_offers')) : t('offers')}
                    showBackButton={false}
                />
                <FlatList
                    data={getData() as any[]}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
                    }
                    renderItem={({ item }) => {
                        if (isSeller && sellerTab === 'requests') {
                            return (
                                <OfferRequestCard
                                    title={item.title}
                                    subtitle={item.subtitle || ''}
                                    image={resolveProductImage(item.image)}
                                    userName={item.userName}
                                    userPhotoURL={item.userPhotoURL}
                                    onSendOffer={() => {
                                        navigateToSendOffer(item);
                                    }}
                                />
                            );
                        }
                        
                        return (
                            <OfferCard
                                isSeller={isSeller}
                                productTitle={item.title || t('gas')}
                                image={resolveProductImage(item.image)}
                                userName={item.userName}
                                userPhotoURL={item.userPhotoURL}
                                sellerName={item.sellerName}
                                sellerPhotoURL={item.sellerPhotoURL}
                                time={item.estimatedTime || '20'}
                                rating={item.rating || '4.5'}
                                price={item.price.toString()}
                                buttonText={t('view_details')}
                                onAccept={!isSeller ? () => handleAcceptOffer(item) : undefined}
                                onReject={!isSeller ? () => handleRejectOffer(item) : undefined}
                                showButtons={!isSeller && item.status === 'pending'}
                                status={item.status}
                            />
                        );
                    }}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={() => (
                        <View style={styles.centerContainer}>
                            <AppText color={colors.textSecondary}>
                                {isSeller 
                                    ? (sellerTab === 'requests' ? t('no_requests') : t('no_sent_offers')) 
                                    : t('no_offers')
                                }
                            </AppText>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
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
        flexGrow: 1,
    },
    headerContainer: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
        paddingBottom: hp(1),
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        marginBottom: hp(2),
        fontSize: 18,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        padding: 4,
        marginBottom: hp(1),
    },
    tab: {
        flex: 1,
        paddingVertical: hp(1.2),
        alignItems: 'center',
        borderRadius: 22,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 12,
        fontFamily: FONT.medium,
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.white,
    },
});

export default OffersScreen;
