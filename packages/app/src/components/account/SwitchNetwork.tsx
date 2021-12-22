import { FC, useState } from "react";
import { Button } from "grommet";

export const addNetwork = async () => {
  let isNetworkAdded = false;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x4" }],
  });
  isNetworkAdded = true;

  return isNetworkAdded;
};

export const SwitchNetwork: FC = () => {
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);

  if (isNetworkAdded) {
    return null;
  }
  return (
    <Button
      onClick={async (e) => {
        e.preventDefault();
        const isAdded = await addNetwork();
        setIsNetworkAdded(isAdded);
      }}
      label="Switch to Rinkeby"
    />
  );
};
