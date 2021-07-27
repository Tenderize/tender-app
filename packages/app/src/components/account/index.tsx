import { FC, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Button } from "grommet";
import styled from "styled-components";

import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "../../theme";

export const AccountButton: FC = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const ens = useLookupAddress();
  const [showModal, setShowModal] = useState(false);

  const [activateError, setActivateError] = useState("");
  const { error } = useEthers();
  useEffect(() => {
    if (error) {
      setActivateError(error.message);
    }
  }, [error]);

  const activate = async () => {
    setActivateError("");
    activateBrowserWallet();
  };

  return (
    <Account>
      <ErrorWrapper>{activateError}</ErrorWrapper>
      <AccountModal showModal={showModal} setShowModal={setShowModal} />
      {account ? (
        <>
          <AccountLabel
            primary
            color="light-2"
            style={{ color: "#4E66DE" }}
            onClick={() => setShowModal(!showModal)}
            label={ens ?? shortenAddress(account)}
          />
          <Button onClick={() => deactivate()} label="Disconnect" />
        </>
      ) : (
        <Button
          primary
          color="light-2"
          style={{ color: normalizeColor("brand", theme) }}
          onClick={activate}
          label="Connect"
        />
      )}
    </Account>
  );
};

const ErrorWrapper = styled.div`
  color: #ff3960;
  margin-right: 40px;
  margin-left: 40px;
  overflow: auto;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
`;

const AccountLabel = styled(Button)`
  margin-right: -20px;
  padding-right: 40px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
