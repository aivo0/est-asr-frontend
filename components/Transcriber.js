import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { throwServerError } from "apollo-link-http-common";
import styled from "styled-components";
import Head from "next/head";

import Error from "./ErrorMessage";
import EditorAndPlayer from "./EditorAndPlayer";

const TranscriberStyles = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;

const FILE_QUERY = gql`
  query FILE_QUERY($fileId: ID!) {
    file(fileId: $fileId) {
      id
      filename
      initialTranscription
      textTitle
      state
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
              {file.initialTranscription ? (
                <>
                  <Head>
                    <title> Heli tekstiks | {file.title} </title>
                  </Head>
                  <EditorAndPlayer text={file.initialTranscription} />
                </>
              ) : (
                <>
                  <h1>Helisalvestist töödeldakse.</h1>
                </>
              )}
            </TranscriberStyles>
          );
        }}
      </Query>
    );
  }
}

export default Transcriber;
