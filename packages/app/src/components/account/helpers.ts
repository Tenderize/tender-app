import { Web3Provider } from "@ethersproject/providers";

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
