export const meetingPlaceTypeDefs = `#graphql

  type MeetingPlace {
    id: ID!
    name: String!
    address: String!
    createdAt: String!
  }

  extend type Query {
    meetingPlaces: [MeetingPlace!]!
    meetingPlace(id: ID!): MeetingPlace
  }

`;