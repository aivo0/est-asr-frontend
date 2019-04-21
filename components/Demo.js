import React from "react";
import styled from "styled-components";
import Head from "next/head";
import EditorAndPlayer from "./EditorAndPlayer";

const DemoStyles = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  min-height: 600px;
`;

function Demo({ demoPeaks, demoSpeakers, demoContent }) {
  return (
    <DemoStyles>
      <>
        <Head>
          <title>Tekstiks | Päevakaja 06.04 </title>
        </Head>
        <EditorAndPlayer
          text={demoContent}
          demoPeaks={demoPeaks}
          demoPath={"/static/Päevakaja06.04.mp3"}
          demoSpeakers={demoSpeakers}
          demo
        />
      </>
    </DemoStyles>
  );
}

export default Demo;
