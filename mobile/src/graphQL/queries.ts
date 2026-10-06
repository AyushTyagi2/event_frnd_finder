import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      code
      venue
      startDate
      endDate
    }
  }
`;