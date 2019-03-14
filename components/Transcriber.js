import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { throwServerError } from "apollo-link-http-common";
import styled from "styled-components";
import Head from "next/head";
import Error from "./ErrorMessage";

const TranscriberStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
`;

const FILE_QUERY = gql`
  query FILE_QUERY($fileId: ID!) {
    file(fileId: $fileId) {
      id
      title
      text {
        id
        state
      }
    }
  }
`;

class Transcriber extends Component {
  render() {
    return (
      <Query query={FILE_QUERY} variables={{ fileId: this.props.id }}>
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Laeb...</p>;
          if (!data.file) return <p>Ei leitud faili koodiga {this.props.id}</p>;
          const file = data.file;
          return (
            <TranscriberStyles>
              {file.title ? (
                <Head>
                  <title> Kõne tekstiks | {file.title} </title>
                </Head>
              ) : (
                ""
              )}
              <h1>Helisalvestist töödeldakse.</h1>
            </TranscriberStyles>
          );
        }}
      </Query>
    );
  }
}

export default Transcriber;
