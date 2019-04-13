const createOption = function(label) {
  return {
    label,
    value: label.toLowerCase().replace(/\W/g, "")
  };
};

export default createOption;
