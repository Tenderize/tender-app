import { FC, useState } from "react";
import { Avatar, Button } from "grommet";
import { ChainId, DEFAULT_SUPPORTED_CHAINS, getChainName } from "@usedapp/core";
import { networkAvatar } from "./helpers";

export const addNetwork = async (chainId: number) => {
  let isNetworkAdded = false;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    isNetworkAdded = true;
  } catch (error: any) {
    if (error.code === 4902 && chainId === ChainId.ArbitrumRinkeby) {
      const chainName = DEFAULT_SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId)?.chainName;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: chainName,
            rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
            blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
            nativeCurrency: {
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    }
  }

  return isNetworkAdded;
};

export const SwitchNetwork: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);

  if (isNetworkAdded) {
    return null;
  }
  return (
    <Button
      secondary
      onClick={async (e) => {
        e.preventDefault();
        const isAdded = await addNetwork(chainId);
        setIsNetworkAdded(isAdded);
      }}
      icon={<Avatar size="medium" src={networkAvatar(chainId)} />}
      label={`Switch to ${getChainName(chainId)}`}
    />
  );
};
