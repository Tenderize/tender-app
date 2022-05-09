export type ProtocolAddresses = {
  faucet: string;
  token: string;
  tenderizer: string;
  tenderToken: string;
  tenderSwap: string;
  lpToken: string;
  tenderFarm: string;
};

export const isProduction = () => {
  return process.env.NEXT_PUBLIC_BUILD_ENV === "prod" ? true : false;
};

const getAddress = (main: string, test: string) => {
  return isProduction() ? main : test;
};

export const addresses: Record<string, ProtocolAddresses> = {
  livepeer: {
    faucet: getAddress("0xD21B8eF6F50eB3468E8bc4Bf8875D6bF2106f68e", "0xD21B8eF6F50eB3468E8bc4Bf8875D6bF2106f68e"),
    token: getAddress("0x289ba1701C2F088cf0faf8B3705246331cB8A839", "0xf26B5f9CAd0111450Bc3E98c66A144eE49C0a85E"),
    tenderizer: getAddress("0x339efC059C6D4Aa50a41F8246a017B57Aa477b60", "0x818AcBFA2BCD0f97d462c62724cE74D0949Be002"),
    tenderToken: getAddress("0xfaC38532829fDD744373fdcd4708Ab90fA0c4078", "0x11a9c6e3C6259ab81F2c80BC665134C6fCc341c6"),
    tenderSwap: getAddress("0x2429fC7082eb517C14946b392b195B181D0b9781", "0xFf666DA93FA2d23A8f108C7e26E3102Dc0E2876C"),
    lpToken: getAddress("0x6cAbc6e78c1D632b6210EaB71c19889b92376931", "0x28dA592CC5e6f5f69B2e9652d0b6998D4376297E"),
    tenderFarm: getAddress("0x3FE01e8b62a8E17F296Eb3832504C3D3A49f2209", "0x45627ea9e44195e310c9016658dce665bfa4c577"),
  },
  graph: {
    faucet: getAddress("0x3f25C4669d08516CDeB183C4e02726eBF81a1A17", "0x3f25C4669d08516CDeB183C4e02726eBF81a1A17"),
    token: getAddress("0x53466090C5bfba99B147aB0c43E212e6E8a3Fb90", "0x53466090C5bfba99B147aB0c43E212e6E8a3Fb90"),
    tenderizer: getAddress("0xd76D6107AdD240e619aCfE7503f6F93413E072E7", "0xd76D6107AdD240e619aCfE7503f6F93413E072E7"),
    tenderToken: getAddress("0xBc2EB1EEa4221F8Ce242C0A46E0B16944cd7788F", "0xBc2EB1EEa4221F8Ce242C0A46E0B16944cd7788F"),
    tenderSwap: getAddress("0xCb8979852ef7Ae339BFDBD08D26cE8396f3c5Dc4", "0xCb8979852ef7Ae339BFDBD08D26cE8396f3c5Dc4"),
    lpToken: getAddress("0x8CfA4082dB29D2Af5acFeDA395f31e7ebBfc93e3", "0x8CfA4082dB29D2Af5acFeDA395f31e7ebBfc93e3"),
    tenderFarm: getAddress("0x97338956D9C0eC11205Bf02A7Ed9e66F20E3daEd", "0x97338956D9C0eC11205Bf02A7Ed9e66F20E3daEd"),
  },
  matic: {
    faucet: getAddress("0xC9563Ba7a194D8C132Fec90F3723bA62BCcDc29c", "0xC9563Ba7a194D8C132Fec90F3723bA62BCcDc29c"),
    token: getAddress("0xb7e2860E2217b688eD476cCbD54B0fEbdB07ff5f", "0xb7e2860E2217b688eD476cCbD54B0fEbdB07ff5f"),
    tenderizer: getAddress("0xbC5E73D2beBC02807b502F3997416Feb7f410c43", "0xbC5E73D2beBC02807b502F3997416Feb7f410c43"),
    tenderToken: getAddress("0x6371Cd90Be577Bd5DF33a353272f180041679893", "0x6371Cd90Be577Bd5DF33a353272f180041679893"),
    tenderSwap: getAddress("0xCa5fe3d3E5B2a70E94555B9f77C6Ac0Ba37dE12B", "0xCa5fe3d3E5B2a70E94555B9f77C6Ac0Ba37dE12B"),
    lpToken: getAddress("0xDb5118b1f1B57d964Dd87aBeCcD4ae6108a0252E", "0xDb5118b1f1B57d964Dd87aBeCcD4ae6108a0252E"),
    tenderFarm: getAddress("0xadBa05060D7Fc92d92A0903CFAE55ad90DCF3a6e", "0xadBa05060D7Fc92d92A0903CFAE55ad90DCF3a6e"),
  },
  audius: {
    faucet: getAddress("0x51feC8FD527AaA9A18aCB7d8Bc32bF5483938549", "0x51feC8FD527AaA9A18aCB7d8Bc32bF5483938549"),
    token: getAddress("0x17c9de691e8CA85Fde2481E404bfe90ca29B3156", "0x17c9de691e8CA85Fde2481E404bfe90ca29B3156"),
    tenderizer: getAddress("0x6e01AFcCdE83F235855cf7b9DB48144F0c00B043", "0x6e01AFcCdE83F235855cf7b9DB48144F0c00B043"),
    tenderToken: getAddress("0xAe88e2893E10699FdA8a619939709999A71b45Ab", "0xAe88e2893E10699FdA8a619939709999A71b45Ab"),
    tenderSwap: getAddress("0x8dA383a947A062fd242c813a0dCc800139db481C", "0x8dA383a947A062fd242c813a0dCc800139db481C"),
    lpToken: getAddress("0xa46594B081C0D3f4B66B74a9B6C06F01d9851c0D", "0xa46594B081C0D3f4B66B74a9B6C06F01d9851c0D"),
    tenderFarm: getAddress("0xD35AE3ABdC7ec0207C02b8c80cf5eecF0D883ad8", "0xD35AE3ABdC7ec0207C02b8c80cf5eecF0D883ad8"),
  },
};
