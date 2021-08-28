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
    faucet: "0x754Ab83a304e0Cba50FfC18E8F83AB19cAdF5f87",
    token: "0x0e6C08D9e15C60941722fF9699463Bf1d098f5DF",
    controller: "0x35920D2eA5a146Ca68C16Fe72FEbaBdC3007a11C",
    tenderToken: "0x06Df3C8cB28eA12e32B5Fe92F3cCc3EBC650cf58",
    swap: "0xa56aA9cC6b0Fc28753ceD7ff33f2c70b2cBdb414",
    liquidity: "0xCA44830efBE2956EE1aA45fe3e63be93A3c8e5f4",
    farm: "0xbDdF12D848308B2d0ce1b881c44C5471e6299121"
  }
};

export default addresses;
