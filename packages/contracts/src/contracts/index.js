import { utils, Contract } from 'ethers'
import addresses from "../addresses"
import abis from "../abis"

const livepeer = {
    faucet: new Contract(addresses.livepeer.faucet, new utils.Interface(abis.livepeer.faucet)),
    token: new Contract(addresses.livepeer.token, new utils.Interface(abis.erc20)),
    controller: new Contract(addresses.livepeer.controller, new utils.Interface(abis.livepeer.controller)),
    tenderToken: new Contract(addresses.livepeer.tenderToken, new utils.Interface(abis.livepeer.tenderToken)),
    swap: new Contract(addresses.livepeer.swap, new utils.Interface(abis.livepeer.swap))
}

export default {
    livepeer
}