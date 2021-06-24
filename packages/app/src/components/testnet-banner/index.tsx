import "./banner.scss";
function TestnetBanner() {
  return (
    <>
      <div style={{ background: "#FFE8B9", height: "40px" }}>
        <p className="announcement">Tenderize.me is currently only live on Rinkeby testnet.</p>
      </div>
    </>
  );
}

export default TestnetBanner;
