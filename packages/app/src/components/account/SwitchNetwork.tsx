import { FC, useState } from "react";
import { Button } from "grommet";
import { ChainId, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";

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
              symbol: "ARETH",
              decimals: 18,
            },
          },
        ],
      });
    }
  }

  return isNetworkAdded;
};

export const SwitchNetwork: FC = () => {
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);

  if (isNetworkAdded) {
    return null;
  }
  return (
    <Button
      size="small"
      style={{ color: "gray", borderColor: "gray", borderWidth: 1 }}
      onClick={async (e) => {
        e.preventDefault();
        const isAdded = await addNetwork(ChainId.Rinkeby);
        setIsNetworkAdded(isAdded);
      }}
      label="Switch to Rinkeby"
    />
  );
};
