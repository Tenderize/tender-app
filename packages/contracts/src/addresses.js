// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  livepeer: {
    faucet: "0x441a02aD16141E6cd65922f10787B38a5b238f4f",
    token: "0x90db03fc9F6a903460761465Fc3a0D4c8d67F84e",
    controller: "0xbB477F437c1Cd6d351b9652C17294A79d4DA801E",
    tenderToken: "0x30d76E48e1DfD6b90D11a0a224c8220E604890DE",
    swap: "0xd30C9cc981BCcAd162b760c595ee4Ab48B6D0265",
    liquidity: "0x167D3c9E98c27Ab6402546FDd7363Dd26cd1CF58",
    farm: "0xdf2Ec6a4F34ecE5aFd343802AE4df140f6B9E51C"
  },
  graph: {
    faucet: "0xa10b8eea1df22268b244129a52ef0d600c29836b",
    token: "0x01Ff66079bB4FAF4954913B6ec2bC093677bF29e",
    controller: "0xB0D6BB4A43aF1dE66d728D582703C25927b896e3",
    tenderToken: "0x486Fa89F158f511B59969f43C450a1165B5b5B98",
    swap: "0x9F90Eac4b7f71f319382306e4D24773A6e0c325D"
  },
  matic: {
    faucet: "0xdA0545D5732e8Bdc01231d4bb54F3B50C5A63c72",
    token: "0x0317C8e36e1cb3434bb9C8DF0AF5041910D1bE11",
    controller: "0xd7bDE8310D9Dc99bEcdaa7B30b4D0752d10DA0F5",
    tenderToken: "0x37200F651d0CB9Ae012f93774f8EcC13e61781ad",
    swap: "0x95d0828775772d0087ddEDf5e072b4E1e1A63f6C",
  }
};

export default addresses;
