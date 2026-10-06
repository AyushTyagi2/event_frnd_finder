import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://172.22.15.184:4000/",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});