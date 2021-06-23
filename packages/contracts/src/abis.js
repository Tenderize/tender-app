import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import Faucet from "./abis/Faucet.json"
import Controller from "./abis/Controller.json"
import TenderToken from "./abis/TenderToken.json"
import Swap from "./abis/Swap.json"
import TenderFarm from "./abis/TenderFarm.json"

const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  livepeer: {
    faucet: Faucet,
    controller: Controller,
    tenderToken: TenderToken,
    swap: Swap,
    farm: TenderFarm,
  },
  graph: {
    faucet: Faucet,
    controller: Controller,
    tenderToken: TenderToken,
    swap: Swap,
    farm: TenderFarm,
  },
  matic: {
    faucet: Faucet,
    controller: Controller,
    tenderToken: TenderToken,
    swap: Swap,
    farm: TenderFarm,
  }
};

export default abis;
