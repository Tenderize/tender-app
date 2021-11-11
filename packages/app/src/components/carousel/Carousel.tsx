import Link from "next/link";

export const Carousel = () => (
  <div className="slider">
    <div className="slides">
      <div id="slide-1">
        <img
          style={{
            height: "400%",
            transformOrigin: "topLeft",
            transform: "scale(0.25)",
          }}
          src="/landing/mobile-rewards.svg"
        />
      </div>
      <div id="slide-2">
        <img
          style={{
            height: "400%",
            transformOrigin: "topLeft",
            transform: "scale(0.25)",
          }}
          src="/landing/mobile-defi.svg"
        />
      </div>
      <div id="slide-3">
        <img
          style={{
            height: "400%",
            transformOrigin: "topLeft",
            transform: "scale(0.25)",
          }}
          src="/landing/mobile-lockup.svg"
        />
      </div>
      <div
        style={{
          height: "400%",
          transformOrigin: "topLeft",
          transform: "scale(0.25)",
        }}
        id="slide-4"
      >
        <img src="/landing/mobile-staking.svg" />
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
