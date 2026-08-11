interface LogoProps {
  size?: number;
  className?: string;
}

const logoSource = '/ChatGPT_Image_Aug_11,_2026,_03_15_14_PM.png';

export default function Logo({ size = 28, className = '' }: LogoProps) {
  return (
    <img
      src={logoSource}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      alt="Apprentize"
    />
  );
}
