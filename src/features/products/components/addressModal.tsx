import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../../../common/components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { useTranslation } from '../../../hooks/useTranslation';
import { hp, spacing, wp } from '../../../enums/spacing';
import { SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { FONT } from '../../../enums/typography';
import { Input } from '../../../common/components/Input';
import { Routes } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { addressRepository } from '../../../services/addressService';
import { Address } from '../../profile/services/types';

interface AddressModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    navigation?: any
}

export const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, onConfirm, navigation }) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [streetInput, setStreetInput] = useState('');

    const goToCart = () => {
        onClose();
        navigation.navigate(Routes.CART);
    }

    const fetchAddresses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const list = await addressRepository.getAddresses(user.uid);
            setAddresses(list);
            const defaultIdx = list.findIndex(a => a.isDefault);
            setSelectedIndex(defaultIdx !== -1 ? defaultIdx : 0);
        } catch (err) {
            console.error('Failed to load addresses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            setIsAdding(false);
            setStreetInput('');
            fetchAddresses();
        }
    }, [visible, user]);

    const handleSaveAddress = async () => {
        if (!user || !streetInput.trim()) return;
        setLoading(true);
        try {
            const newAddress: Address = {
                id: 'addr_' + Date.now(),
                street: streetInput.trim(),
                city: 'New York',
                state: 'NY',
                zipCode: '10011',
                country: 'USA',
                isDefault: addresses.length === 0,
            };
            await addressRepository.saveAddress(user.uid, newAddress);
            setIsAdding(false);
            setStreetInput('');
            await fetchAddresses();
        } catch (err) {
            console.error('Failed to save address:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType='slide'
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <AppText style={styles.title}>
                                {isAdding ? t('Add Address') : t('select_address')}
                            </AppText>
                        </View>
                        {!isAdding && !loading && (
                            <View style={styles.doneIcon}>
                                <Button title={t('done')} variant="outline" style={styles.doneButton} onPress={goToCart} />
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: hp(2) }} />
                        ) : isAdding ? (
                            <>
                                <AppText style={styles.label}>{t('Enter Address')}</AppText>
                                <Input
                                    placeholder={t('enterLocation')}
                                    placeholderTextColor={colors.inputPlaceholder}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    value={streetInput}
                                    onChangeText={setStreetInput}
                                    editable={true}
                                />
                            </>
                        ) : addresses.length === 0 ? (
                            <AppText style={{ textAlign: 'center', marginVertical: hp(2), color: colors.textSecondary }}>
                                No addresses registered yet.
                            </AppText>
                        ) : (
                            addresses.map((item, index) => (
                                <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => setSelectedIndex(index)}>
                                    <Input
                                        value={`${item.house ? item.house + ', ' : ''}${item.street}, ${item.city}, ${item.state} ${item.zipCode}, ${item.country}`}
                                        placeholderTextColor={colors.inputPlaceholder}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        editable={false}
                                        multiline
                                        pointerEvents="none"
                                        rightIcon={selectedIndex === index ? <SVG.RadioSelected stroke={colors.primary} /> : <SVG.RadioUnSelected stroke={colors.textSecondary} />}
                                    />
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    <View style={styles.buttonRow}>
                        {!loading && (
                            <Button
                                title={isAdding ? t('done') : t('addNewAddress')}
                                variant="primary"
                                style={styles.acceptButton}
                                onPress={() => isAdding ? handleSaveAddress() : setIsAdding(true)}
                                leftIcon={!isAdding && <SVG.AddressPin stroke={colors.white} />}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: hp(3),
        paddingHorizontal: wp(8),
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    rightIconContainer: {
        marginRight: spacing.m,
    },
    titleContainer: {
        alignItems: 'center',
    },
    doneIcon: {
        position: 'absolute',
        right: 0,
    },
    doneButton: {
        width: wp(20),
        height: hp(4),
    },
    title: {
        fontSize: 16,
        fontFamily: FONT.medium,
        color: colors.secondary,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: hp(8),
        width: '100%',
    },
    button: {
        flex: 1,
        height: hp(5.5),
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: colors.primary,
        width: '100%',
        height: hp(6),
    },
    acceptButtonText: {
        color: colors.white,
        fontFamily: FONT.medium,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: "center",
        width: '100%',
        marginTop: hp(2),
    },
    inputContainerStyle: {
        backgroundColor: colors.background,
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.textSecondary,
        paddingLeft: wp(2),
        borderRadius: hp(2),
        borderWidth: 1,
        borderColor: colors.border,
    },
    label: {
        fontSize: 14,
        fontFamily: FONT.medium,
        color: colors.secondary,
        marginBottom: hp(1),
    },
});