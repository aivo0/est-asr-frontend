import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = props => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => (
      <button
        onClick={async e => {
          e.preventDefault();
          await signout();
          Router.push({
            pathname: "/"
          });
        }}
      >
        Logi välja
      </button>
    )}
  </Mutation>
);
export default Signout;
