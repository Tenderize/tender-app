import { gql } from "@apollo/client";

export type TenderizerDays = {
  tenderizerDays: {
    id: string;
    date: number;
    DPY: string;
  }[];
};

export type UserDeployments = {
  userDeployments: {
    tenderizerStake: number;
    farmHarvest: number;
    claimedRewards: number;
  }[];
};

export type Configs = {
  configs: {
    id: string;
    tenderSwap: string;
    tenderizer: string;
    steak: string;
  }[];
};

export type CurrentPrincipal = {
  tenderizer: {
    currentPrincipal: string;
  }[];
};

export type TVLData = {
  tenderizers: {
    id: string;
    currentPrincipal: string;
  }[];
  tenderSwaps: {
    id: string;
    balances: string[];
  }[];
};

export const GetUserDeployments = gql`
  query GetUserDeployments($id: ID!) @api(contextKey: "chainId") {
    userDeployments(where: { id: $id }) {
      tenderizerStake
      farmHarvest
      claimedRewards
    }
  }
`;

export const GetDeployment = gql`
  query GetDeployment($id: ID!) @api(contextKey: "chainId") {
    deployment(id: $id) {
      id
      tenderizer {
        rewards
        rewardsUSD
      }
    }
  }
`;

export const GetTenderizerDays = gql`
  query GetDPY($from: Int!) @api(contextKey: "chainId") {
    tenderizerDays(where: { date_gt: $from }) {
      id
      date
      DPY
    }
  }
`;

export const GetConfigs = gql`
  {
    configs {
      id
      tenderSwap
      tenderizer
      steak
    }
  }
`;

export const GetCurrentPrincipal = gql`
  query getTenderizer($id: ID!) {
    tenderizer(id: $id) {
      currentPrincipal
    }
  }
`;

export const GetTVL = gql`
  query GetTVL @api(contextKey: "chainId") {
    tenderizers {
      id
      currentPrincipal
    }
    tenderSwaps {
      id
      balances
    }
  }
`;
