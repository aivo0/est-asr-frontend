import styled from "styled-components";
import Dropdown from "./Dropdown";

const StyledSpeakers = styled.div`
  display: flex;
  align-items: center;
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

const Speaker = (id, node) => (
  <>
    <StyledSpeakers data-id={id.id}>
      <Dropdown initialSpeaker={id.id} />
      <a href="">Muuda nime</a>
    </StyledSpeakers>
    <StyledHr />
  </>
);

export default Speaker;
