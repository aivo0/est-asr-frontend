import Transcriber from "../components/Transcriber";
import styled from "styled-components";

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const Text = props => (
  <Inner>
    <Transcriber id="5c8afd6902743900072791d9" />
  </Inner>
);

export default Text;
