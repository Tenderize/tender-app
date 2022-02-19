import { Chain } from "@usedapp/core";

export type TenderizeConfig = {
  portisApiKey: string;
  chainUrlMapping: ChainUrlMapping;
  supportedChains: number[];
};

export interface ChainUrlMapping {
  [chainId: number]: string;
}
