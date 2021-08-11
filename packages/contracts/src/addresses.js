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
    faucet: "0xA483C19287c94D673d0Db75E62c5483A4C6237EC",
    token: "0x11B8424923f4B3a1Ccb58D809F9C54Eff4263F22",
    controller: "0xbBD5dD37AB91161a1e4cA3475183C60D7D0cdA3C",
    tenderToken: "0xF4988b9ACfab729aF7cE6d96f4CA14bbF66B8e09",
    swap: "0x2d12A60a2029Ce0A93ce3F9b215eb1b770814686",
    liquidity: "0xc9E5f046716Edcb54c8BdA694b7D2fDCE4F0b372",
    farm: "0xa61c64F06AB7b6C1dcFe58c3EB60BE01a66AcEE1"
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
