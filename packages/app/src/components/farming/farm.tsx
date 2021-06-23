import {contracts, addresses} from "@tender/contracts"
import {useContractFunction, useContractCall} from "@usedapp/core"
import {utils} from "ethers"

import { useState } from "react";

export function YieldFarm({name}:any) {

    const [farmInput, setFarmInput] = useState("")

    const {state: approveTx, send: approve} = useContractFunction(
        contracts[name].swap, 'approve', {transactionName: `Approve LP tokens`}
    )

    const approveLPTokens = (e: any) => {
        e.preventDefault()
        approve(addresses[name].farm, utils.parseEther(farmInput || "0"))
    }

    const {state: farmTx, send: farm} = useContractFunction(
        contracts[name].farm, 'farm', {transactionName: `Farm ${name}`}
    )

    const farmLPTokens = (e: any) => {
        e.preventDefault()
        farm(utils.parseEther(farmInput) || "0" )
    }

    const [stakeOf]:any = useContractCall(
        {
            abi: contracts[name].farm,
            address: addresses[name].farm,
            method: 'farm',
            args: [""]
        }
    )

    console.log(stakeOf)

    return (
    <>

    </>
    )
}