import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import File from "./File";

const FILES_BY_USER = gql`
  query FILES_BY_USER {
    filesByUser {
      id
      name
      fileSizeInKB
      state
      text {
        id
        state
      }
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
        <Query query={FILES_BY_USER} fetchPolicy="network-only">
          {({ data, error, loading }) => {
            if (loading) return <p>Laen...</p>;
            if (error) return <p>Viga failide laadimisel: {error.message}</p>;
            //console.log(data);
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
