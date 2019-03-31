import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div``;

function Rename(props) {
  const [editing, setEditing] = useState(false);
  const toggleEditing = () => setEditing(!editing);
  return (
    <Container>
      <a onClick={toggleEditing} href="">
        Nimeta ümber
      </a>
    </Container>
  );
}
export default Rename;
