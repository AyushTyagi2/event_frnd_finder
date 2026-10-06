import { gql } from "@apollo/client";

export const GET_EVENT_BY_CODE = gql`
  query GetEventByCode($code: String!) {
    eventByCode(code: $code) {
      id
      name
      code
      profilePic
      venue
      startDate
      endDate
    }
  }
`;

export const JOIN_EVENT = gql`
  mutation JoinEvent(
    $userId: ID!
    $eventCode: String!
  ) {
    joinEvent(
      userId: $userId
      eventCode: $eventCode
    ) {
      id
      eventId
      userId
      joinedAt
    }
  }
`;