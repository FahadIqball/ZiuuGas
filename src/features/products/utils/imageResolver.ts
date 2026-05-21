import { IMAGES } from '../../../assets';

export const resolveProductImage = (image: any): any => {
  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('file://')) {
      return { uri: image };
    }
    const assetKey = image.toUpperCase();
    if (assetKey in IMAGES) {
      return IMAGES[assetKey as keyof typeof IMAGES];
    }
  }
  if (typeof image === 'number') {
    return image;
  }
  // Fallback default
  return IMAGES.CYLINDER_1;
};
export default resolveProductImage;
