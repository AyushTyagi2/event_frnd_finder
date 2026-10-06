import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      gender
      dateOfBirth
      about
      interests
      profilePic
      createdAt
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser(
    $email: String!
    $password: String!
  ) {
    loginUser(
      email: $email
      password: $password
    ) {
      user {
        id
        name
        email
        gender
        dateOfBirth
        about
        interests
        profilePic
        createdAt
      }
    }
  }
`;