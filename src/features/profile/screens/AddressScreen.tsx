import { StyleSheet, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, wp } from '../../../enums/spacing'
import { FONT } from '../../../enums/typography'
import { Input } from '../../../common/components/Input'
import { Button } from '../../../common/components/Button'
import { useAuth } from '../../../context/AuthContext'
import { addressRepository } from '../../../services/addressService'
import { Address } from '../services/types'
import { SVG } from '../../../assets'

const AddressScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();

    const [viewMode, setViewMode] = useState<'list' | 'edit' | 'add'>('list');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const [form, setForm] = useState({
        house: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const fetchAddresses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const list = await addressRepository.getAddresses(user.uid);
            setAddresses(list);
        } catch (err) {
            console.error('Failed to load addresses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    const handleAddAddress = () => {
        setForm({
            house: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        });
        setSelectedAddress(null);
        setViewMode('add');
    };

    const handleEditAddress = (addr: Address) => {
        setForm({
            house: addr.house || '',
            street: addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            zipCode: addr.zipCode || '',
            country: addr.country || '',
        });
        setSelectedAddress(addr);
        setViewMode('edit');
    };

    const handleCancel = () => {
        setViewMode('list');
    };

    const handleDone = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const id = selectedAddress ? selectedAddress.id : 'addr_' + Date.now();
            await addressRepository.saveAddress(user.uid, {
                id,
                house: form.house.trim(),
                street: form.street.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                zipCode: form.zipCode.trim(),
                country: form.country.trim(),
                isDefault: selectedAddress ? selectedAddress.isDefault : (addresses.length === 0),
            });
            await fetchAddresses();
            setViewMode('list');
        } catch (err) {
            console.error('Failed to save address:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const renderAddressList = () => (
        <View style={styles.addressList}>
            {addresses.map((addr) => {
                const combined = [addr.house, addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(p => !!p).join(', ');
                return (
                    <TouchableOpacity key={addr.id} activeOpacity={0.8} onPress={() => handleEditAddress(addr)}>
                        <Input
                            label={addr.isDefault ? t('Default_Address') : t('address')}
                            value={combined}
                            inputContainerStyle={styles.inputContainer}
                            style={styles.inputStyle}
                            editable={false}
                            multiline
                            pointerEvents="none"
                            rightIcon={<SVG.Edit2 />}
                        />
                    </TouchableOpacity>
                );
            })}
            <Button
                title={t('addNewAddress')}
                variant="primary"
                style={styles.addButton}
                onPress={handleAddAddress}
                leftIcon={<SVG.AddressPin stroke={colors.primary} />}
            />
        </View>
    );

    const renderForm = () => (
        <View style={styles.formContainer}>
            <Input
                label={t('house_appartment')}
                value={form.house}
                onChangeText={(v) => updateField('house', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
            <Input
                label={t('street')}
                value={form.street}
                onChangeText={(v) => updateField('street', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
            <Input
                label={t('city')}
                value={form.city}
                onChangeText={(v) => updateField('city', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
            <Input
                label={t('state')}
                value={form.state}
                onChangeText={(v) => updateField('state', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
            <Input
                label={t('zip_code')}
                value={form.zipCode}
                onChangeText={(v) => updateField('zipCode', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
            <Input
                label={t('country')}
                value={form.country}
                onChangeText={(v) => updateField('country', v)}
                inputContainerStyle={styles.inputContainer}
                style={styles.inputStyle}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('addresses')}
                showBackButton={true}
            />
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {viewMode === 'list' ? renderAddressList() : renderForm()}
                </ScrollView>
            )}
            {viewMode !== 'list' && !loading && (
                <View style={styles.footer}>
                    <Button
                        title={t('cancel')}
                        variant="whatsapp"
                        style={styles.footerButton}
                        onPress={handleCancel}
                    />
                    <Button
                        title={t('done')}
                        variant="primary"
                        style={styles.footerButton}
                        onPress={handleDone}
                    />
                </View>
            )}
        </View>
    )
}

export default AddressScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: hp(12),
    },
    addressList: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
    },
    formContainer: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
        gap: hp(1),
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: wp(2),
        minHeight: 50,
        height: undefined,
    },
    inputStyle: {
        fontSize: 14,
        fontFamily: FONT.regular,
        color: colors.text,
    },
    addButton: {
        marginTop: hp(2),
        borderStyle: 'dashed',
        height: hp(6),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(6),
        paddingBottom: hp(4),
        backgroundColor: colors.background,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    footerButton: {
        width: wp(42),
        height: hp(6),
    },
})
