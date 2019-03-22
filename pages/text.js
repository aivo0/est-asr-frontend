import Transcriber from "../components/Transcriber";
import styled from "styled-components";

const Inner = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.backgroundGrey};
`;

const Text = props => (
  <Inner>
    <Transcriber id={props.query.id} />
  </Inner>
);

export default Text;
