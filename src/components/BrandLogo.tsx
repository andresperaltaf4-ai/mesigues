import React from 'react';
import logoImage from '../assets/images/mesigues_luxury_logo_1789996344878.jpg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      img: 'w-10 h-10',
      text: 'text-xl',
      sub: 'text-[10px]',
      glow: 'inset-0',
    },
    md: {
      img: 'w-14 h-14 sm:w-16 sm:h-16',
      text: 'text-2xl sm:text-3xl',
      sub: 'text-[11px]',
      glow: '-inset-1',
    },
    lg: {
      img: 'w-20 h-20 sm:w-24 sm:h-24',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-xs',
      glow: '-inset-1.5',
    },
    xl: {
      img: 'w-28 h-28 sm:w-32 sm:h-32',
      text: 'text-4xl sm:text-5xl',
      sub: 'text-sm',
      glow: '-inset-2',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 cursor-pointer select-none group ${className}`}>
      {/* High-End Luxury 3D Emblem - Prominent & Crisp */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`absolute ${currentSize.glow} rounded-2xl bg-gradient-to-tr from-[#00aff0] via-cyan-400 to-amber-300 opacity-30 group-hover:opacity-60 blur-md transition-opacity duration-300`}
        />
        <div
          className={`${currentSize.img} relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#00aff0]/60 dark:border-[#00aff0]/70 bg-gradient-to-b from-[#18202b] to-[#0a0d12] flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-105`}
        >
          <img
            src={logoImage}
            alt="mesigues logo alta gama"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Exact lowercase brand typography: mesigues */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`${currentSize.text} font-black tracking-tight text-neutral-900 dark:text-white transition-colors lowercase`}
            >
              me<span className="text-[#00aff0]">sigues</span>
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00aff0] animate-pulse ml-0.5 shadow-sm shadow-[#00aff0]" />
          </div>
          <span
            className={`${currentSize.sub} font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1`}
          >
            <span>Exclusive Creators</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/15 text-amber-500 font-extrabold border border-amber-400/30">
              VIP
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
