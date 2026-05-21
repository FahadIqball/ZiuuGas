import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, spacing, wp } from '../../../enums/spacing'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { TxKeyPath } from '../../../context/LanguageContext'
import { AppText } from '../../../common/components/Typography/Typography'
import { FONT } from '../../../enums/typography'
import { Input } from '../../../common/components/Input'
import { Button } from '../../../common/components/Button'
import { SVG } from '../../../assets'
import { launchImageLibrary } from 'react-native-image-picker'
import { CategoryModal } from '../components/selectCategoryModal'
import { useAuth } from '../../../context/AuthContext'
import { productRepository } from '../../../services/productService'

const SellerAddInventoryScreen = ({ navigation, route }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const { product } = route.params || {};
    const isEditing = !!product;

    const [name, setName] = useState(product?.title || '');
    const [weight, setWeight] = useState(product?.weight || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [stock, setStock] = useState(product?.stock?.toString() || '');
    const [description, setDescription] = useState(product?.description || '');
    const [imageUri, setImageUri] = useState<string | null>(product?.image && typeof product.image === 'string' && product.image.startsWith('http') ? product.image : null);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; title: string } | null>(
        product ? { id: product.categoryId, title: product.subtitle || '' } : null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImagePick = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets[0].uri) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!name || !selectedCategory || !price || !stock) {
            setError(t('fill_all_fields'));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const productData = {
                categoryId: selectedCategory.id,
                title: name,
                subtitle: selectedCategory.title,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                weight: weight || '',
                description: description || '',
                image: imageUri || product?.image || 'CYLINDER_1',
            };

            if (isEditing) {
                await productRepository.updateProduct(product.id, productData);
            } else {
                await productRepository.createProduct(user.uid, productData);
            }
            navigation.goBack();
        } catch (err: any) {
            console.error('Failed to save product:', err);
            setError(err.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={isEditing ? t('edit_inventory') : t('add_inventory')}
                showBackButton={true}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.scrollContent}>
                        {error && (
                            <AppText style={styles.errorText}>{error}</AppText>
                        )}

                        <AppText style={styles.sectionTitle}>{t('item_name')}</AppText>
                        <Input
                            placeholder={t('enter_name')}
                            placeholderTextColor={colors.inputPlaceholder}
                            style={styles.input}
                            inputContainerStyle={styles.inputContainer}
                            value={name}
                            onChangeText={setName}
                        />

                        <AppText style={styles.sectionTitle}>{t('select_category')}</AppText>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setIsCategoryModalVisible(true)}
                        >
                            <Input
                                placeholder={t('select_category')}
                                placeholderTextColor={colors.inputPlaceholder}
                                style={styles.input}
                                value={selectedCategory ? t(selectedCategory.title as TxKeyPath) : ''}
                                editable={false}
                                pointerEvents="none"
                                rightIcon={
                                    <SVG.ArrowDown
                                        width={hp(1.5)}
                                        height={hp(1.5)}
                                        stroke={colors.secondary}
                                    />
                                }
                                inputContainerStyle={styles.inputContainer}
                            />
                        </TouchableOpacity>

                        <AppText style={styles.sectionTitle}>{t('item_media')}</AppText>
                        <TouchableOpacity style={styles.mediaView} onPress={handleImagePick}>
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={{ width: '100%', height: '100%', borderRadius: hp(2) }}
                                />
                            ) : (
                                <>
                                    <SVG.Upload stroke={colors.primary} width={hp(6)} height={hp(6)} />
                                    <AppText style={styles.mediaText}>{t('upload_image')}</AppText>
                                    <AppText style={styles.mediaHelper}>{t('choose_file')}</AppText>
                                </>
                            )}
                        </TouchableOpacity>

                        <AppText style={styles.sectionTitle}>{t('description')}</AppText>
                        <Input
                            placeholder={t('enter_description')}
                            placeholderTextColor={colors.inputPlaceholder}
                            style={[styles.input, { minHeight: hp(10), height: undefined, paddingTop: hp(1.5) }]}
                            inputContainerStyle={[styles.inputContainer, { height: undefined }]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />

                        <AppText style={styles.sectionTitle}>{t('weight')}</AppText>
                        <Input
                            placeholder={t('enter_weight')}
                            placeholderTextColor={colors.inputPlaceholder}
                            style={styles.input}
                            inputContainerStyle={styles.inputContainer}
                            value={weight}
                            onChangeText={setWeight}
                        />

                        <AppText style={styles.sectionTitle}>{t('price')}</AppText>
                        <Input
                            placeholder={t('enter_price')}
                            placeholderTextColor={colors.inputPlaceholder}
                            style={styles.input}
                            inputContainerStyle={styles.inputContainer}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />

                        <AppText style={styles.sectionTitle}>{t('total_items_in_stock')}</AppText>
                        <Input
                            placeholder={t('enter_stock')}
                            placeholderTextColor={colors.inputPlaceholder}
                            style={styles.input}
                            inputContainerStyle={styles.inputContainer}
                            value={stock}
                            onChangeText={setStock}
                            keyboardType="numeric"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: hp(2) }} />
                        ) : (
                            <Button
                                title={t('save')}
                                style={styles.button}
                                onPress={handleSave}
                                textStyle={styles.buttonText}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <CategoryModal
                visible={isCategoryModalVisible}
                onClose={() => setIsCategoryModalVisible(false)}
                onSelect={(category) => setSelectedCategory(category)}
                selectedCategoryId={selectedCategory?.id}
            />
        </View>
    )
}

export default SellerAddInventoryScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: wp(6),
        flexGrow: 1,
        paddingTop: spacing.s,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONT.medium,
        marginBottom: 10,
        color: colors.secondary
    },
    input: {
        fontSize: 10,
        fontFamily: FONT.regular,
        paddingHorizontal: wp(4),
        borderRadius: hp(2),
        backgroundColor: colors.inputBackground,
        color: colors.secondary,
    },
    mediaView: {
        height: hp(20),
        width: '100%',
        paddingHorizontal: wp(4),
        marginBottom: spacing.s,
        borderRadius: hp(2),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaText: {
        marginTop: hp(1),
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.secondary
    },
    mediaHelper: {
        marginTop: hp(1.5),
        fontSize: 10,
        fontFamily: FONT.medium,
        color: colors.primary
    },
    button: {
        height: hp(6),
        marginBottom: hp(2),
        borderRadius: hp(10),
    },
    inputContainer: {
        borderRadius: hp(2),
        paddingHorizontal: wp(2),
        backgroundColor: colors.inputBackground,
        borderColor: colors.border,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: FONT.medium,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        fontFamily: FONT.regular,
        textAlign: 'center',
        marginBottom: spacing.m,
    }
})