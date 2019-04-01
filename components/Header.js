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
  font-family: "Monserrat";
  font-size: 4rem;
  margin-right: 1rem;
  position: relative;
  z-index: 2;
  margin-block-start: 0;
  margin-block-end: 0;
  a {
    padding: 0.5rem 1rem;
    color: ${props => props.theme.black};
    text-underline-position: uppercase;
    text-decoration: none;
    cursor: pointer;
  }
  @media (max-width: 600px) {
    margin: 0;
    text-align: center;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 2px solid rgba(23, 42, 58, 0.1);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 600px) {
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
            <Icon icon="pulse" size={50} color="danger" marginLeft={10} />
            <a>Heli tekstiks</a>
          </InnerContainer>
        </Link>
      </Logo>
      <Nav />
    </div>
  </StyledHeader>
);

export default Header;
