import "dotenv/config";
//import { ApolloServer } from "@apollo/server";
//import { startStandaloneServer } from "@apollo/server/standalone";
//import { typeDefs } from "./schema";
//import { resolvers } from "./resolvers";
const {ApolloServer} = require("@apollo/server");
const {startStandaloneServer} = require("@apollo/server/standalone");
const {typeDefs} = require("./schema");
const {resolvers}  = require("./reslovers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4000,
    },
  });

  console.log(`🚀 GraphQL server running at ${url}`);
}

startServer();