import { FC, useState } from "react";
import { Button, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src";

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
    <SwitchButton
      color="light-2"
      style={{ color: normalizeColor("brand", theme) }}
      onClick={async (e) => {
        e.preventDefault();
        const isAdded = await addNetwork();
        setIsNetworkAdded(isAdded);
      }}
      label="Switch to Rinkeby"
    />
  );
};

const SwitchButton = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
`;
