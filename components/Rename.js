import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button } from "evergreen-ui";
import createOption from "../lib/createOption";

const Container = styled.div``;

const StyledInput = styled.input`
  margin-left: 5px;
  height: 32px;
`;

const StyledA = styled.a`
  cursor: pointer;
`;

function Rename({ dropdown }) {
  const input = useRef(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const toggleEditing = () => setEditing(!editing);
  const cancelHandler = () => setEditing(false);
  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log(input.current.value);
    const newOption = createOption(input.current.value);
    const oldLabel = dropdown.current.state.value.label;
    window.mySpeakerDropdowns.forEach(ref => {
      const currentLabel = ref.current.state.value.label;
      const oldOptions = ref.current.state.options;
      const newOptions = [];
      oldOptions.forEach(el => {
        if (el.label !== oldLabel) {
          newOptions.push(el);
        }
      });
      newOptions.push(newOption);
      const newState = { options: newOptions };
      if (currentLabel === oldLabel) {
        newState.value = newOption;
      }
      ref.current.setState(newState);
      console.log(newState);
    });
    setEditing(false);
  };
  return (
    <Container>
      {editing ? (
        <>
          <label>
            <StyledInput
              name="text-input-name"
              placeholder="Uus nimetus"
              defaultValue={dropdown.current.state.value.label}
              //onBlur={blurHandler}
              ref={input}
            />
          </label>
          <Button type="submit" marginLeft={5} onClick={handleSubmit}>
            Salvesta
          </Button>
          <Button marginLeft={5} appearance="minimal" onClick={cancelHandler}>
            Tühista
          </Button>
        </>
      ) : (
        <StyledA onClick={toggleEditing}>Nimeta ümber</StyledA>
      )}
    </Container>
  );
}
export default Rename;
