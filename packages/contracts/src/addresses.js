// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  ceaErc20: "0xc1C0472c0C80bCcDC7F5D01A376Bd97a734B8815",
  livepeer: {
    faucet: "0x642c3632e58C8cddF4dc3BC920d2E78c26983c90",
    token: "0x54419A2FB28458cf4A708811c78A8ae707a39caa",
    controller: "0xFdF9A8ce8A898Ae5e21855C665d8843c48FD55A6",
    tenderToken: "0x4F39d823fA1DfF3C2Ad87BC852030eFE4fF3c024",
    swap: "0x5eeccC30C735DBf5E55eAAb8ADb139E94B1Ae42e"
  },
  graph: {
    faucet: "0xa10b8eea1df22268b244129a52ef0d600c29836b",
    token: "0x01Ff66079bB4FAF4954913B6ec2bC093677bF29e",
    controller: "0xB0D6BB4A43aF1dE66d728D582703C25927b896e3",
    tenderToken: "0x486Fa89F158f511B59969f43C450a1165B5b5B98",
    swap: "0x9F90Eac4b7f71f319382306e4D24773A6e0c325D"
  }
};

export default addresses;
