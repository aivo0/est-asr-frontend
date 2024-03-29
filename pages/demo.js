import DemoComponent from "../components/Demo";
import styled from "styled-components";
import demoPeaks from "../lib/demoPeaks";
import { demoContent, demoSpeakers } from "../lib/demoContent";

const Inner = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.backgroundGrey};
  min-height: 80vh;
  @media (max-width: 450px) {
    padding: 10px;
  }
`;

const Demo = props => (
  <>
    <Inner>
      <DemoComponent
        id="5c9768e5857aba000713cde4"
        demoPeaks={demoPeaks}
        demoContent={demoContent}
        demoSpeakers={demoSpeakers}
      />
    </Inner>
  </>
);

export default Demo;
