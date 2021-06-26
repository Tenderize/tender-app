import { FC } from "react";
import { EthAddress } from "rimble-ui";

const Account: FC<{ account: string | null | undefined }> = ({ account }) => {
  return <EthAddress style={{ marginTop: 4 }} address={account} />;
};

export default Account;
