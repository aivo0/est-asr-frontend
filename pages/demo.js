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
  .my-survey {
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    p,
    a {
      font-size: 16px !important;
    }
    a {
      border-bottom: 2px solid #fe621d;
    }
  }
`;

const Demo = props => (
  <>
    <Inner>
      <div className="my-survey">
        <p>
          Palun aita kaasa mu magistritööle täites{" "}
          <a href="https://www.surveymonkey.com/r/J379RKW" target="survey">
            see 3-minutine küsimustik.
          </a>{" "}
          Tänan, Aivo Olev
        </p>
      </div>
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
