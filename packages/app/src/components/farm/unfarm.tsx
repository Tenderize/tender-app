import { FC, useState } from "react";
// import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Form,
  FormField,
  TextInput,
  Spinner,
  Text,
} from "grommet";

type Props = {
  name: string;
  symbol: string;
  stake: BigNumberish;
};

const Unfarm: FC<Props> = ({ name, symbol, stake }) => {
  // Component state & helpers

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
    console.log(stake);
    setUnfarmInput(utils.formatEther(stake.toString() || "0"));
  };

  // Contract Functions

  const { state: unfarmTx, send: unfarm } = useContractFunction(contracts[name].farm, "unfarm", {
    transactionName: `Unfarm ${symbol}`,
  });
  const unfarmLpTokens = async (e: any) => {
    e.preventDefault();
    await unfarm(utils.parseEther(unfarmInput || "0"));
    setUnfarmInput("");
  };

  return (
    <>
      <Button fill="horizontal" primary onClick={handleShow} label="Unfarm" />
      {show && (
        <Layer animation="fadeIn" onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
          <Card>
            <CardHeader>{`Unfarm ${symbol}`}</CardHeader>
            <CardBody>
              <Form>
                <FormField label="Unfarm Amount" controlId="unfarmLpTokens">
                  <TextInput
                    width={1}
                    value={unfarmInput}
                    onChange={handleUnfarmInputChange}
                    type="text"
                    placeholder={"0 " + symbol}
                    className="amount"
                  />
                  <Text className="balance" onClick={maxUnfarm}>
                    Current Stake {`${utils.formatEther(stake?.toString() || "0")} ${symbol}`}
                  </Text>
                </FormField>
              </Form>
            </CardBody>
            <CardFooter>
              <Button primary onClick={handleClose}>
                Cancel
              </Button>

              <Button
                secondary
                disabled={!unfarmInput || unfarmInput.toString() === "0" || unfarmTx.status === "Mining"}
                onClick={unfarmLpTokens}
              >
                {unfarmTx.status === "Mining" ? (
                  <Box direction="row">
                    <Spinner color="white" />
                    Unfarming...
                  </Box>
                ) : (
                  "Unfarm"
                )}
              </Button>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Unfarm;
