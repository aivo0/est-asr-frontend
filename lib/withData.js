import withApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
//import ApolloClient from "apollo-boost";
import { ApolloLink, Observable, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { endpoint, prodEndpoint } from "../config";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";

function createClient({ headers }) {
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
      createUploadLink({
        uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
        headers,
        fetchOptions: {
          credentials: "include"
        }
      })
    ]),
    cache: new InMemoryCache()
  });
}

export default withApollo(({ headers = {} }) => {
  const ssrMode = !process.browser;

  /* const httpLink = new HttpLink({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint
  }); */

  const uploadLink = createUploadLink({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    headers
  });

  const contextLink = setContext(async () => ({
    fetchOptions: {
      credentials: "include"
    },
    headers
  }));

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(err =>
        console.log(`[GraphQL error]: Message: ${err.message}`)
      );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  let link = ApolloLink.from([errorLink, contextLink, uploadLink]);

  const cache = new InMemoryCache({
    dataIdFromObject: ({ id, __typename }) =>
      id && __typename ? __typename + id : null
  });

  return new ApolloClient({ link, cache });
});
