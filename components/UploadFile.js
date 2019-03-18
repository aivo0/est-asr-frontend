import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const UPLOAD_FILE_MUTATION = gql`
  mutation UPLOAD_FILE(
    $title: String
    $url: String
    $duration: Float
    $fileSizeInKB: Float!
    $name: String!
  ) {
    uploadFile(
      title: $title
      url: $url
      duration: $duration
      fileSizeInKB: $fileSizeInKB
      name: $name
    ) {
      id
      duration
      state
      url
      title
      name
      fileSizeInKB
      uploader {
        id
        name
        email
      }
    }
  }
`;

class UploadFile extends Component {
  state = {
    name: "",
    title: "",
    fileSizeInKB: 0.0,
    file: "",
    format: "",
    url: "",
    isAudio: false,
    duration: 0.0
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFileToHosting = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "translate");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqiro9i65/video/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    const newState = {
      url: file.secure_url,
      format: file.format,
      //esialgu ei kasuta, aga saaks kasutajat hoiatada, kui see on usaldusväärne
      isAudio: file.is_audio,
      duration: file.duration,
      fileSizeInKB: Math.ceil(file.bytes / 1024),
      name: file.original_filename
    };
    if (this.state.title === "") newState.title = file.original_filename;
    this.setState(newState);
    console.log(this.state);
  };
  render() {
    return (
      <Mutation mutation={UPLOAD_FILE_MUTATION} variables={this.state}>
        {(uploadFile, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await uploadFile();
              console.log(res);
              Router.push({
                pathname: "/text",
                query: {
                  id: res.data.uploadFile.id,
                  duration: this.state.duration
                }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Helisalvestis
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Lae helisalvestis ülesse"
                  required
                  onChange={this.uploadFileToHosting}
                />
                {this.state.image && (
                  <img
                    width="200"
                    src={this.state.image}
                    alt="Üleslaadimise eelvaade"
                  />
                )}
              </label>

              <label htmlFor="title">
                Nimetus
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Anna salvestisele nimetus"
                  required
                  value={this.state.title}
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
