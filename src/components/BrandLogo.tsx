import React from 'react';
import logoEmblem from '../assets/images/mesigues_logo_emblem_1790140282542.jpg';

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
      box: 'w-8 h-8',
      text: 'text-lg',
      sub: 'text-[8px]',
      glow: 'inset-0',
    },
    md: {
      box: 'w-10 h-10 sm:w-11 sm:h-11',
      text: 'text-xl sm:text-2xl',
      sub: 'text-[9px]',
      glow: '-inset-0.5',
    },
    lg: {
      box: 'w-14 h-14 sm:w-16 sm:h-16',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-xs',
      glow: '-inset-1',
    },
    xl: {
      box: 'w-20 h-20 sm:w-24 sm:h-24',
      text: 'text-4xl sm:text-5xl',
      sub: 'text-sm',
      glow: '-inset-1.5',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      id="brand-logo-mesigues"
      className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* ME SIGUES Signature 3D Emblem with Ambient Cyan Glow */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`absolute ${currentSize.glow} rounded-2xl bg-gradient-to-tr from-[#00aff0] to-cyan-400 opacity-40 group-hover:opacity-75 blur-md transition-opacity duration-300`}
        />
        <div
          className={`${currentSize.box} relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#00aff0]/80 bg-neutral-950 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
        >
          <img
            src={logoEmblem}
            alt="ME SIGUES Logo Emblem"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Brand Typography: ME SIGUES */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight font-sans">
            <span className={`${currentSize.text} font-black text-neutral-900 dark:text-white uppercase transition-colors tracking-tight`}>
              ME
            </span>
            <span className={`${currentSize.text} font-black text-[#00aff0] uppercase transition-colors tracking-tight ml-1.5`}>
              SIGUES
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00aff0] animate-pulse ml-1.5 shadow-sm shadow-[#00aff0]" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`${currentSize.sub} font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-400`}>
              Exclusive Creators
            </span>
            <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-[#00aff0]/15 text-[#00aff0] border border-[#00aff0]/30">
              VIP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
