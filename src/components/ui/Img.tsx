import type { ImgHTMLAttributes } from 'react';
import type { ResponsiveImage } from '../../content/types';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  image: ResponsiveImage;
  alt: string;
  /** Sizes hint for the browser, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string;
  priority?: boolean;
}

export default function Img({ image, alt, sizes = '100vw', priority = false, className = '', ...rest }: ImgProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      {...rest}
    />
  );
}
