import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { hp, wp, spacing } from '../../../enums/spacing';
import { useTranslation } from '../../../hooks/useTranslation';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { Input } from '../../../common/components/Input';
import { Button } from '../../../common/components/Button';
import { Card } from '../../../common/components/Card/Card';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { FONT, typography } from '../../../enums/typography';
import { useAuth } from '../../../context/AuthContext';
import { AreaSlider } from '../../../common/components/AreaSlider';
import { IMAGES, SVG } from '../../../assets';
import { AppText } from '../../../common/components/Typography/Typography';
import { userRepository } from '../../../services/authService';
import { imageStorageRepository } from '../../../services/imageStorageService';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileInfoScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user, userRole } = useAuth();
    const isSeller = userRole === 'seller';
    
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [areaInKm, setAreaInKm] = useState(15);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setLocation(user.address || '');
            setEmail(user.email || '');
            setAreaInKm(user.areaInKm || 15);
            setPhotoURL(user.photoURL || null);
        }
    }, [user]);

    const handleEditPress = () => setIsEditing(true);
    
    const handleCancel = () => {
        if (user) {
            setName(user.displayName || '');
            setLocation(user.address || '');
            setEmail(user.email || '');
            setAreaInKm(user.areaInKm || 15);
            setPhotoURL(user.photoURL || null);
        }
        setIsEditing(false);
        setError(null);
    };

    const handlePhotoPick = async () => {
        if (!isEditing) return;
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets[0].uri) {
            setPhotoURL(result.assets[0].uri);
        }
    };

    const handleDone = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            let uploadedPhotoUrl = user.photoURL || null;
            if (photoURL && !photoURL.startsWith('http')) {
                uploadedPhotoUrl = await imageStorageRepository.uploadFile(photoURL, 'profiles');
            } else if (photoURL) {
                uploadedPhotoUrl = photoURL;
            }

            await userRepository.updateUserProfile(user.uid, {
                displayName: name,
                address: location,
                email: email,
                areaInKm: areaInKm,
                photoURL: uploadedPhotoUrl,
            });
            setIsEditing(false);
        } catch (err: any) {
            console.error('Failed to update profile info:', err);
            setError(err.message || 'Failed to update profile details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={isSeller ? t('store_information') : t('ProfileInfo')}
                showBackButton={true}
                showEditButton={!isEditing}
                onEditPress={handleEditPress}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {error && (
                    <AppText style={styles.errorText}>{error}</AppText>
                )}

                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        activeOpacity={isEditing ? 0.7 : 1}
                        onPress={handlePhotoPick}
                        style={styles.avatarWrapper}
                    >
                        <Image
                            source={photoURL ? { uri: photoURL } : IMAGES.MAN1}
                            style={styles.avatarImage}
                        />
                        {isEditing && (
                            <View style={styles.editBadge}>
                                <SVG.Edit width={hp(2)} height={hp(2)} stroke={colors.white} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <Card style={styles.card}>
                    <Input
                        label={t('name')}
                        value={name}
                        onChangeText={setName}
                        editable={isEditing}
                        placeholder={t('enterName')}
                        inputContainerStyle={styles.inputContainer}
                        style={styles.inputStyle}
                        placeholderTextColor={colors.textSecondary}
                    />
                    <Input
                        label={t('location')}
                        value={location}
                        onChangeText={setLocation}
                        editable={isEditing}
                        placeholder={t('enterLocation')}
                        inputContainerStyle={styles.inputContainer}
                        style={styles.inputStyle}
                        placeholderTextColor={colors.textSecondary}
                    />
                    <Input
                        label={t('emailOrNumber')}
                        value={email}
                        onChangeText={setEmail}
                        editable={isEditing}
                        placeholder={t('enterNumberEmail')}
                        inputContainerStyle={styles.inputContainer}
                        style={styles.inputStyle}
                        placeholderTextColor={colors.textSecondary}
                    />
                </Card>
                {isSeller && (
                    <View style={styles.sellerSection}>
                        <AppText style={styles.areaLabel}>{t('areaOfOperation')}</AppText>
                        <AreaSlider
                            value={areaInKm}
                            onValueChange={(val) => setAreaInKm(Array.isArray(val) ? val[0] : val)}
                            disabled={!isEditing}
                        />

                        <View style={styles.mapContainer}>
                            <Image source={IMAGES.MAP} style={styles.mapImage} />
                        </View>
                    </View>
                )}
            </ScrollView>
            {isEditing && (
                <View style={styles.footer}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
                    ) : (
                        <>
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
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

export default ProfileInfoScreen;

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
        paddingBottom: hp(10),
    },
    card: {
        padding: wp(5),
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(6),
        paddingBottom: hp(4),
        backgroundColor: colors.background,
    },
    footerButton: {
        width: wp(42),
        height: hp(6),
    },
    inputContainer: {
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingHorizontal: wp(2),
    },
    inputStyle: {
        fontSize: 10,
        fontFamily: FONT.regular,
        color: colors.text,
    },
    sellerSection: {
        marginTop: hp(2),
    },
    areaLabel: {
        ...typography.body,
        color: colors.secondary,
        marginBottom: hp(1),
    },
    mapContainer: {
        height: hp(15),
        width: "100%",
        backgroundColor: colors.white,
        borderRadius: spacing.m,
        marginTop: hp(1),
    },
    mapImage: {
        resizeMode: 'cover',
        height: "100%",
        width: "100%",
        borderRadius: spacing.m,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.m,
        ...typography.body,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: hp(2),
    },
    avatarWrapper: {
        position: 'relative',
        borderRadius: hp(6),
        borderWidth: 2,
        borderColor: colors.primary,
        padding: 3,
    },
    avatarImage: {
        width: hp(12),
        height: hp(12),
        borderRadius: hp(6),
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: hp(4),
        height: hp(4),
        borderRadius: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
});
