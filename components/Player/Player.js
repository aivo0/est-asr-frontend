import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

import PlayerControls from "./PlayerControls";

const createRegions = entities => {
  entities.map(entity => ({
    start: entity.entityData.start,
    end: entity.entityData.end,
    drag: true,
    resize: true
  }));
};

const getRegions = (editorState, entityType = null) => {
  const content = editorState.getCurrentContent();
  const regions = [];
  content.getBlocksAsArray().forEach(block => {
    let selectedEntity = null;
    block.findEntityRanges(
      character => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              start: content.getEntity(character.getEntity()).getData().start,
              end: content.getEntity(character.getEntity()).getData().end,
              drag: true,
              resize: true,
              data: {
                entityKey: character.getEntity(),
                blockKey: block.getKey()
              }
            };
            return true;
          }
        }
        return false;
      },
      () => {
        regions.push({ ...selectedEntity });
      }
    );
  });
  return regions;
};

function Player(props, ref) {
  const wavesurfer = useRef(null);
  const seekTo = pos => {
    wavesurfer.current.play(pos);
  };
  const play = () => {
    wavesurfer.current.play();
  };
  const pause = () => {
    wavesurfer.current.pause();
  };
  const seekBackward = () => {
    wavesurfer.current.skipBackward(5);
  };
  const seekForward = () => {
    wavesurfer.current.skipForward(5);
  };
  const toggleMute = () => {
    wavesurfer.current.toggleMute();
  };
  const updateRegions = () => {
    /* wavesurfer.current.clearRegions();
      regions.forEach(region => wavesurfer.current.addRegion(region)); */
    console.log("Updating regions");
  };

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "violet",
      progressColor: "purple",
      autoCenter: true,
      bargap: 1,
      barWidth: 3,
      normalize: true,
      //partialRender: true,
      responsive: true,
      scrollParent: true,
      plugins: [
        /* RegionsPlugin.create({
            regions: [
              {
                start: 1,
                end: 3,
                drag: true,
                resize: true
              }
            ]
          }), */
        TimelinePlugin.create({
          container: waveTimelineRef.current
        })
      ]
    });

    wavesurfer.current.load(
      "https://res.cloudinary.com/dqiro9i65/video/private/s--gMEum9xT--/v1552826537/SampleAudio_0.4mb_kjgaf6.mp3"
    );
    wavesurfer.current.on("ready", function() {
      //wavesurfer.current.zoom(120);

      /* wavesurfer.current.clearRegions();
        getRegions(editorState, "WORD").forEach(region =>
          wavesurfer.current.addRegion(region)
        ); */
      console.log("Player ready");
      window.myWaveSurferPlayer = {};
      window.myWaveSurferPlayer.seekTo = seekTo;
      console.log(window.myWaveSurferPlayer.seekTo);
      setIsReady(true);
    });

    wavesurfer.current.on("pause", function() {
      setPlaying(false);
    });
    wavesurfer.current.on("play", function() {
      setPlaying(true);
    });
    /* wavesurfer.current.on("audioprocess", function(time) {
        getProgress(time);
      }); */
    wavesurfer.current.on("mute", function(value) {
      setMuted(value);
    });
    wavesurfer.current.on("region-in", function(value) {
      console.log(value);
    });

    /* return function cleanup() {
      wavesurfer.destroy();
    }; */
  }, []);
  // Regioonide lisamiseks
  /* useEffect(() => {
    console.log("clear regions", isReady);
    if (isReady) {
      wavesurfer.current.clearRegions();
      getRegions(editorState, "WORD").forEach(region =>
        wavesurfer.current.addRegion(region)
      );
    }
  }); */
  const waveRef = useRef(null);
  const waveTimelineRef = useRef(null);
  console.log("Player render");
  return (
    <div className="player-container">
      <PlayerControls
        onPlay={play}
        onPause={pause}
        playing={playing}
        onForward={seekForward}
        onBackward={seekBackward}
        toggleMute={toggleMute}
        muted={muted}
      />
      <div id="waveform" ref={waveRef} />
      <div id="wave-timeline" ref={waveTimelineRef} />
    </div>
  );
}

export default (Player = forwardRef(Player));
