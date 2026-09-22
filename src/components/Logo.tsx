import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoProps {
  className?: string;
  showStatus?: boolean;
  alt?: string;
}

/**
 * SokeinLogoIcon: Official SOKEIN TECH circular emblem logo.
 * Features 3D cyan/blue cyber-ribbon S, pixel data elements, code brackets,
 * futuristic typography, and motto "CODE • CREATE • SOLVE • GROW".
 */
export function SokeinLogoIcon({
  className = 'w-10 h-10 sm:w-11 sm:h-11',
  showStatus = true,
  alt = 'SOKEIN TECH',
}: LogoProps) {
  return (
    <div className={`relative flex-shrink-0 group-hover:scale-105 transition-all duration-300 ${className}`}>
      <img
        src={logoImg}
        alt={alt}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== window.location.origin + '/logo.png') {
            target.src = '/logo.png';
          }
        }}
        className="w-full h-full object-contain rounded-full bg-white select-none shadow-sm ring-1 ring-slate-200/70"
        loading="eager"
      />

      {/* Live Store Status Beacon (Emerald Green) */}
      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs ring-1 ring-emerald-400/40"
          title="ហាងបើកដំណើរការ (Open)"
        />
      )}
    </div>
  );
}

/**
 * Full Brand Lockup with Logo Icon, SOKEIN TECH typography, and Location tagline
 */
export function SokeinBrandLockup({
  iconSize = 'w-10 h-10 sm:w-12 sm:h-12',
  locationText = '📍 រតនៈ បាត់ដំបង',
  subText = 'ហាងបច្ចេកវិទ្យា',
  className = '',
}: {
  iconSize?: string;
  locationText?: string;
  subText?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group ${className}`}>
      <SokeinLogoIcon className={iconSize} />
      <div>
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
          <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight">SOKEIN</span>
          <span className="font-black text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            TECH
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-500 font-medium tracking-normal mt-1 leading-tight">
          <span>{locationText}</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-semibold">{subText}</span>
        </div>
      </div>
    </div>
  );
}

export default SokeinLogoIcon;
