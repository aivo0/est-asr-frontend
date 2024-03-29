import React, { useState } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
//import { throwServerError } from "apollo-link-http-common";
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
      duration
      textTitle
      path
      state
    }
  }
`;

/* const FILE_SUBSCRIPTION = gql`
  subscription onCommentAdded($fileId: ID!) {
    updatedFile(fileId: $fileId) {
      id
      filename
      initialTranscription
      textTitle
      path
      state
    }
  }
`; */

function Transcriber(props) {
  let succeededOnce = false;
  return (
    <Query
      query={FILE_QUERY}
      variables={{ fileId: props.id }}
      pollInterval={15000}
    >
      {({ error, loading, data, startPolling, stopPolling }) => {
        if (error && !succeededOnce) return <Error error={error} />;
        if (loading) return <p>Laeb...</p>;
        if (!data.file) return <p>Ei leitud faili koodiga {props.id}</p>;
        const file = data.file;
        if (file.state === "PROCESSING_ERROR") {
          return (
            <Error
              error={{
                message:
                  "Faili transkribeerimine ebaõnnestus! Kontrolli, kas fail oli sobivas formaadis ja mitte liiga suur."
              }}
            />
          );
        }
        if (file.initialTranscription) stopPolling();
        succeededOnce = true;
        return (
          <TranscriberStyles>
            {file.initialTranscription ? (
              <>
                <Head>
                  <title>Tekstiks | {file.filename} </title>
                </Head>
                <EditorAndPlayer
                  text={file.initialTranscription}
                  path={file.path}
                  id={props.id}
                />
              </>
            ) : (
              <>
                <h1>Helisalvestist töödeldakse</h1>

                {file.duration ? (
                  <h3>
                    Oodatav töötlemise aeg on{" "}
                    {Math.round(file.duration / 60 / 2)} kuni{" "}
                    {Math.round(file.duration / 60 / 2) + 3} min.
                  </h3>
                ) : null}

                <p>
                  <b>Lehte uuendatakse automaatselt!</b> Normaalse koormuse
                  korral on töötlemise aeg ligikaudu pool helifaili kestusest.
                </p>
                <EditorAndPlayer
                  text=""
                  path={file.path}
                  id={props.id}
                  speakers={[]}
                />
              </>
            )}
          </TranscriberStyles>
        );
      }}
    </Query>
  );
}

export default Transcriber;
