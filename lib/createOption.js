const createOption = label => ({
    label,
    value: label.toLowerCase().replace(/\W/g, "")
  });

export default createOption;