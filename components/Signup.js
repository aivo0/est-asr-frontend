import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: ""
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({ name: "", email: "", password: "" });
              Router.push({
                pathname: "/upload"
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Loo uus konto</h2>
              <p>
                Konto võimaldab kõnedest loodud tekstidele hiljem uuesti ligi
                pääseda.
              </p>
              <Error error={error} />
              <label htmlFor="email">
                E-post
                <input
                  type="email"
                  name="email"
                  placeholder="E-posti aadress"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="name">
                Nimi
                <input
                  type="text"
                  name="name"
                  placeholder="Nimi"
                  value={this.state.name}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Parool
                <input
                  type="password"
                  name="password"
                  placeholder="Parool"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">Loo konto</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
export { SIGNUP_MUTATION };
