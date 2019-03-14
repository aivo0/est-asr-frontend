import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const SINGLE_FILE_QUERY = gql`
  query SINGLE_FILE_QUERY($fileId: ID!) {
    file(fileId: $fileId) {
      id
      title
    }
  }
`;
const UPDATE_FILE_MUTATION = gql`
  mutation UPDATE_FILE_MUTATION($id: ID!, $title: String) {
    updateFile(id: $id, title: $title) {
      id
      title
    }
  }
`;

class UpdateFile extends Component {
  state = {};
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };
  updateFile = async (e, updateFileMutation) => {
    e.preventDefault();
    console.log(this.state);
    const res = await updateFileMutation({
      variables: {
        id: this.props.id,
        title: this.props.title
      }
    });
    console.log("Updated!!");
  };

  render() {
    return (
      <Query
        query={SINGLE_FILE_QUERY}
        variables={{
          fileId: this.props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Laeb...</p>;
          if (!data.file)
            return <p>Ei leitud faili identifikaatoriga {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_FILE_MUTATION} variables={this.state}>
              {(updateFile, { loading, error }) => (
                <Form onSubmit={e => this.updateFile(e, updateFile)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.file.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <button type="submit">
                      Salvesta{loading ? "mine töös" : ""}
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateFile;
export { UPDATE_FILE_MUTATION };
