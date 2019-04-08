import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const UPDATE_FILE_TEXT_MUTATION = gql`
  mutation UPDATE_FILE_TEXT_MUTATION($id: ID!, $initialTranscription: String) {
    updateFileTextText(id: $id, initialTranscription: $initialTranscription) {
      message
    }
  }
`;

class UpdateFileText extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };
  updateFileText = async (e, updateFileTextMutation) => {
    e.preventDefault();
    console.log(this.state);
    const res = await updateFileTextMutation({
      variables: {
        id: this.props.id,
        initialTranscription: this.props.initialTranscription
      }
    });
    console.log("Updated!!");
  };

  render() {
    return (
      <Mutation
        mutation={UPDATE_FILE_TEXT_MUTATION}
        variables={{
          variables: {
            id: this.props.id,
            initialTranscription: this.props.initialTranscription
          }
        }}
      >
        {(updateFileText, { loading, error }) => (
          <button onCLick={e => this.updateFileText(e, updateFileText)}>
            Salvesta
          </button>
        )}
      </Mutation>
    );
  }
}

export default UpdateFileText;
export { UPDATE_FILE_TEXT_MUTATION };
