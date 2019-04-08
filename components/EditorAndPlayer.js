import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import loadHtml from "../lib/loadTranscription";
//import "react-quill/dist/quill.snow.css";
import { endpoint } from "../config";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false
});
const Player = dynamic(() => import("./Player/Player"), {
  ssr: false
});

const StyledPlayer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  overflow: hidden;
  height: auto;
`;

const PageContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
`;

const EditorContainer = styled.div`
  margin-bottom: 150px;
  background: white;
  box-shadow: ${props => props.theme.bs};
`;

function EditorAndPlayer({ text, path, id /* , subscribeToFile */ }) {
  const player = useRef(null);
  const editor = useRef(null);
  /* useEffect(() => {
    subscribeToFile();
  }, []); */
  let speakerArray = [];
  let html = undefined;
  let delta = undefined;
  if (text.startsWith('{"ops":', 0)) {
    console.log("DELTA");
    delta = JSON.parse(text);
  } else {
    let { html, speakerArray } = loadHtml(text);
  }
  return (
    <PageContainer>
      <EditorContainer>
        <Editor
          html={html}
          delta={delta}
          speakers={speakerArray}
          ref={editor}
          id={id}
        />
      </EditorContainer>
      <StyledPlayer>
        <Player
          url={`${endpoint}/uploads?path=${path}`}
          //onRegionChange
          //seek
          ref={player}
          //getProgress={getProgress}
          //regions={regions}
        />
      </StyledPlayer>
    </PageContainer>
  );
}

export default EditorAndPlayer;
