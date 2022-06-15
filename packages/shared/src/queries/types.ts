export type TenderizerDaysType = {
  tenderizerDays: {
    id: string;
    date: number;
    DPY: string;
    __typename: "TenderizerDay";
  }[];
};

export type UserDeploymentsType = {
  userDeployments: {
    tenderizerStake: number;
    farmHarvest: number;
    claimedRewards: number;
  }[];
};
