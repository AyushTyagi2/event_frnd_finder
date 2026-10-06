import { gql } from "@apollo/client";

export const GET_MY_MATCHES = gql`
  query MyMatches($userId: ID!, $eventId: ID!) {
    myMatches(userId: $userId, eventId: $eventId) {
      id
      matchScore
      createdAt
      matchedUser {
        id
        name
        dateOfBirth
        about
        profilePic
        interests
      }
    }
  }
`;

export const GET_MATCH = gql`
  query Match($id: ID!, $userId: ID!) {
    match(id: $id, userId: $userId) {
      id
      matchScore
      createdAt
      matchedUser {
        id
        name
        dateOfBirth
        about
        profilePic
        interests
      }
    }
  }
`;

export const GENERATE_MATCHES = gql`
  mutation GenerateMatches($userId: ID!, $eventId: ID!) {
    generateMatches(userId: $userId, eventId: $eventId) {
      id
      eventId
      user1Id
      user2Id
      matchScore
      createdAt
    }
  }
`;