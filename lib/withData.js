import withApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink /* , Observable, split */ } from "apollo-link";
import { endpoint, prodEndpoint } from "../config";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";

export default withApollo(({ headers = {} }) => {
  //const ssrMode = !process.browser;

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
