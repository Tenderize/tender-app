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

export type APYResponseType = {
  tenderizerDays: {
    id: string;
    date: number;
    APY: string;
  }[];
};

export const GetAPY = gql`
  query GetAPY($from: Int!) {
    tenderizerDays(where: { date_gt: $from }) {
      id
      date
      APY
    }
  }
`;
