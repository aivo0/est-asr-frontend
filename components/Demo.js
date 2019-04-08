import React, { useState } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
//import { throwServerError } from "apollo-link-http-common";
import styled from "styled-components";
import Head from "next/head";
import Error from "./ErrorMessage";
import EditorAndPlayer from "./EditorAndPlayer";

const DemoStyles = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  min-height: 600px;
`;

const DEMO_QUERY = gql`
  query DEMO_QUERY {
    demo {
      id
      filename
      initialTranscription
      textTitle
      path
      speakers
    }
  }
`;

function Demo(props) {
  return (
    <Query query={DEMO_QUERY}>
      {({ error, loading, data }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Laeb...</p>;
        if (!data.demo) return <p>Ühenduse viga, palun proovi uuesti.</p>;
        const file = data.demo;
        return (
          <DemoStyles>
            <>
              <Head>
                <title> Heli tekstiks | {file.filename} </title>
              </Head>
              <EditorAndPlayer
                text={file.initialTranscription}
                path={file.path.substring(2)}
                fileId={props.id}
                speakers={file.speakers}
                demo
              />
            </>
          </DemoStyles>
        );
      }}
    </Query>
  );
}

export default Demo;
