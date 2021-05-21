import {contracts, addresses} from "@tender/contracts"
import {useContractFunction} from "@usedapp/core"
import {BigNumber, BigNumberish, utils, constants} from "ethers"
import { useState} from "react";
import { Button, Input } from "rimble-ui";
import { Form } from "react-bootstrap";

type WithdrawInputs = {
    name: string,
    symbol: string,
    tenderBalance: BigNumberish,
    tenderAllowance: BigNumberish
}
export default function Withdraw({name, symbol, tenderBalance, tenderAllowance}:WithdrawInputs) {

    const [withdrawInput, setWithdrawInput] = useState("")

    const maxWithdraw = () => {
        setWithdrawInput(utils.formatEther(tenderBalance.toString()))
    }

    const handleInputChange = (e:any) => {
        const val = e.target.value
        if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
        setWithdrawInput(val)
    }

    const { state: withdrawTx, send: swap } = useContractFunction(contracts[name].swap, 'swapExactAmountIn')

    const withdrawTokens = (e:any) => {
        e.preventDefault()    
        swap(
            addresses[name].tenderToken,
            utils.parseEther(withdrawInput || "0"),
            addresses[name].token,
            constants.One,
            utils.parseEther("2")
            )
        console.log(withdrawTx)
    }
    
    const {state: approveTx, send: approve } = useContractFunction(contracts[name].tenderToken, 'approve')

    const approveTokens = (e:any) => {
        e.preventDefault()
        approve(addresses[name].swap, utils.parseEther(withdrawInput || "0").sub(tenderAllowance.toString()))
        console.log(approveTx)
    }

    return(
        <>
            <Form>
                <Form.Group controlId="formWithdraw">
                    <Form.Label>Withdraw Amount</Form.Label>
                      <Input
                        width={1}
                        value={withdrawInput}
                        onChange={handleInputChange}
                        type="text"
                        placeholder={`0 tender${symbol}`}
                        className="amount"
                      />
                      <Form.Text className="balance" onClick={maxWithdraw}>
                        Current Balance: {`${utils.formatEther(tenderBalance?.toString() || "0")} tender${symbol}`}
                      </Form.Text>
                    </Form.Group>

                    {
                        !withdrawInput || BigNumber.from(tenderAllowance).gte(utils.parseEther(withdrawInput || "0")) ? 
                            <Button
                            disabled={!withdrawInput || withdrawInput.toString() === "0"}
                            style={{ width: "100%" }}
                            onClick={withdrawTokens}
                        >
                            {"Withdraw"}
                        </Button>
                        :
                        <Button
                            disabled={!withdrawInput || withdrawInput.toString() === "0"}
                            style={{ width: "100%" }}
                            onClick={approveTokens}
                        >
                            {"Approve"}
                        </Button>
                    }
            </Form>
        </>
    )
}