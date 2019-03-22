import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const UPLOAD_FILE_MUTATION = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
    }
  }
`;

class UploadFile extends Component {
  state = {
    file: null
  };

  handleChange = e => {
    const files = e.target.files;
    const file = files[0];
    this.setState({ file });
  };

  render() {
    return (
      <Mutation mutation={UPLOAD_FILE_MUTATION} variables={this.state}>
        {(singleUpload, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await singleUpload();
              console.log(res);
              /* Router.push({
                pathname: "/text",
                query: {
                  id: res.data.singleUpload.id,
                  duration: this.state.duration
                }
              }); */
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Helisalvestis
                <input
                  type="file"
                  accept="audio/*"
                  id="file"
                  name="file"
                  placeholder="Lae helisalvestis ülesse"
                  required
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Lae ülesse</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default UploadFile;
export { UPLOAD_FILE_MUTATION };
