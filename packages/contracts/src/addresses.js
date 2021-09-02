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
    faucet: "0x720EF0180E50668D42e5F92a5Ec137E8b6C055Dd",
    token: "0x083d006007d65f86e81373a1f8a1972141e63ce2",
    controller: "0x31BE723bC769308BeB45DbBCA1832A335e8B5fa8",
    tenderToken: "0x31caC38113B1f0F5BDf4a8fdC09B2eDA1979c35B",
    swap: "0xb5a8d92af3537fa95d125c6bf91a84cf9ca6fd91",
    liquidity: "0xf56497CC1489C50840314EE479cE705d25c4235b",
    farm: "0x089D0bB23ca09ea31944e535C02423EF0D1ffA95"
  },
  matic: {
    faucet: "0x754Ab83a304e0Cba50FfC18E8F83AB19cAdF5f87",
    token: "0x0e6C08D9e15C60941722fF9699463Bf1d098f5DF",
    controller: "0x35920D2eA5a146Ca68C16Fe72FEbaBdC3007a11C",
    tenderToken: "0x06Df3C8cB28eA12e32B5Fe92F3cCc3EBC650cf58",
    swap: "0xa56aA9cC6b0Fc28753ceD7ff33f2c70b2cBdb414",
    liquidity: "0xCA44830efBE2956EE1aA45fe3e63be93A3c8e5f4",
    farm: "0xbDdF12D848308B2d0ce1b881c44C5471e6299121"
  },
  audius: {
    faucet: "0x3591fB0F398747e0d7ffe4DD710c37ba717B5b77",
    token: "0x10670D97328858BF432251F017A8Aa8ec66355E5",
    controller: "0x5a73f8AF889dDbc07ff6Ac60b691188bd5D1e6c4",
    tenderToken: "0xF53B5B5602c248ebd810295C96c2a89Eb327726E",
    swap: "0xC4722fcE3eC7E9341aFfad43228Cd09861b6dBB6",
    liquidity: "0xc92948D7F989C133D74332925ba9D42E352D8Af0",
    farm: "0xcFc6D458401212C87cEf2c6024505DaE5d51c8DC"
  }
};

export default addresses;
