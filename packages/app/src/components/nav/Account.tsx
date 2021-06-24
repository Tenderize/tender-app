import { EthAddress } from "rimble-ui";

function Account({ account }: any) {
  return <EthAddress style={{ marginTop: 4 }} address={account} />;
}

export default Account;
