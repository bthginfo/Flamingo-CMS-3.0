import type { CSSProperties } from 'react';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { ImageEffectWrapper } from '@/components/ui/image-effects';

type Props = {
  src: string; alt: string; position?: string; mobilePosition?: string; sizes: string;
  priority?: boolean; editKey?: string; className?: string;
  motion?: string; imageEffect?: string; hoverEffect?: string;
};

/** One authored image contract, including separate narrow-screen crops. */
export function PerspectiveImage({ src, alt, position = 'center', mobilePosition, sizes, priority, editKey = 'image', className = '', motion = 'none', imageEffect = 'none', hoverEffect = 'none' }: Props) {
  const effect = motion !== 'none' && (imageEffect === 'parallax' || imageEffect === 'kenBurns') ? imageEffect : 'none';
  return <div className={`perspective-image absolute inset-0 overflow-hidden ${className}`} data-perspective-image data-image-effect={effect} data-motion={motion} data-hover-effect={motion === 'none' ? 'none' : hoverEffect}>
    <ImageEffectWrapper effect={effect} intensity={motion === 'expressive' ? 'medium' : 'subtle'} className={effect === 'parallax' ? 'absolute -inset-8' : 'absolute inset-0'}>
      <ResilientNextImage src={src} alt={alt} fill priority={priority} sizes={sizes} className="perspective-image-media object-cover" style={{ objectPosition: position || 'center', '--perspective-mobile-focal': mobilePosition || position || 'center' } as CSSProperties} data-edit-image={editKey} />
    </ImageEffectWrapper>
  </div>;
}
