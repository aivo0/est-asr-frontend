import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import loadHtml from "../lib/loadTranscription";
import { endpoint, prodEndpoint } from "../config";
import parseSpeakers from "../lib/parseSpeakers";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <p style={{ marginLeft: 40 + "px" }}>Laeb teksiredaktorit ...</p>
  )
});
const Player = dynamic(() => import("./Player/Player"), {
  ssr: false,
  loading: () => <p style={{ marginLeft: 40 + "px" }}>Laeb helimängijat ...</p>
});

const StyledPlayer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  overflow: hidden;
  height: auto;
  padding-bottom: 3px;
`;

const PageContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
`;

const EditorContainer = styled.div`
  min-height: 400px;
  margin-bottom: 150px;
  background: white;
  box-shadow: ${props => props.theme.bs};
`;

function EditorAndPlayer({
  text,
  demoPath,
  id,
  demoPeaks,
  path,
  demo,
  demoSpeakers
}) {
  const player = useRef(null);
  const editor = useRef(null);
  let speakers;
  let htmlContent = undefined;
  let delta = undefined;
  if (demo) {
    // Hardcoded Delta format
    delta = text;
    speakers = demoSpeakers;
  } else if (text.startsWith('{"ops":', 0)) {
    // Delta format
    delta = JSON.parse(text);
    speakers = parseSpeakers(delta);
  } else {
    // Html
    const { html, speakerArray } = loadHtml(text);
    htmlContent = html;
    speakers = speakerArray;
  }
  return (
    <>
      <PageContainer>
        <EditorContainer>
          <Editor
            html={htmlContent}
            delta={delta}
            speakers={speakers}
            ref={editor}
            id={id}
            demo={demo}
          />
        </EditorContainer>
        <StyledPlayer>
          <Player
            url={`${
              process.env.NODE_ENV === "development" ? endpoint : prodEndpoint
            }/uploads?path=${path}`}
            //onRegionChange
            //seek
            demoPeaks={demoPeaks}
            demoPath={demoPath}
            ref={player}
            demo={demo}
            //getProgress={getProgress}
            //regions={regions}
          />
        </StyledPlayer>
      </PageContainer>
    </>
  );
}

export default EditorAndPlayer;
