export const matchTypeDefs = `#graphql

  type MatchWithUser {
    id: ID!
    matchScore: Float!
    matchedUser: User!
    createdAt: String!
  }

  type Match {
    id: ID!
    eventId: ID!
    user1Id: ID!
    user2Id: ID!
    matchScore: Float!
    createdAt: String!
  }

  extend type Query {
    myMatches(userId: ID!, eventId: ID!): [MatchWithUser!]!
    match(id: ID!, userId: ID!): MatchWithUser
  }

  extend type Mutation {
    generateMatches(userId: ID!, eventId: ID!): [Match!]!
  }

`;