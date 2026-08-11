interface LogoProps {
  size?: number;
  className?: string;
}

const spectrumColors = ['#e6194B', '#ff8c00', '#ffd166', '#06d6a0', '#118ab2', '#7c3aed'];

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
      {spectrumColors.map((color, index) => (
        <rect
          key={color}
          x="3"
          y={3 + index * 5}
          width="30"
          height="4"
          rx="1.5"
          fill={color}
        />
      ))}
    </svg>
  );
}
