import { useState, useEffect } from 'react';
import { productRepository } from '../../../services/productService';
import { reviewRepository } from '../../../services/reviewService';
import { ProductDetails } from '../dummies/productDetails';
import { resolveProductImage } from '../utils/imageResolver';
import { IMAGES } from '../../../assets';

export const useProductDetails = (productId?: string) => {
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const [fetchedProduct, fetchedReviews] = await Promise.all([
                    productRepository.getProductDetails(productId),
                    reviewRepository.getReviewsByProduct(productId)
                ]);

                if (fetchedProduct) {
                    const mappedDetails: ProductDetails = {
                        id: fetchedProduct.id,
                        name: fetchedProduct.title,
                        price: fetchedProduct.price.toString(),
                        rating: 4.5, // Could be calculated from reviews
                        reviewCount: fetchedReviews.length || 0,
                        image: resolveProductImage(fetchedProduct.image),
                        imageRaw: fetchedProduct.image,
                        sellerId: fetchedProduct.sellerId,
                        description: fetchedProduct.description || '',
                        productKey: fetchedProduct.subtitle || 'gas_cylinder',
                        weight: fetchedProduct.weight || '',
                        seller: {
                            name: fetchedProduct.seller?.name || 'Gas Store',
                            avatar: fetchedProduct.seller?.avatar || IMAGES.CYLINDER_STORE,
                            positiveRatings: fetchedProduct.seller?.positiveRatings || '95%',
                            shippingOnTime: fetchedProduct.seller?.shippingOnTime || '98%',
                        },
                        reviews: fetchedReviews.length > 0 ? fetchedReviews.map(r => ({
                            id: r.id,
                            userName: r.userName,
                            avatar: r.userAvatar ? { uri: r.userAvatar } : IMAGES.MAN1,
                            rating: r.rating,
                            time: r.createdAt ? (typeof r.createdAt.toDate === 'function' ? r.createdAt.toDate().toLocaleDateString() : new Date(r.createdAt).toLocaleDateString()) : '',
                            comment: r.comment,
                        })) : [],
                    };
                    setProduct(mappedDetails);
                } else {
                    setError('Product not found');
                }
            } catch (err: any) {
                console.error('useProductDetails error:', err);
                setError(err.message || 'Failed to fetch product details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, isLoading, error };
};
export default useProductDetails;
