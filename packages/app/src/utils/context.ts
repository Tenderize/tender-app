import { useEthers } from "@usedapp/core";
import { stakers } from "@tender/shared/src/index";
import { ProtocolName } from "@tender/shared/src/data/stakers";

export const useIsGnosisSafe = () => {
  const { library } = useEthers();
  const lib: any = library;
  // Usedapp uses JsonRpcProvider type from ethersjs which is unaware of the "provider" property.
  // In reality the returned value can be of other types as well under the hood.
  // Therefore we overwrite the type so we can check whether the provider has the 'safe' property
  // indicating that we are in a gnosis safe context
  return lib != null && lib.provider != null && lib.provider.safe != null;
};

export function hasPermit(protocol: ProtocolName): boolean {
  return stakers[protocol].hasPermit;
}
