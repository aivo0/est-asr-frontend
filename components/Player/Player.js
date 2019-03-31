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

const highlightWord = playerRef => {
  if (window.myEditorRef && window.myEditorRef.getContents) {
    // check (probably) the same word that was hightlighted before
    /* if (
      text[lastHighlightIndex].attributes &&
      text[lastHighlightIndex].attributes.start
      ) {
        if (
          parseFloat(text[lastHighlightIndex].attributes.start) <= progress &&
          parseFloat(text[lastHighlightIndex].attributes.end) >= progress
          ) {
          } else {
          }
        }
        window.myEditorRef.formatText(0, 100, {
          color: "rgb(0, 0, 255)"
        }); */
    const text = window.myEditorRef.getText();
    const progress = playerRef.getCurrentTime();
    const duration = playerRef.getDuration();
    const playing = playerRef.isPlaying();
    const progressPercentage = progress / duration;
    const editorLength = window.myEditorRef.getLength();
    let estimate = Math.round(progressPercentage * editorLength);
    const avgCharLen = duration / editorLength;
    let done = false;
    let jumped = false;
    let steps = 0;
    let add = true;
    console.group("New word");
    while (!done) {
      const [leaf, offset] = window.myEditorRef.getLeaf(estimate);
      if (!leaf) break;
      const startIndex = estimate - offset;
      const endIndex = startIndex + (leaf.text ? leaf.text.length : 1);
      console.log("Node start - end", startIndex, endIndex);
      if (
        leaf.domNode &&
        leaf.domNode.parentNode &&
        leaf.domNode.parentNode.attributes &&
        leaf.domNode.parentNode.attributes.start &&
        leaf.domNode.parentNode.attributes.end
      ) {
        const start = parseFloat(
          leaf.domNode.parentNode.attributes.start.value
        );
        const end = parseFloat(leaf.domNode.parentNode.attributes.end.value);
        console.log("start, end, progress:", start, end, progress);
        // Estimate start is before the player progress
        if (start <= progress) {
          if (end >= progress) {
            done = true;
            steps++;
          } else if (!jumped && progress - end > 1) {
            const jump = Math.round((progress - start) / avgCharLen);
            jump > 0 ? (estimate = endIndex + jump) : (estimate = endIndex + 1);
            steps++;
            //jumped = true;
            add = true;
            console.log("JUMP right", jump);
          } else {
            estimate = endIndex + 1;
            steps++;
            add = true;
          }
        }
        // Estimate start is after the player progress
        else {
          if (!jumped && start - progress > 1) {
            const jump = Math.round((start - progress) / avgCharLen);
            jump > 0
              ? (estimate = startIndex - jump)
              : (estimate = startIndex - 1);
            steps++;
            //jumped = true;
            add = false;
            console.log("JUMP left", jump);
          } else {
            estimate = startIndex - 1;
            steps++;
            add = false;
          }
        }
      } else {
        add ? (estimate = endIndex + 1) : (estimate = startIndex - 1);
      }
      console.log("Estimate index", estimate);
      if (done) {
        if (window.myEditorRef.myLastHighlightedNode) {
          window.myEditorRef.myLastHighlightedNode.className = "";
        }
        window.myEditorRef.myLastHighlightedNode = leaf.domNode.parentNode;
        leaf.domNode.parentNode.className = "highlighted";
      }
      if (estimate > editorLength || estimate < 1 || steps > 20) done = true;
      // End of while loop
    }
    console.log(steps);
    console.groupEnd();
  }
};

function Player(prtext, ref) {
  const wavesurfer = useRef(null);
  const seekTo = pos => {
    if (wavesurfer.current.getDuration() >= pos)
      wavesurfer.current.seekAndCenter(pos / wavesurfer.current.getDuration());
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

  let lastNode = undefined;
  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "violet",
      progressColor: "purple",
      autoCenter: true,
      bargap: 1,
      barWidth: 3,
      normalize: true,
      height: 80,
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

    wavesurfer.current.load("/static/sample.mp3");
    wavesurfer.current.on("ready", function() {
      wavesurfer.current.zoom(10);

      /* wavesurfer.current.clearRegions();
        getRegions(editorState, "WORD").forEach(region =>
          wavesurfer.current.addRegion(region)
        ); */
      //console.log("Player ready");
      window.myWaveSurferPlayer = {};
      window.myWaveSurferPlayer.seekTo = seekTo;
      //console.log(window.myWaveSurferPlayer.seekTo);
      setIsReady(true);
    });

    wavesurfer.current.on("pause", function() {
      setPlaying(false);
    });
    wavesurfer.current.on("play", function() {
      setPlaying(true);
    });
    wavesurfer.current.on("audioprocess", () =>
      highlightWord(wavesurfer.current)
    );
    /* wavesurfer.current.on("audioprocess", function(time) {
        getProgress(time);
      }); */
    wavesurfer.current.on("mute", function(value) {
      setMuted(value);
    });
    wavesurfer.current.on("region-in", function(value) {
      console.log(value);
    });

    return function cleanup() {
      wavesurfer.current.destroy();
    };
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
