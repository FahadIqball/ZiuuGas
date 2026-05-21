import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { SVG } from '../../../assets';
import { productRepository } from '../../../services/productService';
import { Product } from '../../products/services/types';

export const useHome = () => {
    const { t } = useTranslation();
    const [selectedCategoryId, setSelectedCategoryId] = useState('1');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const CATEGORIES = useMemo(() => [
        { id: '1', title: t('Gas Cylinder'), icon: SVG.Gas },
        { id: '2', title: t('Water Can'), icon: SVG.Water },
        { id: '3', title: t('Refill'), icon: SVG.Refill },
        { id: '4', title: t('Accessories'), icon: SVG.Accessories },
    ], [t]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedProducts = await productRepository.getProductsByCategory(selectedCategoryId);
                setProducts(fetchedProducts);
            } catch (err: any) {
                console.error('useHome: failed to fetch products:', err);
                setError(err.message || 'Failed to load products.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    const handleCategorySelect = (id: string) => {
        setProducts([]);   // clear immediately so stale data never flashes
        setIsLoading(true);
        setSelectedCategoryId(id);
    };

    return {
        categories: CATEGORIES,
        products,
        selectedCategoryId,
        handleCategorySelect,
        isLoading,
        error,
    };
};
