import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import File from "./File";
import User from "./User";

const FILES_BY_USER = gql`
  query FILES_BY_USER($userId: ID!) {
    filesByUser(userId: $userId) {
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
      <User>
        {({ data }) => {
          return data.me ? (
            <Center>
              <Query
                query={FILES_BY_USER}
                variables={{ userId: data.me.id }}
                pollInterval={60000}
              >
                {({ data, error, loading, stopPolling }) => {
                  if (loading) return <p>Laen...</p>;
                  if (error)
                    return <p>Viga failide laadimisel: {error.message}</p>;
                  // Disable polling when all files are in the READY state
                  if (
                    data.filesByUser.filter(file => file.state !== "READY")
                      .length === 0
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
          ) : null;
        }}
      </User>
    );
  }
}

export default Files;
export { FILES_BY_USER };
