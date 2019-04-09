import DemoComponent from "../components/Demo";
import styled from "styled-components";

const Inner = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.backgroundGrey};
  min-height: 80vh;
`;

const Demo = props => (
  <Inner>
    <DemoComponent id="5c9768e5857aba000713cde4" />
  </Inner>
);

export default Demo;
