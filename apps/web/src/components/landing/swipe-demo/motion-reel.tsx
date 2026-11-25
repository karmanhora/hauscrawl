import Image from "next/image";

export function MotionReel({ src }: { src: string }) {
  return <Image src={src} alt="Illustrative sample home" width={800} height={1000} className="h-full w-full object-cover" />;
}
