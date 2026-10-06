export const userTypeDefs = `#graphql

  type User {
    id: ID!
    name: String!
    email: String!
    gender: String!
    dateOfBirth: String!
    about: String
    interests: [Interest!]!
    profilePic: String
    createdAt: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    gender: String!
    dateOfBirth: String!
    about: String
    interests: [Interest!]!
    profilePic: String
  }

  type LoginResult {
    user: User!
  }

  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    loginUser(
      email: String!
      password: String!
    ): LoginResult!
  }

`;