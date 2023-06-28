export type TenderizeConfig = {
  portisApiKey: string;
  chainUrlMapping: ChainUrlMapping;
  supportedChains: number[];
  subgraphEndpoints: Endpoints;
};

export interface ChainUrlMapping {
  [chainId: number]: string;
}

export interface Endpoints {
  [chainId: string]: string;
}
