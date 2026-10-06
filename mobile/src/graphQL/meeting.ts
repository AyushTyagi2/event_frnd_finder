import { gql } from "@apollo/client";

export const GET_MEETING_PLACES = gql`
  query GetMeetingPlaces {
    meetingPlaces {
      id
      name
      address
      createdAt
    }
  }
`;

export const CREATE_MEETING_REQUEST = gql`
  mutation CreateMeetingRequest(
    $matchId: ID!
    $requesterId: ID!
    $placeId: ID!
  ) {
    createMeetingRequest(
      matchId: $matchId
      requesterId: $requesterId
      placeId: $placeId
    ) {
      id
      matchId
      placeId
      requesterId
      recipientId
      requesterAccepted
      recipientAccepted
      status
      createdAt
      place {
        id
        name
        address
      }
    }
  }
`;