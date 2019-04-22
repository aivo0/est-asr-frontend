import Transcriber from "../components/Transcriber";
import styled from "styled-components";

const Inner = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.backgroundGrey};
  min-height: 80vh;
  @media (max-width: 450px) {
    padding: 10px;
  }
  .my-survey {
    display: flex;
    justify-content: center;
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 10px;
    p,
    a {
      font-size: 16px !important;
    }
    a {
      border-bottom: 2px solid #fe621d;
    }
  }
`;

const Text = props => (
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
    <Transcriber id={props.query.id} duration={props.query.duration} />
  </Inner>
);

export default Text;
