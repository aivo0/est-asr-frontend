import React from "react";
import { IconButton, Popover, Menu, Position } from "evergreen-ui";
import styled from "styled-components";

const StyledControls = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 2px solid rgba(23, 42, 58, 0.1);
  padding-top: 2px;
  padding-bottom: 2px;
  .controls-left {
    display: flex;
    margin-left: 16px;
    align-items: center;
  }
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
    zoomIn,
    zoomOut,
    toggleRegions,
    hasRegions,
    muted,
    fasterSpeed,
    slowerSpeed,
    normalSpeed,
    playbackSpeed
  } = props;
  return (
    <StyledControls>
      <div className="controls-left">
        <Popover
          position={Position.TOP_RIGHT}
          content={
            <>
              <Menu.Group>
                <Menu>
                  {playbackSpeed < 1.8 ? (
                    <Menu.Item onSelect={() => fasterSpeed()}>
                      🐇 Kiiremini - {playbackSpeed + 0.25}x
                    </Menu.Item>
                  ) : null}
                  {playbackSpeed > 0.3 ? (
                    <Menu.Item onSelect={() => slowerSpeed()}>
                      🐌 Aeglasemalt - {playbackSpeed - 0.25}x
                    </Menu.Item>
                  ) : null}
                  <Menu.Item onSelect={() => normalSpeed()}>
                    ⏱ Normaalkiirusel - 1x
                  </Menu.Item>
                </Menu>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu>
                  <Menu.Item onSelect={() => toggleRegions()}>
                    {hasRegions
                      ? "📃Peida graafikult sõnad"
                      : "📃 Kuva graafikul sõnu "}
                  </Menu.Item>
                </Menu>
              </Menu.Group>
            </>
          }
        >
          <IconButton
            icon="properties"
            title="helimängija seaded"
            height={30}
            marginRight={16}
          />
        </Popover>
        <IconButton
          icon="zoom-in"
          title="suurenda"
          height={30}
          marginRight={6}
          onClick={zoomIn}
        />
        <IconButton
          icon="zoom-out"
          title="vähenda"
          height={30}
          onClick={zoomOut}
        />
      </div>
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
