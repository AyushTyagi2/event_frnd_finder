export const eventMemberTypeDefs = `#graphql

  type EventMember {
    id: ID!
    eventId: ID!
    userId: ID!
    joinedAt: String!
  }

  extend type Mutation {
    joinEvent(
      userId: ID!
      eventCode: String!
    ): EventMember!
  }

  extend type Query {
    eventMembers(
      eventId: ID!
    ): [EventMember!]!

    isUserInEvent(
      userId: ID!
      eventId: ID!
    ): Boolean!
  }

`;