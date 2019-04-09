import Transcriber from "../components/Transcriber";
import styled from "styled-components";

const Inner = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.backgroundGrey};
  min-height: 80vh;
`;

const Text = props => (
  <Inner>
    <Transcriber id={props.query.id} duration={props.query.duration} />
  </Inner>
);

export default Text;
