import styled from "styled-components";
import Dropdown from "./Dropdown";
import Rename from "./Rename";

const StyledSpeakers = styled.div`
  display: flex;
  align-items: center;
  z-index: 10;
  a {
    margin-left: 10px;
  }
`;
const StyledHr = styled.hr`
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`;

function Speaker(props) {
  return (
    <>
      <StyledSpeakers>
        <Dropdown initial={props.initial} />
        <Rename speaker={"test"} />
      </StyledSpeakers>
      <StyledHr />
    </>
  );
}

export default Speaker;
