import React from "react";
import { IconButton } from "evergreen-ui";
import styled from "styled-components";

const StyledControls = styled.div`
  display: flex;
  justify-content: flex-end;

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
          title="5 sekundit tagasi"
          onClick={onBackward}
          height={50}
          marginRight={16}
        />
        {playing ? (
          <IconButton
            icon="pause"
            title="Peata"
            onClick={onPause}
            height={50}
            marginRight={16}
          />
        ) : (
          <IconButton
            icon="play"
            title="Mängi"
            onClick={onPlay}
            height={50}
            marginRight={16}
          />
        )}
        <IconButton
          icon="fast-forward"
          title="5 sekundit edasi"
          onClick={onForward}
          height={50}
          marginRight={16}
        />
      </div>
      {muted ? (
        <IconButton
          className="controls__mute"
          title="Heli tagasi"
          icon="volume-off"
          onClick={toggleMute}
          height={50}
          marginRight={16}
        />
      ) : (
        <IconButton
          className="controls__mute"
          icon="volume-up"
          title="Vaigista heli"
          onClick={toggleMute}
          height={50}
          marginRight={16}
        />
      )}
    </StyledControls>
  );
}

export default PlayerControls;
