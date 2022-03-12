import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { utils } from "ethers";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Form,
  FormField,
  Text,
  TextInput,
  Heading,
} from "grommet";
import { AmountInputFooter } from "../AmountInputFooter";
import { FormClose, FormSubtract } from "grommet-icons";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useBalanceValidation } from "utils/inputValidation";
import { useContractFunction } from "@usedapp/core";
import { isPendingTransaction } from "utils/transactions";
import { weiToEthWithDecimals } from "utils/amountFormat";

type Props = {
  protocolName: string;
  symbol: string;
  stake: string;
};

const Unfarm: FC<Props> = ({ protocolName, symbol, stake }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [unfarmInput, setUnfarmInput] = useState("");
  const handleUnfarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setUnfarmInput(val);
  };

  const maxUnfarm = () => {
    setUnfarmInput(utils.formatEther(stake.toString() || "0"));
  };

  const { state: unfarmTx, send: unfarm } = useContractFunction(contracts[protocolName].tenderFarm, "unfarm", {
    transactionName: `Unfarm ${symbol}`,
  });
  const unfarmLpTokens = async (e: any) => {
    e.preventDefault();
    await unfarm(utils.parseEther(unfarmInput || "0"));
    setUnfarmInput("");
  };

  const { validationMessage } = useBalanceValidation(unfarmInput, stake);

  return (
    <>
      <Button
        primary
        reverse
        icon={<FormSubtract color="white" />}
        onClick={handleShow}
        label="Unfarm"
        disabled={stake.toString() === "0"}
      />
      {show && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Card
            flex={false}
            style={{ position: "relative" }}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="large"
          >
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Unfarm ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                <Form style={{ width: "100%" }}>
                  <FormField label="Unfarm Amount">
                    <TextInput
                      value={unfarmInput}
                      onChange={handleUnfarmInputChange}
                      type="number"
                      placeholder={"0"}
                      icon={
                        <Box pad="xsmall" direction="row" align="center" gap="small">
                          <Text>{symbol}</Text>
                        </Box>
                      }
                      style={{ textAlign: "right", padding: "20px 50px" }}
                    />
                    <Text color="red">{validationMessage}</Text>
                    <AmountInputFooter
                      label={`Current Stake: ${weiToEthWithDecimals(stake?.toString() || "0", 6)} ${symbol}`}
                      onClick={maxUnfarm}
                    />
                  </FormField>
                </Form>
              </Box>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ vertical: "medium" }}>
              <Box direction="row" style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                <Button style={{ width: "100%" }} primary onClick={handleClose} label="Cancel" />
                <Button
                  style={{ width: "100%" }}
                  secondary
                  disabled={!unfarmInput || unfarmInput.toString() === "0" || isPendingTransaction(unfarmTx)}
                  onClick={unfarmLpTokens}
                  label={isPendingTransaction(unfarmTx) ? <LoadingButtonContent label="Unfarming..." /> : "Unfarm"}
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Unfarm;
