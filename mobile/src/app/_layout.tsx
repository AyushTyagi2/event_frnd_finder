import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ApolloProvider>
  );
}