import React from 'react';

interface MedoraxLogoProps {
  size?: number;
  className?: string;
}

export const MedoraxLogo: React.FC<MedoraxLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MedoraX Logo"
    >
      <defs>
        {/* Outer radial glow */}
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FA" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#2563EB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>

        {/* Cross gradient - teal to blue */}
        <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="40%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Inner glowing core */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="50%" stopColor="#7DD3FA" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
        </radialGradient>

        {/* Pixel overlay fill */}
        <linearGradient id="pixelFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
        </linearGradient>

        {/* Filter: blur glow */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Filter: soft glow for cross */}
        <filter id="crossGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background subtle glow circle */}
      <circle cx="16" cy="16" r="15" fill="url(#outerGlow)" />

      {/* Scattered pixel dots — background layer */}
      <g opacity="0.5">
        <rect x="3" y="10" width="1.2" height="1.2" rx="0.2" fill="#5EEAD4" opacity="0.7" />
        <rect x="5" y="7" width="1" height="1" rx="0.2" fill="#38BDF8" opacity="0.6" />
        <rect x="6" y="13" width="1" height="1" rx="0.2" fill="#7DD3FA" opacity="0.5" />
        <rect x="26" y="9" width="1.2" height="1.2" rx="0.2" fill="#38BDF8" opacity="0.8" />
        <rect x="28" y="12" width="1" height="1" rx="0.2" fill="#60A5FA" opacity="0.6" />
        <rect x="25" y="16" width="1" height="1" rx="0.2" fill="#7DD3FA" opacity="0.7" />
        <rect x="27" y="20" width="1.2" height="1.2" rx="0.2" fill="#38BDF8" opacity="0.5" />
        <rect x="4" y="20" width="1" height="1" rx="0.2" fill="#5EEAD4" opacity="0.6" />
        <rect x="7" y="24" width="1" height="1" rx="0.2" fill="#7DD3FA" opacity="0.4" />
        <rect x="23" y="25" width="1" height="1" rx="0.2" fill="#60A5FA" opacity="0.5" />
      </g>

      {/* Main cross shape — pixel grid layer (slightly offset, blue) */}
      <g filter="url(#crossGlow)" opacity="0.6">
        <rect x="13" y="6" width="6" height="20" rx="1" fill="url(#pixelFill)" />
        <rect x="6" y="13" width="20" height="6" rx="1" fill="url(#pixelFill)" />
      </g>

      {/* Main cross shape — primary glowing layer */}
      <g filter="url(#crossGlow)">
        <rect x="13.5" y="6.5" width="5" height="19" rx="0.8" fill="url(#crossGrad)" opacity="0.95" />
        <rect x="6.5" y="13.5" width="19" height="5" rx="0.8" fill="url(#crossGrad)" opacity="0.95" />
      </g>

      {/* Internal grid lines on cross — pixel effect */}
      <g opacity="0.3" stroke="#FFFFFF" strokeWidth="0.3">
        <line x1="15" y1="6.5" x2="15" y2="25.5" />
        <line x1="17" y1="6.5" x2="17" y2="25.5" />
        <line x1="6.5" y1="15" x2="25.5" y2="15" />
        <line x1="6.5" y1="17" x2="25.5" y2="17" />
      </g>

      {/* Central bright glowing core */}
      <circle cx="16" cy="16" r="3.5" fill="url(#coreGlow)" filter="url(#glow)" />

      {/* Tiny inner bright dot */}
      <circle cx="16" cy="16" r="1.2" fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
};

export default MedoraxLogo;
