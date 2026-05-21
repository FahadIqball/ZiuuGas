import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { useStyles } from '../../../hooks/useStyles';
import { ThemeColors } from '../../../enums/colors';
import { spacing, hp, wp } from '../../../enums/spacing';
import { AppText } from '../../../common/components/Typography/Typography';
import { useTranslation } from '../../../hooks/useTranslation';
import { TxKeyPath } from '../../../context/LanguageContext';
import { ScreenHeader } from '../../../common/components/ScreenHeader';
import { Input } from '../../../common/components/Input';
import { SVG } from '../../../assets';
import { FONT, typography } from '../../../enums/typography';
import { CATEGORIES } from '../dummies/inventory';
import { InventoryCard } from '../components/InventoryCard';
import { CategoryItem } from '../../home/components/CategoryItem';
import { SwipeableInventoryItem } from '../components/SwipeableInventoryItem';
import { Routes } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { productRepository } from '../../../services/productService';
import { Product } from '../services/types';
import { resolveProductImage } from '../utils/imageResolver';

const SellerInventoryScreen: React.FC = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async (showLoader = true) => {
    if (!user) return;
    if (showLoader) setIsLoading(true);
    try {
      const items = await productRepository.getSellerInventory(user.uid);
      setProducts(items);
    } catch (err) {
      console.error('Failed to load seller inventory:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInventory(true);
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory(false);
  };

  const handleDelete = async (productId: string) => {
    try {
      await productRepository.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const navigateToAddInventory = () => {
    navigation.navigate(Routes.SELLER_ADD_INVENTORY);
  };

  const filteredItems = products.filter(
    (item) =>
      item.categoryId === selectedCategory &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader title={t('inventory')} />
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <Input
              placeholder={t('search')}
              placeholderTextColor={colors.inputPlaceholder}
              icon={<SVG.SearchIcon stroke={colors.secondary} width={18} height={18} />}
              value={searchQuery}
              onChangeText={setSearchQuery}
              inputContainerStyle={styles.searchInputContainer}
              containerStyle={styles.searchInputWrapper}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          >
            {/* Categories Section */}
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>{t('Categories')}</AppText>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((item) => (
                  <CategoryItem
                    key={item.id}
                    title={t(item.title as TxKeyPath)}
                    icon={item.icon}
                    isSelected={selectedCategory === item.id}
                    onPress={() => setSelectedCategory(item.id)}
                  />
                ))}
              </View>
            </View>

            {/* Items Section */}
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>{t('Items')}</AppText>
              
              {isLoading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : filteredItems.length === 0 ? (
                <View style={styles.centerContainer}>
                  <AppText style={styles.emptyText}>
                    {t('no_products') || 'No inventory items in this category.'}
                  </AppText>
                </View>
              ) : (
                <View style={styles.itemsList}>
                  {filteredItems.map((item) => (
                    <SwipeableInventoryItem
                      key={item.id}
                      onEdit={() => navigation.navigate(Routes.SELLER_ADD_INVENTORY, { product: item })}
                      onDelete={() => handleDelete(item.id)}
                    >
                      <InventoryCard
                        title={item.title}
                        stock={item.stock}
                        price={item.price}
                        image={resolveProductImage(item.image)}
                      />
                    </SwipeableInventoryItem>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={navigateToAddInventory}
        >
          <AppText style={styles.fabIcon}>+</AppText>
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: wp(6),
    marginTop: spacing.s,
  },
  searchInputWrapper: {
    marginBottom: spacing.m,
  },
  searchInputContainer: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: spacing.m,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    marginBottom: hp(1),
    fontSize: 16,
    fontFamily: FONT.medium,
    color: colors.secondary,
    paddingHorizontal: wp(6),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: wp(6),
  },
  itemsList: {
    marginTop: spacing.s,
    paddingHorizontal: wp(6),
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 30,
    fontFamily: FONT.regular,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    ...typography.body,
  },
});

export default SellerInventoryScreen;
