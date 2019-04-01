import withApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
//import ApolloClient from "apollo-boost";
import { ApolloLink, Observable, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import {
  endpoint,
  prodEndpoint,
  wssEndpoint,
  prodWssEndpoint
} from "../config";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";

const wsLink = process.browser
  ? new WebSocketLink({
      uri:
        process.env.NODE_ENV === "development" ? wssEndpoint : prodWssEndpoint,
      options: {
        reconnect: true
      }
    })
  : () => {
      console.log("SSR");
    };

function createClient({ headers }) {
  const request = operation => {
    operation.setContext({
      fetchOptions: {
        credentials: "include"
      },
      headers
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const uploadLink = createUploadLink({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint
  });
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    uploadLink
  );

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      requestLink,
      link
      /* createUploadLink({
        uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint
      }) */
      /* new HttpLink({
        uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
        //credentials: "same-origin"
      }) */
    ]),
    cache: new InMemoryCache()
  });
}

export default withApollo(createClient);
