import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import File from "./File";

const FILES_BY_USER = gql`
  query FILES_BY_USER {
    filesByUser {
      id
      filename
      duration
      uploadedAt
      textTitle
      state
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const FilesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding-top: 30px;
`;

class Files extends Component {
  render() {
    return (
      <Center>
        <Query query={FILES_BY_USER} pollInterval={60000}>
          {({ data, error, loading, stopPolling }) => {
            if (loading) return <p>Laen...</p>;
            if (error) return <p>Viga failide laadimisel: {error.message}</p>;
            if (
              data.filesByUser.filter(file => file.state !== "READY").length ===
              0
            ) {
              stopPolling();
            }
            return (
              <FilesList>
                {data.filesByUser.map(file => (
                  <File file={file} key={file.id} />
                ))}
              </FilesList>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default Files;
export { FILES_BY_USER };
