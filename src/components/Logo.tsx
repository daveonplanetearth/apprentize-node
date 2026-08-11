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
      <path
        d="M2.5 11.5 13.5 5l11 6.5-11 6.5-11-6.5Z"
        className="fill-ink"
      />
      <path
        d="M6 13.5v6.1c0 1.8 3.4 3.6 7.5 3.6s7.5-1.8 7.5-3.6v-6.1l-7.5 4.4L6 13.5Z"
        className="fill-ink"
      />
      <path d="M5.2 12.8v6.1" className="stroke-ink" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="5.2" cy="20.2" r="1.1" className="fill-ink" />
      <path d="m4.4 21.2-.6 3.1h2.8L6 21.2" className="fill-ink" />
      <circle cx="27.1" cy="10.5" r="3.2" className="fill-ink" />
      <path
        d="M22 22.8v-7.2c0-2.1 1.5-3.7 3.5-3.7s3.7 1.6 3.7 3.7v3.6h2.9c1.3 0 2.4 1 2.4 2.3v1.3H22Z"
        className="fill-ink"
      />
      <path
        d="M25.5 16.2 27 20h5.7l2.8-5.6c.3-.6 1.1-.8 1.7-.5.6.3.8 1.1.5 1.7l-3.2 6.3c-.3.6-.9.9-1.6.9H26.6c-1.5 0-2.8-1-3.3-2.4l-1.1-3.1"
        className="fill-safety"
      />
    </svg>
  );
}
