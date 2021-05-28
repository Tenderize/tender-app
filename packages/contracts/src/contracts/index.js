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

const graph = {
    faucet: new Contract(addresses.graph.faucet, new utils.Interface(abis.graph.faucet)),
    token: new Contract(addresses.graph.token, new utils.Interface(abis.erc20)),
    controller: new Contract(addresses.graph.controller, new utils.Interface(abis.graph.controller)),
    tenderToken: new Contract(addresses.graph.tenderToken, new utils.Interface(abis.graph.tenderToken)),
    swap: new Contract(addresses.graph.swap, new utils.Interface(abis.graph.swap))
}

const matic = {
    faucet: new Contract(addresses.matic.faucet, new utils.Interface(abis.matic.faucet)),
    token: new Contract(addresses.matic.token, new utils.Interface(abis.erc20)),
    controller: new Contract(addresses.matic.controller, new utils.Interface(abis.matic.controller)),
    tenderToken: new Contract(addresses.matic.tenderToken, new utils.Interface(abis.matic.tenderToken)),
    swap: new Contract(addresses.matic.swap, new utils.Interface(abis.matic.swap))
}

export default {
    livepeer,
    graph,
    matic
}