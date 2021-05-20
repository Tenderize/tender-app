import { utils, Contract } from 'ethers'
import addresses from "../addresses"
import abis from "../abis"

const livepeer = {
    faucet: new Contract(addresses.livepeer.faucet, new utils.Interface(abis.livepeer.faucet)),
    token: new Contract(addresses.livepeer.token, new utils.Interface(abis.erc20))
}

export default {
    livepeer
}