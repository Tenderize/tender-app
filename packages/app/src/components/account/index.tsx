import { FC, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Button } from "grommet";
import { Button as SecondaryButton} from "../base"
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
      <AccountModal showModal={showModal} setShowModal={setShowModal} />
      {account ? (
        <>
          <AccountLabel primary color="light-2" style={{color: "#4E66DE"}} onClick={() => setShowModal(!showModal)} label={ens ?? shortenAddress(account)} />
          <Button secondary color="light-2" onClick={() => deactivate()} label="Disconnect" />
        </>
      ) : (
        <LoginButton primary color="light-2" style={{color: "#4E66DE"}} onClick={activate} label="Connect" />
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

const LoginButton = styled(SecondaryButton)``;

const AccountLabel = styled(SecondaryButton)`
  margin-right: -20px;
  padding-right: 40px;
  padding-left: 8px;
  display:flex;
  align-items:center;
  justify-content:center;
`;
