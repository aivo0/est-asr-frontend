wavesurfer.current.on("audioprocess", function() {
  if (window.myEditorRef && window.myEditorRef.getContents) {
    const ops = window.myEditorRef.getContents().ops;
    const progress = wavesurfer.current.getCurrentTime();
    // check (probably) the same word that was hightlighted before
    if (
      ops[lastHighlightIndex].attributes &&
      ops[lastHighlightIndex].attributes.start
    ) {
      if (
        parseFloat(ops[lastHighlightIndex].attributes.start) <= progress &&
        parseFloat(ops[lastHighlightIndex].attributes.end) >= progress
      ) {
      } else {
      }
    }
    window.myEditorRef.formatText(0, 100, {
      color: "rgb(0, 0, 255)"
    });
    const duration = wavesurfer.current.getDuration();
    const playing = wavesurfer.current.isPlaying();
    const progressPercentage = progress / duration;
    const deltaLength = ops.length;
    let estimate = Math.round(progressPercentage * deltaLength);
    const avgWordLen = duration / deltaLength;
    let done = false;
    let jumped = false;
    let steps = 0;
    let add = true;
    while (!done) {
      if (ops[estimate].attributes && ops[estimate].attributes.start) {
        const start = parseFloat(ops[estimate].attributes.start);
        // Estimate start is before the player progress
        if (start <= progress) {
          if (parseFloat(ops[estimate].attributes.end) >= progress) {
            done = true;
            steps++;
          } else if (!jumped) {
            const jump = Math.round((progress - start) / avgWordLen);
            jump > 0 ? (estimate = estimate + jump) : (estimate = estimate + 1);
            steps++;
            jumped = true;
            add = true;
          } else {
            estimate = estimate + 1;
            steps++;
            add = true;
          }
        }
        // Estimate start is after the player progress
        else {
          if (!jumped) {
            const jump = Math.round((start - progress) / avgWordLen);
            jump > 0 ? (estimate = estimate - jump) : (estimate = estimate - 1);
            steps++;
            jumped = true;
            add = false;
          } else {
            estimate = estimate - 1;
            steps++;
            add = false;
          }
        }
      } else {
        add ? (estimate = estimate + 1) : (estimate = estimate - 1);
      }
      if (estimate > deltaLength || estimate < 1 || steps > 20) done = true;
      // End of while loop
    }
    console.log(steps);
  }
});
