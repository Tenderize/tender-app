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
