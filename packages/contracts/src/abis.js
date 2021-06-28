import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import Faucet from "./abis/Faucet.json"
import Controller from "./abis/Controller.json"
import TenderToken from "./abis/TenderToken.json"
import Swap from "./abis/Swap.json"
import TenderFarm from "./abis/TenderFarm.json"
import Esp from "./abis/ESP.json"

const abis = {
  token: erc20Abi,
  ownable: ownableAbi,
  faucet: Faucet,
  controller: Controller,
  tenderToken: TenderToken,
  swap: Swap,
  liquidity: Esp,
  farm: TenderFarm
};

export default abis;
