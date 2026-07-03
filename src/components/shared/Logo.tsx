import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-40" }: LogoProps) {
  return (
    <Image
      src="/assets/logo.png"
      alt="Women Concern"
      width={800}
      height={600}
      priority
      className={`h-auto ${className}`}
    />
  );
}
