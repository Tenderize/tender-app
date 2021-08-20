// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  livepeer: {
    faucet: "0x648E6AEc099ca299ee70132299aA1349D4e48adE",
    token: "0x0B0f3B15ba9De2cb9186026014A6aA83E4A6E0Fa",
    controller: "0x755549d2AB24C40D22E9f83B901dd301f2DD341D",
    tenderToken: "0xEdabd9D0D1eAD6cf75bA903D9dfFF3E02A436d42",
    swap: "0xeBBcD45CF9Ff364B0e4D62a27D1D0A2F13430DC8",
    liquidity: "0x77B5CfBb269f3927Bb3e3Ca93689a092339a8AEa",
    farm: "0xea1ED77f083e04087d7909AD3ca682FD44974098"
  },
  graph: {
    faucet: "0xAC91733AB2484F1b2Ea8dF53fF090dFAD4f3BAB7",
    token: "0x7F63C78456D836B9C385932c3A9A8678c4FD9960",
    controller: "0xe9B0746d8B53cac2c06F2C2651D10B40c6aECc3A",
    tenderToken: "0x122E5FCA96773AdC3D40159F719f93B7120CE0df",
    swap: "0xa3190bef00e1BEd0774e78CFafaae62602039BF2",
    liquidity: "0xa2d83a0e81F2d0B62f987198CE003511c81512dd",
    farm: "0xE687e96966fB38729e50a2C01451B60F76Fdf528"
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
