// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {  
  livepeer: {
    faucet: "0x99e3A045Fb28E44d23e1eDBa6ED0d49F4Db38d47",
    token: "0xe80110C0a290c493C543148c5445a23D3403a096",
    controller: "0x3891FB6b6B145Ad104FE98aC6EFAFc7d8feDD63C",
    tenderToken: "0x6b903e6751e10d9F8AEa932891DED743F2F22616",
    swap: "0x132101F2F131B93cB5AaDe8b6568e431F32F64D7",
    liquidity: "0xfb852b5F27B29394d2b51062BF677C6539279807",
    farm: "0xEf078e54495cBa7A7932f1753D4A6A3b806A010D"
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
