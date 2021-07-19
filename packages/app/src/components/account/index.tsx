import { FC, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Button } from "grommet";
import styled from "styled-components";

import { AccountModal } from "./AccountModal";

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
      {showModal && <AccountModal setShowModal={setShowModal} />}
      {account ? (
        <>
          <AccountLabel onClick={() => setShowModal(!showModal)}>{ens ?? shortenAddress(account)}</AccountLabel>
          <LoginButton onClick={() => deactivate()}>Disconnect</LoginButton>
        </>
      ) : (
        <LoginButton onClick={activate}>Connect</LoginButton>
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

const LoginButton = styled(Button)``;

const AccountLabel = styled(Button)`
  height: 32px;
  margin-right: -40px;
  padding-right: 40px;
  padding-left: 8px;
  font-size: 12px;
`;
