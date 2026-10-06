export const eventTypeDefs = `#graphql

  type Event {
    id: ID!
    name: String!
    code: String!
    profilePic: String
    venue: String!
    startDate: String!
    endDate: String!
  }

  extend type Query {
    events: [Event!]!
    event(id: ID!): Event
    eventByCode(code: String!): Event
  }

`;