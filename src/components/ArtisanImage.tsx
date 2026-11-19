import React, { useState } from 'react';
import { MenuItem } from '../data/storeData';
import { assetUrl } from '../utils/assetUrl';
import { ProductArtwork } from './ProductArtwork';

export type ImageTone = 'warm' | 'rich' | 'neutral';

interface ArtisanImageProps {
  src: string;
  alt: string;
  imgClassName?: string;
  tone?: ImageTone;
  fallbackArtworkKey?: MenuItem['artworkKey'];
  caption?: string;
  className?: string;
}

const TONE_FILTERS: Record<ImageTone, string> = {
  warm: 'brightness-[1.01] contrast-[1.06] saturate-[1.08] sepia-[0.09]',
  rich: 'brightness-[0.99] contrast-[1.07] saturate-[1.06] sepia-[0.14]',
  neutral: 'brightness-[1.01] contrast-[1.04] saturate-[1.03] sepia-[0.04]',
};

export const ArtisanImage: React.FC<ArtisanImageProps> = ({
  src,
  alt,
  imgClassName = 'object-center',
  tone = 'warm',
  fallbackArtworkKey,
  caption,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = assetUrl(src);

  if (hasError) {
    if (fallbackArtworkKey) {
      return <ProductArtwork artworkKey={fallbackArtworkKey} className={className} />;
    }
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-[#2E1B12] text-[#F5EDE1] p-6 text-center ${className}`}
      >
        <span className="font-display text-lg font-semibold">Xíu Bread &amp; Coffee</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#24140D] ${className}`}>
      <div className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover filter ${TONE_FILTERS[tone]} ${imgClassName}`}
        />
      </div>
      {/* Subtle warm editorial vignette & crisp inset edge to unify lighting across photographs */}
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(36,20,13,0.20)] ring-1 ring-inset ring-black/5"
        aria-hidden="true"
      />
      {caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0E08]/90 via-[#1A0E08]/45 to-transparent px-3.5 pt-10 pb-2.5">
          <p className="text-xs font-medium text-[#FCFAF7] tracking-wide truncate">{caption}</p>
        </div>
      )}
    </div>
  );
};
