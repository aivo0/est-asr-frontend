const parseRegions = delta => {
  const regions = [];
  delta.ops.forEach(op => {
    if (op.attributes && op.attributes.start && op.attributes.end) {
      regions.push({
        start: op.attributes.start,
        end: op.attributes.end,
        drag: false,
        resize: false
      });
    }
  });
  return regions;
};

export default parseRegions;
