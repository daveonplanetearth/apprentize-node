interface LogoProps {
  size?: number;
  className?: string;
}

// public/logo.png is 160×160, so it stays sharp up to ~53px on a 3× screen. Also the favicon.
export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      className={className}
      alt="Apprentize"
    />
  );
}
