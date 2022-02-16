import { Web3Provider } from "@ethersproject/providers";
import { DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";

export const fetchNetworkName = async (
  library: Web3Provider | undefined,
  setNetworkName?: (networkName: string) => void
) => {
  const network = await library?.getNetwork();
  let nameToSet = "";
  if (network?.name === "homestead") {
    nameToSet = "Ethereum";
  } else if (network?.name != null) {
    const [initial, ...rest] = network.name;
    nameToSet = [initial.toUpperCase(), ...rest].join("");
  }
  setNetworkName?.(nameToSet);
  return nameToSet;
};

export const chainIdToNetworkName = (chainId: number) => {
  return DEFAULT_SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId)?.chainName;
};
