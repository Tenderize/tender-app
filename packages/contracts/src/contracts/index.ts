import { utils, Contract } from "ethers";
import { addresses } from "../addresses";
import { abis } from "../abis";
import { ERC20, Faucet, LiquidityPoolToken, TenderFarm, Tenderizer, TenderSwap } from "../../gen/types";

const projects = Object.keys(addresses);

type ProtocolContracts = {
  faucet: Faucet;
  token: ERC20;
  tenderizer: Tenderizer;
  tenderToken: ERC20;
  tenderSwap: TenderSwap;
  lpToken: LiquidityPoolToken;
  tenderFarm: TenderFarm;
};

export const contracts: Record<string, ProtocolContracts> = {};

for (const project of projects) {
  const obj: ProtocolContracts = {} as ProtocolContracts;

  const deps = Object.keys(addresses[project]);

  for (const dep of deps) {
    // @ts-ignore
    obj[dep] = new Contract(addresses[project][dep], new utils.Interface(abis[dep]));
  }

  contracts[project] = obj;
}
