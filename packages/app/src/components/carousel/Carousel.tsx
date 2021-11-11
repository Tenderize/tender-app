import Link from "next/link";
import Image from "next/dist/client/image";

export const Carousel = () => (
  <div className="slider">
    <div className="slides">
      <div id="slide-1">
        <Image layout="fill" src="/landing/mobile-rewards.svg" />
      </div>
      <div id="slide-2">
        <Image layout="fill" src="/landing/mobile-defi.svg" />
      </div>
      <div id="slide-3">
        <Image layout="fill" src="/landing/mobile-lockup.svg" />
      </div>
      <div id="slide-4">
        <Image layout="fill" src="/landing/mobile-staking.svg" />
      </div>
    </div>
    <Link href="#slide-1" scroll={false}>
      <a />
    </Link>
    <Link href="#slide-2" scroll={false}>
      <a />
    </Link>
    <Link href="#slide-3" scroll={false}>
      <a />
    </Link>
    <Link href="#slide-4" scroll={false}>
      <a />
    </Link>
    <Link href="#slide-5" scroll={false}>
      <a />
    </Link>
  </div>
);
