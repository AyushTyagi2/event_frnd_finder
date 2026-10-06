export const meetingTypeDefs = `#graphql

  enum MeetingStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  type Meeting {
    id: ID!
    matchId: ID!
    placeId: ID!
    requesterId: ID!
    recipientId: ID!
    requesterAccepted: Boolean!
    recipientAccepted: Boolean!
    status: MeetingStatus!
    createdAt: String!

    place: MeetingPlace!
  }

  extend type Query {
    meeting(id: ID!, userId: ID!): Meeting
    myMeetingRequests(userId: ID!): [Meeting!]!
  }

  extend type Mutation {
    createMeetingRequest(
      matchId: ID!
      requesterId: ID!
      placeId: ID!
    ): Meeting!

    acceptMeetingRequest(
      meetingId: ID!
      userId: ID!
    ): Meeting!

    cancelMeetingRequest(
      meetingId: ID!
      userId: ID!
    ): Meeting!
  }

`;