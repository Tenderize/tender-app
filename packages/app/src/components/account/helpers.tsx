import { ChainId } from "@usedapp/core";

export const networkAvatar = (chain: ChainId | undefined) => {
  switch (chain) {
    case ChainId.Arbitrum:
      return "/arbitrum.svg";
    case ChainId.ArbitrumRinkeby:
      return "/arbitrum.svg";
    case ChainId.Rinkeby:
      return "/ethereum.png";
    case ChainId.Mainnet:
      return "/ethereum.png";
    default:
      return "";
  }
};
