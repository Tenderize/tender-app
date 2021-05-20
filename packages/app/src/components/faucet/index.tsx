import { Card, Button, Text } from "rimble-ui";

function Faucet({symbol}: any) {
    return(
        <>
         <Card>
                <Text required="">{`Get some testnet ${symbol}`}</Text>
                <Button>{`Get ${symbol}`}</Button>
        </Card>
        </>
    )
}

export default Faucet