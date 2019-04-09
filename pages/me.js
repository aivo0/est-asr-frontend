import styled from "styled-components";
import MeComponent from "../components/Me";

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const Me = props => (
  <Inner>
    <MeComponent />
  </Inner>
);

export default Me;
