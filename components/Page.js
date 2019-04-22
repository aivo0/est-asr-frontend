import React, { Component } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Header from "../components/Header";
import Meta from "../components/Meta";

const theme = {
  red: "#FE621D",
  black: "#393939",
  grey: "#3A3A3A",
  lightgrey: "#E1E1E1",
  backgroundGrey: "#f7f7f7",
  offWhite: "#EDEDED",
  maxWidth: "900px",
  bs: "0 12px 12px 12px rgba(0, 0, 0, 0.09)"
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 2rem;
    font-weight: normal;
    line-height: 2;
    font-family: 'open_sans';
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {  font-family: 'open_sans'; }
  div[data-evergreen-toaster-container] {
    line-height: 1;
  }
`;

export default class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <>
          <StyledPage>
            <GlobalStyle />
            <Meta />
            <Header />
            <div>{this.props.children}</div>
          </StyledPage>
        </>
      </ThemeProvider>
    );
  }
}
