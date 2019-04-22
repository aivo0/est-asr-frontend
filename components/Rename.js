import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button, Icon } from "evergreen-ui";
import createOption from "../lib/createOption";

const Container = styled.div`
  cursor: pointer;
  @media (max-width: 450px) {
    display: none !important;
  }
`;

const StyledInput = styled.input`
  margin-left: 5px;
  height: 30px;
`;

function Rename({ dropdown }) {
  const input = useRef(null);
  const [editing, setEditing] = useState(false);
  const toggleEditing = () => setEditing(!editing);
  const cancelHandler = () => setEditing(false);
  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    const newOption = createOption(input.current.value);
    const oldLabel = dropdown.current.state.value.label;
    const index = window.myEditorRef.getSelection().index;
    window.myEditorRef.updateContents(
      new window.myDeltaRef().retain(index - 1).delete(1) // Speaker is deleted
    );
    window.myEditorRef.insertEmbed(
      index - 1,
      "speaker",
      input.current.value,
      "user"
    );
    window.mySpeakerDropdowns.forEach(ref => {
      if (ref.current) {
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
      }
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
        <Icon
          icon="edit"
          color="disabled"
          onClick={toggleEditing}
          marginTop={10}
        />
      )}
    </Container>
  );
}
export default Rename;
