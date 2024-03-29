import ERC20 from "./abis/ERC20.json";
import Ownable from "./abis/ownable.json";
import Faucet from "./abis/Faucet.json";
import Tenderizer from "./abis/Tenderizer.json";
import TenderToken from "./abis/TenderToken.json";
import TenderSwap from "./abis/TenderSwap.json";
import TenderFarm from "./abis/TenderFarm.json";

export const abis = {
  token: ERC20,
  ownable: Ownable,
  faucet: Faucet,
  tenderizer: Tenderizer,
  tenderToken: TenderToken,
  tenderSwap: TenderSwap,
  lpToken: ERC20,
  tenderFarm: TenderFarm,
};
