export type TenderizeConfig = {
  portisApiKey: string;
  chainUrlMapping: ChainUrlMapping;
  supportedChainIds: number[];
};

export interface ChainUrlMapping {
    [chainId: number]: string;
}