interface LogoProps {
  size?: number;
  className?: string;
}

// A custom mark: a lightning bolt whose top edge is notched like a graduation
// cap, merging the "fast alerts" and "apprenticeship" ideas into one glyph.
export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      role="img"
      aria-label="Apprentize"
    >
      <rect width="36" height="36" rx="11" className="fill-ink" />
      {/* graduation-cap brim notch carved into the bolt's top edge */}
      <path
        d="M18 6.5 L11.5 19.5 H17 L14.5 29.5 L24.5 16 H19 L22 6.5 Z"
        className="fill-safety"
        stroke="#fff"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeOpacity="0.35"
      />
      {/* tassel */}
      <path
        d="M24.5 16 L27 13.5"
        className="stroke-safety"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="27" cy="13.5" r="1.1" className="fill-safety" />
    </svg>
  );
}
