import { gql } from "@apollo/client";

export const GetUserDeployments = gql`
  query GetUserDeployments($id: ID!) {
    userDeployments(where: { id: $id }) {
      tenderizerStake
      farmHarvest
    }
  }
`;

export const GetDeployments = gql`
  query GetDeployment($id: ID!) {
    deployment(id: $id) {
      id
      tenderizer {
        rewards
        rewardsUSD
      }
    }
  }
`;

export type DPYResponseType = {
  tenderizerDays: {
    id: string;
    date: number;
    DPY: string;
  }[];
};

export const GetDPY = gql`
  query GetDPY($from: Int!) {
    tenderizerDays(where: { date_gt: $from }) {
      id
      date
      DPY
    }
  }
`;
