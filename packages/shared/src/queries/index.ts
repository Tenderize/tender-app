import { gql } from "@apollo/client";

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
