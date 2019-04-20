const parseSpeakers = delta => {
  const speakers = new Set([]);
  delta.ops.forEach(row => {
    if (row.insert && row.insert.speaker) {
      speakers.add(row.insert.speaker);
    }
  });
  return Array.from(speakers);
};

export default parseSpeakers;
