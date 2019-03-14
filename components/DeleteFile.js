import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { FILES_BY_USER } from "./Files";

const DELETE_FILE_MUTATION = gql`
  mutation DELETE_FILE_MUTATION($id: ID!) {
    deleteFile(id: $id) {
      id
    }
  }
`;

class DeleteFile extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the files we want
    const data = cache.readQuery({ query: FILES_BY_USER });
    console.log(data.filesByUser, payload);
    // 2. Filter the deleted file out of the page
    data.filesByUser = data.filesByUser.filter(
      file => file.id !== payload.data.deleteFile.id
    );
    // 3. Put the files back!
    cache.writeQuery({ query: FILES_BY_USER, data });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_FILE_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteFile, { error }) => (
          <button
            onClick={() => {
              if (
                confirm(
                  "Hoiatus! See kustutab ka transkriptsiooni! Oled kindel, et soovid selle faili ja sellega seotud transkriptsiooni kustutada?"
                )
              ) {
                deleteFile().catch(err => {
                  alert(err.message);
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteFile;
