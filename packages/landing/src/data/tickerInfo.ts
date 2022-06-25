export type TickerInfo = {
  symbol: string;
  name: string;
  issue_time: string;
  whitepaper: string;
  website: string;
  explorer_link: string;
  description: string;
  derivative: boolean;
};

export const tickerInfo: TickerInfo[] = [
  {
    symbol: "GRT",
    name: "The Graph",
    issue_time: "12-12-2020",
    whitepaper: "https://github.com/graphprotocol/research/blob/master/papers/whitepaper/the-graph-whitepaper.pdf",
    website: "https://thegraph.com/",
    explorer_link: "https://etherscan.io/token/0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    description:
      "The Graph is an indexing protocol for decentralized applications that allows developers to efficiently access blockchain data. Developers can build subgraphs that define how to ingest, index, and serve blockchain data in a verifiable way.",
    derivative: false,
  },
  {
    symbol: "tGRT",
    name: "Graph TenderToken",
    issue_time: "10-5-2022",
    whitepaper: "https://github.com/Tenderize/Whitepaper",
    website: "https://tenderize.me",
    explorer_link: "https://etherscan.io/token/0xc29f5611dcd89bc5d3a19762783d3006bc2ad2ac",
    description: "Staked token derivates (TenderTokens) for GRT (The Graph).",
    derivative: true,
  },
  {
    symbol: "LPT",
    name: "Livepeer",
    issue_time: "30-04-2018",
    whitepaper: "https://github.com/livepeer/wiki/blob/master/WHITEPAPER.md",
    website: "https://livepeer.org/",
    explorer_link: "https://etherscan.io/token/0x58b6a8a3302369daec383334672404ee733ab239",
    description:
      "Livepeer is the first live video streaming network protocol that is fully decentralized. The platform aims to become a viable blockchain-based, economically efficient alternative to centralized broadcasting solutions for all new and existing broadcaster companies.",
    derivative: false,
  },
  {
    symbol: "tLPT",
    name: "Livepeer TenderToken",
    issue_time: "09-5-2022",
    whitepaper: "https://github.com/Tenderize/Whitepaper",
    website: "https://tenderize.me",
    explorer_link: "https://arbiscan.io/token/0xfac38532829fdd744373fdcd4708ab90fa0c4078",
    description: "Staked token derivates (TenderTokens) for LPT (Livepeer).",
    derivative: true,
  },
  {
    symbol: "MATIC",
    name: "Polygon (Previously Matic)",
    issue_time: "20-04-2019",
    whitepaper: "https://github.com/maticnetwork/whitepaper",
    website: "https://polygon.technology/",
    explorer_link: "https://etherscan.io/token/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    description:
      "Polygon (previously Matic Network) is the first well-structured, easy-to-use platform for Ethereum scaling and infrastructure development. Its core component is Polygon SDK, a modular, flexible framework that supports building multiple types of applications.",
    derivative: false,
  },
  {
    symbol: "tMATIC",
    name: "Matic TenderToken",
    issue_time: "10-5-2022",
    whitepaper: "https://github.com/Tenderize/Whitepaper",
    website: "https://tenderize.me",
    explorer_link: "https://etherscan.io/token/0x2336c10a1d3100343fa9911a2c57b77c333599a3",
    description: "Staked token derivates (TenderTokens) for MATIC (Matic).",
    derivative: true,
  },
  {
    symbol: "AUDIO",
    name: "Audius",
    issue_time: "22-10-2020",
    whitepaper: "https://whitepaper.audius.co/AudiusWhitepaper.pdf",
    website: "https://audius.co/",
    explorer_link: "https://etherscan.io/token/0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998",
    description:
      "Audius is a decentralized music streaming protocol. Audius was launched to remedy the inefficiencies of the music industry, which is plagued by intransparent music rights ownership and intermediaries standing between artists and their audience.",
    derivative: false,
  },
  {
    symbol: "tAUDIO",
    name: "Audius TenderToken",
    issue_time: "24-5-2022",
    whitepaper: "https://github.com/Tenderize/Whitepaper",
    website: "https://tenderize.me",
    explorer_link: "https://etherscan.io/token/0xc83badbf764f957acc23bc9e9aac71c298b07243",
    description: "Staked token derivates (TenderTokens) for AUDIO (Audius).",
    derivative: true,
  },
];
