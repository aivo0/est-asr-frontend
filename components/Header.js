import styled from "styled-components";
import { Icon } from "evergreen-ui";
import NProgress from "nprogress";
import Link from "next/link";
import Router from "next/router";
import Nav from "./Nav";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.h1`
  margin-right: 1rem;
  position: relative;
  z-index: 2;
  margin-block-start: 0;
  margin-block-end: 0;
  cursor: pointer;
  a {
    padding: 0.5rem 1rem;
    text-underline-position: uppercase;
    text-decoration: none;
    font-family: PlayfairDisplay;
    font-size: 24px;
    font-weight: bold;
    color: #313638;
  }
  @media (max-width: 700px) {
    margin: 0;
    display: flex;
    justify-content: center;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  max-height: 90px;
  margin-left: 60px;
  @media (max-width: 700px) {
    margin: 0;
  }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 2px solid rgba(23, 42, 58, 0.1);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 700px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <InnerContainer>
            <img src="/static/logo.svg" alt="logo" />
            <a>Tekstiks</a>
          </InnerContainer>
        </Link>
      </Logo>
      <Nav />
    </div>
  </StyledHeader>
);

export default Header;
