import { Card, Button, Text } from "rimble-ui";

import {contracts} from "@tender/contracts"

import {useContractFunction} from "@usedapp/core"

function Faucet({symbol, name}: any) {

    console.log("name", contracts[name])
   const { state, send } = useContractFunction(contracts[name].faucet, 'request')

   const requestTokens = () => {
       send()
   }
    return(
        <>
         <Card>
                <Text required="">{`Get some testnet ${symbol} and ETH (you need ETH to get LPT)`}</Text>
                <Button onClick={requestTokens}>{`Get ${symbol}`}</Button>
                <a href="https://faucet.metamask.io/" target="_blank"><Button>Get Eth</Button></a>
        </Card>
        </>
    )
}

export default Faucet