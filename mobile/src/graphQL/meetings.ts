import { gql } from "@apollo/client";

export const GET_MY_MEETING_REQUESTS = gql`
  query GetMyMeetingRequests($userId: ID!) {
    myMeetingRequests(userId: $userId) {
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

export const ACCEPT_MEETING_REQUEST = gql`
  mutation AcceptMeetingRequest(
    $meetingId: ID!
    $userId: ID!
  ) {
    acceptMeetingRequest(
      meetingId: $meetingId
      userId: $userId
    ) {
      id
      status
      requesterAccepted
      recipientAccepted
      place {
        id
        name
        address
      }
    }
  }
`;

export const CANCEL_MEETING_REQUEST = gql`
  mutation CancelMeetingRequest(
    $meetingId: ID!
    $userId: ID!
  ) {
    cancelMeetingRequest(
      meetingId: $meetingId
      userId: $userId
    ) {
      id
      status
    }
  }
`;