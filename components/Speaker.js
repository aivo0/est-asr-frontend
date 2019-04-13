import styled from "styled-components";
import Dropdown from "./Dropdown";
import Rename from "./Rename";
import React, { useRef } from "react";

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
  const dropdown = useRef(null);
  window.mySpeakerDropdowns.push(dropdown);
  return (
    <>
      <StyledSpeakers>
        <Dropdown initial={props.initial} ref={dropdown} node={props.node} />
        <Rename dropdown={dropdown} />
      </StyledSpeakers>
      <StyledHr />
    </>
  );
}

export default Speaker;
