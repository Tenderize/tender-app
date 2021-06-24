import "./hammersteak.scss";

const hammer = require("../../images/hammer.svg");
const meat = require("../../images/meat.svg");

export default function HammerSteak() {
  return (
    <div className="wrapper">
      <img id="meat" width="150" src={meat.default} alt="logo" />

      <img id="hammer" width="190" src={hammer.default} alt="logo" />
    </div>
  );
}
