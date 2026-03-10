interface TechHeartLogoProps {
  className?: string;
  size?: number;
}

export default function TechHeartLogo({ className = '', size = 24 }: TechHeartLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="techHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Main heart shape */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#techHeartGrad)"
      />

      {/* Horizontal circuit lines - thinner and more */}
      <line x1="5" y1="6" x2="8" y2="6" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="16" y1="6" x2="19" y2="6" stroke="white" strokeWidth="0.8" opacity="0.9" />

      <line x1="4" y1="8" x2="7" y2="8" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="9" y1="8" x2="11" y2="8" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="13" y1="8" x2="15" y2="8" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="17" y1="8" x2="20" y2="8" stroke="white" strokeWidth="0.8" opacity="0.9" />

      <line x1="4" y1="10" x2="6" y2="10" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="8" y1="10" x2="10" y2="10" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="14" y1="10" x2="16" y2="10" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="18" y1="10" x2="20" y2="10" stroke="white" strokeWidth="0.8" opacity="0.9" />

      <line x1="5" y1="12" x2="7" y2="12" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="9" y1="12" x2="11" y2="12" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="13" y1="12" x2="15" y2="12" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="17" y1="12" x2="19" y2="12" stroke="white" strokeWidth="0.8" opacity="0.9" />

      <line x1="6" y1="14" x2="9" y2="14" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="15" y1="14" x2="18" y2="14" stroke="white" strokeWidth="0.8" opacity="0.9" />

      <line x1="8" y1="16" x2="10" y2="16" stroke="white" strokeWidth="0.8" opacity="0.9" />
      <line x1="14" y1="16" x2="16" y2="16" stroke="white" strokeWidth="0.8" opacity="0.9" />

      {/* Vertical circuit lines - thinner and more */}
      <line x1="6" y1="5" x2="6" y2="7" stroke="white" strokeWidth="0.8" opacity="0.85" />
      <line x1="18" y1="5" x2="18" y2="7" stroke="white" strokeWidth="0.8" opacity="0.85" />

      <line x1="8" y1="6" x2="8" y2="9" stroke="white" strokeWidth="0.8" opacity="0.85" />
      <line x1="16" y1="6" x2="16" y2="9" stroke="white" strokeWidth="0.8" opacity="0.85" />

      <line x1="10" y1="8" x2="10" y2="11" stroke="white" strokeWidth="0.8" opacity="0.85" />
      <line x1="14" y1="8" x2="14" y2="11" stroke="white" strokeWidth="0.8" opacity="0.85" />

      <line x1="12" y1="5" x2="12" y2="17" stroke="white" strokeWidth="0.8" opacity="0.85" />

      <line x1="9" y1="12" x2="9" y2="15" stroke="white" strokeWidth="0.8" opacity="0.85" />
      <line x1="15" y1="12" x2="15" y2="15" stroke="white" strokeWidth="0.8" opacity="0.85" />

      <line x1="11" y1="14" x2="11" y2="17" stroke="white" strokeWidth="0.8" opacity="0.85" />
      <line x1="13" y1="14" x2="13" y2="17" stroke="white" strokeWidth="0.8" opacity="0.85" />

      {/* Central processor chip */}
      <rect x="10.5" y="9.5" width="3" height="3" fill="white" opacity="0.4" />
      <rect x="11" y="10" width="2" height="2" fill="white" opacity="0.3" />

      {/* Circuit nodes - smaller and more */}
      <circle cx="5" cy="6" r="0.6" fill="white" opacity="0.95" />
      <circle cx="19" cy="6" r="0.6" fill="white" opacity="0.95" />
      <circle cx="4" cy="8" r="0.6" fill="white" opacity="0.95" />
      <circle cx="20" cy="8" r="0.6" fill="white" opacity="0.95" />
      <circle cx="4" cy="10" r="0.6" fill="white" opacity="0.95" />
      <circle cx="20" cy="10" r="0.6" fill="white" opacity="0.95" />
      <circle cx="5" cy="12" r="0.6" fill="white" opacity="0.95" />
      <circle cx="19" cy="12" r="0.6" fill="white" opacity="0.95" />

      <circle cx="12" cy="5" r="0.6" fill="white" opacity="0.95" />
      <circle cx="12" cy="17" r="0.6" fill="white" opacity="0.95" />

      <circle cx="8" cy="8" r="0.5" fill="white" opacity="0.9" />
      <circle cx="16" cy="8" r="0.5" fill="white" opacity="0.9" />
      <circle cx="10" cy="10" r="0.5" fill="white" opacity="0.9" />
      <circle cx="14" cy="10" r="0.5" fill="white" opacity="0.9" />
      <circle cx="10" cy="12" r="0.5" fill="white" opacity="0.9" />
      <circle cx="14" cy="12" r="0.5" fill="white" opacity="0.9" />
    </svg>
  );
}
