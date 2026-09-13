interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      className={`object-contain drop-shadow-[0_6px_10px_rgba(76,29,149,0.28)] ${className}`}
      alt="Apprentize"
    />
  );
}
