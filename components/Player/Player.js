import React, { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import parseRegions from "../../lib/parseRegions";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import styled from "styled-components";

import PlayerControls from "./PlayerControls";

const Waveform = styled.div`
  .wavesurfer-region {
    border-color: #b2b0b6;
    border-style: solid;
    border-width: 0 1px 0;
    opacity: 0.3;
  }
`;
const WaveformLoader = styled.div`
  display: flex;
  justify-content: center;
`;

const getStream = response => {
  const reader = response.body.getReader();
  return new ReadableStream({
    start(controller) {
      return pump();
      function pump() {
        return reader.read().then(({ done, value }) => {
          // When no more data needs to be consumed, close the stream
          if (done) {
            controller.close();
            return;
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
          return pump();
        });
      }
    }
  });
};

const highlightWord = playerRef => {
  if (
    window.myEditorRef &&
    window.myEditorRef.getContents &&
    window.myEditorRef.words
  ) {
    const progress = Math.round(playerRef.getCurrentTime() * 100);
    const node = window.myEditorRef.words.get(progress);
    if (node) {
      if (window.myEditorRef.lastHighlighted) {
        if (window.myEditorRef.lastHighlighted !== node) {
          window.myEditorRef.lastHighlighted.setAttribute("class", null);
          node.setAttribute("class", "highlighted");
          window.myEditorRef.lastHighlighted = node;
        }
      } else {
        node.setAttribute("class", "highlighted");
        window.myEditorRef.lastHighlighted = node;
      }
    }
  }
};

function Player(props) {
  const { demoPath, url, demoPeaks, ref, demo } = props;
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState(20);
  const [hasRegions, setHasRegions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const fasterSpeed = () => {
    if (wavesurfer.current) {
      if (playbackSpeed <= 1.75) {
        wavesurfer.current.setPlaybackRate(playbackSpeed + 0.25);
        setPlaybackSpeed(playbackSpeed + 0.25);
      }
    }
  };
  const slowerSpeed = () => {
    if (wavesurfer.current) {
      if (playbackSpeed >= 0.5) {
        wavesurfer.current.setPlaybackRate(playbackSpeed - 0.25);
        setPlaybackSpeed(playbackSpeed - 0.25);
      }
    }
  };
  const normalSpeed = () => {
    if (wavesurfer.current) {
      setPlaybackSpeed(1);
      wavesurfer.current.setPlaybackRate(1);
    }
  };
  const toggleRegions = () => {
    if (wavesurfer.current) {
      wavesurfer.current.clearRegions();
      if (window.myEditorRef && window.myEditorRef.editor) {
        if (!hasRegions) {
          parseRegions(window.myEditorRef.editor.getDelta()).forEach(region =>
            wavesurfer.current.addRegion(region)
          );
          setHasRegions(true);
        } else {
          wavesurfer.current.clearRegions();
          setHasRegions(false);
        }
      }
    }
  };
  const seekTo = pos => {
    if (wavesurfer.current.getDuration() >= pos) {
      wavesurfer.current.setCurrentTime(pos);
    }
  };
  const play = () => {
    wavesurfer.current.play();
    setPlaying(true);
  };
  const pause = () => {
    wavesurfer.current.pause();
    setPlaying(false);
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
  const togglePlay = () => {
    wavesurfer.current.playPause();
    if (wavesurfer.current.isPlaying()) setPlaying(true);
    else setPlaying(false);
  };
  const zoomOut = () => {
    if (zoom > 5) setZoom(zoom - 20);
    wavesurfer.current.zoom(zoom);
  };
  const zoomIn = () => {
    if (zoom < 205) setZoom(zoom + 20);
    wavesurfer.current.zoom(zoom);
  };

  let lastNode = undefined;
  const mediaElement =
    demo &&
    !!window.chrome &&
    (!!window.chrome.webstore || !!window.chrome.runtime);
  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveRef.current,
      backend: mediaElement ? "MediaElement" : "WebAudio",
      waveColor: "violet",
      progressColor: "purple",
      autoCenter: true,
      /* bargap: 1,
      barWidth: 3, */
      normalize: true,
      height: 80,
      //partialRender: true,
      responsive: true,
      scrollParent: true,
      closeAudioContext: false,
      loopSelection: true,
      hideScrollbar: false,
      maxCanvasWidth: 4000,
      pixelRatio: 1,
      //forceDecode: true,
      plugins: [
        RegionsPlugin.create({
          regions: []
        }),
        TimelinePlugin.create({
          container: waveTimelineRef.current
        })
      ]
    });
    if (demo) {
      mediaElement
        ? wavesurfer.current.load(demoPath, demoPeaks, "metadata")
        : wavesurfer.current.load(demoPath);
    } else if (!caches || !caches.match) {
      // Should be iPhone Safari fallback
      wavesurfer.current.load(url);
    } else {
      caches.match(url).then(res => {
        if (!res) {
          caches
            .open("v1")
            .then(function(cache) {
              return cache.add(url);
            })
            .then(() => caches.match(url))
            .then(res => {
              return getStream(res);
            })
            .then(stream => {
              return new Response(stream);
            })
            .then(response => {
              return response.blob();
            })
            .then(blob => URL.createObjectURL(blob))
            .then(url => wavesurfer.current.load(url))
            .catch(err => console.error(err));
        } else {
          // TODO: remove duplication
          caches
            .match(url)
            .then(res => {
              return getStream(res);
            })
            .then(stream => {
              return new Response(stream);
            })
            .then(response => {
              return response.blob();
            })
            .then(blob => URL.createObjectURL(blob))
            .then(url => wavesurfer.current.load(url))
            .catch(err => console.error(err));
        }
      });
    }
    wavesurfer.current.on("ready", function() {
      wavesurfer.current.zoom(zoom);

      //console.log("Player ready");
      window.myWaveSurferPlayer = {};
      window.myWaveSurferPlayer.seekTo = seekTo;
      //console.log(window.myWaveSurferPlayer.seekTo);

      let isAlt = false;
      document.onkeyup = function(e) {
        if (e.which == 18) isAlt = false;
      };
      window.onkeydown = function(e) {
        switch (e.which) {
          case 18:
            isAlt = true;
            break;
          case 49:
            if (isAlt) seekBackward();
            break;
          case 50:
            if (isAlt) togglePlay();
            break;
          case 32:
            if (isAlt) togglePlay();
            break;
          case 51:
            if (isAlt) seekForward();
            break;
          case 77:
            if (isAlt) toggleMute();
            break;
        }
      };

      setIsReady(true);
    });

    wavesurfer.current.on("audioprocess", () =>
      highlightWord(wavesurfer.current)
    );
    wavesurfer.current.on("mute", function(value) {
      setMuted(value);
    });
    wavesurfer.current.on("region-in", function(value) {});

    return function cleanup() {
      wavesurfer.current.destroy();
    };
  }, []);

  const waveRef = useRef(null);
  const waveTimelineRef = useRef(null);
  return (
    <div className="player-container">
      <PlayerControls
        onPlay={play}
        onPause={pause}
        playing={playing}
        onForward={seekForward}
        onBackward={seekBackward}
        toggleMute={toggleMute}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        muted={muted}
        toggleRegions={toggleRegions}
        hasRegions={hasRegions}
        normalSpeed={normalSpeed}
        fasterSpeed={fasterSpeed}
        slowerSpeed={slowerSpeed}
        playbackSpeed={playbackSpeed}
      />
      <Waveform id="waveform" ref={waveRef} />
      <div id="wave-timeline" ref={waveTimelineRef} />
    </div>
  );
}

export default Player; //(Player = forwardRef(Player));
