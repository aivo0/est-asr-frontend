import React from "react";
import { IconButton } from "evergreen-ui";
import styled from "styled-components";

const StyledControls = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 2px solid rgba(23, 42, 58, 0.1);
  padding-top: 2px;
  .controls-middle {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .controls__mute {
    align-self: flex-end;
  }
`;

function PlayerControls(props) {
  const {
    onPlay,
    onPause,
    playing,
    onForward,
    onBackward,
    toggleMute,
    muted
  } = props;
  return (
    <StyledControls>
      <div className="controls-middle">
        <IconButton
          icon="fast-backward"
          title="5s tagasi (Alt+1)"
          onClick={onBackward}
          height={40}
          marginRight={16}
        />
        {playing ? (
          <IconButton
            icon="pause"
            title="Peata (Alt+2)"
            onClick={onPause}
            height={40}
            marginRight={16}
          />
        ) : (
          <IconButton
            icon="play"
            title="Mängi (Alt+2)"
            onClick={onPlay}
            height={40}
            marginRight={16}
            children="Back"
          />
        )}
        <IconButton
          icon="fast-forward"
          title="5s edasi (Alt+3)"
          onClick={onForward}
          height={40}
          marginRight={16}
        />
      </div>
      {muted ? (
        <IconButton
          className="controls__mute"
          title="Heli tagasi (Alt+M)"
          icon="volume-off"
          onClick={toggleMute}
          height={40}
          marginRight={16}
        />
      ) : (
        <IconButton
          className="controls__mute"
          icon="volume-up"
          title="Vaigista heli (Alt+M)"
          onClick={toggleMute}
          height={40}
          marginRight={16}
        />
      )}
    </StyledControls>
  );
}

export default PlayerControls;
