import React, { Component } from "react";
//import { speakerArray } from "../lib/loadTranscription";
import CreatableSelect from "react-select/lib/Creatable";

const createOption = label => ({
  label,
  value: label.toLowerCase().replace(/\W/g, "")
});

const speakerOptions = []; //speakerArray.map(createOption);

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: "250px",
    fontSize: "15px",
    height: "32px"
  }),
  control: (provided, state) => ({
    ...provided,
    borderWidth: "0"
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    return { ...provided, opacity, transition };
  }
};

class CreatableSingle extends Component {
  state = {
    isLoading: false,
    options: speakerOptions,
    value: createOption(this.props.initialSpeaker)
  };
  handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value: newValue });
  };
  handleCreate = inputValue => {
    this.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption
      });
    }, 1000);
  };
  render() {
    const { isLoading, options, value } = this.state;

    return (
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={this.handleChange}
        onCreateOption={this.handleCreate}
        value={value}
        styles={customStyles}
        options={options}
        loadingMessage="Laeb kõnelejaid"
        noOptionsMessage="Lisa ise kõneleja"
        placeholder="Vali kõneleja või lisa uus"
      />
    );
  }
}

export default CreatableSingle;
