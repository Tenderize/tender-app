import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import LivepeerTokenFaucet from "./abis/LivepeerTokenFaucet.json"
const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  livepeer: {
    faucet: LivepeerTokenFaucet
  }
};

export default abis;
