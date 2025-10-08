import data from './placeholder-images.json';
import { ProductImage } from './types';

export const PlaceHolderImages: ProductImage[] = data.placeholderImages.map(p => ({
    id: p.id,
    src: p.imageUrl,
    alt: p.description,
    hint: p.imageHint,
}));
