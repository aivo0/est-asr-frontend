const loadHtml = text => {
  if (!text)
    return {
      html: [],
      speakerArray: []
    };
  const transcript = JSON.parse(text);

  const flattenSpeakerArr = (arr, idx) =>
    "name" in arr[1]
      ? [arr[0], arr[1].name]
      : [arr[0], "Kõneleja " + (idx + 1).toString()];

  const speakers = new Map(
    Object.entries(transcript.speakers).map(flattenSpeakerArr)
  );

  const filterSpeech = section => section.type === "speech";
  const mapSpeakers = speech =>
    speech.turns.map(turn => ({
      start: turn.start,
      end: turn.end,
      speaker: speakers.get(turn.speaker),
      words: turn.words
    }));
  const speech = transcript.sections.filter(filterSpeech).map(mapSpeakers);

  const mapWordsToLinks = word => {
    const obj = {
      insert: word.word_with_punctuation,
      attributes: {
        start: word.start,
        end: word.end,
        confidence: word.confidence ? word.confidence : 1
      }
    };
    // Apply color if low confidence
    if (obj.attributes.confidence < 0.7) obj.attributes.background = "#facccc";
    return [obj, { insert: " " }];
  };
  const linkReducer = (acc, val) => acc.concat(val);
  const paragraphReducer = (pAcc, p) =>
    pAcc.concat(p.reduce(linkReducer, [])).concat({ insert: "\n" });
  let prevSpeaker = "";
  const html = speech[0]
    .map(p => {
      if (p.speaker !== prevSpeaker) {
        prevSpeaker = p.speaker;
        return [{ insert: { speaker: p.speaker } }].concat(
          p.words.map(mapWordsToLinks)
        );
      } else return [].concat(p.words.map(mapWordsToLinks));
    })
    .reduce(paragraphReducer, []);

  const speakerArray = Array.from(
    new Set(Array.from(speakers).map(el => el[1]))
  );
  return { html, speakerArray };
};
export default loadHtml;
