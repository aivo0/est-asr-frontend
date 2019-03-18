import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Transcriber from "./Transcriber";
import { html, speakerArray } from "../lib/loadTranscription";

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
  height: 100vh;
`;

const EditorContainer = styled.div`
  margin-bottom: 200px;
`;

function EditorAndPlayer() {
  const player = useRef(null);
  const editor = useRef(null);
  useEffect(() => {
    console.log(player);
    console.log(editor);
  });
  return (
    <PageContainer>
      <EditorContainer>
        <Editor html={html} speakers={speakerArray} ref={editor} />
      </EditorContainer>
      <StyledPlayer>
        <Player
          url="https://res.cloudinary.com/dqiro9i65/video/private/s--Q7UDVa_C--/v1552824543/SampleAudio_0.4mb_wcgj7p.mp3"
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
