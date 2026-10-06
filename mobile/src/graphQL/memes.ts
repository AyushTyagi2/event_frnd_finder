import { gql } from "@apollo/client";

export const GET_MEMES = gql`
  query GetMemes {
    memes {
      id
      imageUrl
      caption
    }
  }
`;

export const RESPOND_TO_MEME = gql`
  mutation RespondToMeme(
    $userId: ID!
    $memeId: ID!
    $response: MemeResponseType!
  ) {
    respondToMeme(
      userId: $userId
      memeId: $memeId
      response: $response
    ) {
      id
      userId
      memeId
      response
    }
  }
`;