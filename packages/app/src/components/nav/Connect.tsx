import { FC } from "react";
import { Button } from "rimble-ui";

type Props = {
  activateBrowserWallet: () => void;
};

const Connect: FC<Props> = ({ activateBrowserWallet }) => {
  return (
    <Button.Outline
      mt={1}
      mainColor="#4E66DE"
      onClick={activateBrowserWallet}
      style={{ zIndex: 99, background: "white" }}
    >
      Connect Wallet
    </Button.Outline>
  );
};

export default Connect;
