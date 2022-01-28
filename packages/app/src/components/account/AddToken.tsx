import { Button } from "grommet";
import { FC } from "react";

const addToken = async (address: string, symbol: string, image: string, decimals = 18) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const AddToken: FC<{ address: string; symbol: string; image: string }> = ({ address, symbol, image }) => {
  return (
    <Button
      size="small"
      onClick={async (e) => {
        e.preventDefault();
        await addToken(address, symbol, image);
      }}
      label="Add to Metamask"
    />
  );
};
