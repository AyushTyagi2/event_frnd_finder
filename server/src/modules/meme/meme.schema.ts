export const memeTypeDefs = `#graphql

  enum MemeResponseType {
    LOVE
    MEH
    NOPE
  }

  type Meme {
    id: ID!
    imageUrl: String!
    caption: String!
  }

  type MemeResponse {
    id: ID!
    userId: ID!
    memeId: ID!
    response: MemeResponseType!
    createdAt: String!
  }

  extend type Query {
    memes: [Meme!]!
  }

  extend type Mutation {
    respondToMeme(
      userId: ID!
      memeId: ID!
      response: MemeResponseType!
    ): MemeResponse!
  }

`;