import Link from "next/link";

export const Carousel = () => (
  <div className="slider">
    <div className="slides">
      <div id="slide-1">
        <div
          style={{
            height: "30vh",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img
            style={{
              height: "400%",
              transformOrigin: "top",
              transform: "scale(0.25)",
            }}
            src="/landing/mobile-rewards.svg"
          />
        </div>
      </div>
      <div id="slide-2">
        <div
          style={{
            height: "30vh",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img
            style={{
              height: "400%",
              transformOrigin: "top",
              transform: "scale(0.25)",
            }}
            src="/landing/mobile-defi.svg"
          />
        </div>
      </div>
      <div id="slide-3">
        <div
          style={{
            height: "30vh",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img
            style={{
              height: "400%",
              transformOrigin: "top",
              transform: "scale(0.25)",
            }}
            src="/landing/mobile-lockup.svg"
          />
        </div>
      </div>
      <div id="slide-4">
        <div
          style={{
            height: "30vh",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img
            style={{
              height: "400%",
              transformOrigin: "top",
              transform: "scale(0.25)",
            }}
            src="/landing/mobile-staking.svg"
          />
        </div>
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
  </div>
);
