import { utils, Contract } from 'ethers'
import addresses from "../addresses"
import abis from "../abis"

const projects = Object.keys(addresses)

const contracts = {}

for (const project of projects) {
    const obj = {}

    const deps = Object.keys(addresses[project])

    for (const dep of deps) {
        obj[dep] = new Contract(addresses[project][dep], new utils.Interface(abis[dep]))
    }

    contracts[project] = obj
}

export default contracts