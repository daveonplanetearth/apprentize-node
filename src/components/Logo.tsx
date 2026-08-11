interface LogoProps {
  size?: number;
  className?: string;
}

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
      {/* Mortarboard (graduation cap) */}
      <path
        d="M18 4 4 10l14 6 14-6-14-6Z"
        className="fill-ink"
      />
      <path
        d="M10 12.5v5c0 1.6 3.6 2.9 8 2.9s8-1.3 8-2.9v-5l-8 3.4-8-3.4Z"
        className="fill-ink"
      />
      {/* Tassel */}
      <path
        d="M30 10v6"
        className="stroke-ink"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="30" cy="17.5" r="1.3" className="fill-safety" />

      {/* Young person — head */}
      <circle cx="18" cy="24.5" r="3.4" className="fill-ink" />

      {/* Shoulders / upper body */}
      <path
        d="M11.5 33.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"
        className="fill-ink"
      />
    </svg>
  );
}
