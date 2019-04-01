import React, { Component } from "react";
//import { speakerArray } from "../lib/loadTranscription";
import CreatableSelect from "react-select/lib/Creatable";
import createOption from "../lib/createOption";

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
    const color = "#f75d5d";
    const fontWeight = "bold";
    const fontFamily = "radnika_next";
    return { ...provided, opacity, transition, color, fontWeight };
  }
};

class CreatableSingle extends Component {
  state = {
    isLoading: false,
    options: window.mySpeakerArray,
    value: this.props.initial === "" ? "" : createOption(this.props.initial)
  };
  handleChange = (newValue, actionMeta) => {
    this.setState({ value: newValue });
  };
  handleCreate = inputValue => {
    this.setState({ isLoading: true });
    const { options } = this.state;
    const newOption = createOption(inputValue);
    console.log(newOption);
    console.groupEnd();
    const newOptions = [...options, newOption];
    window.mySpeakerArray = options;
    window.mySpeakerDropdowns.map(ref =>
      ref.current.setState({ options: newOptions })
    );
    this.setState({
      isLoading: false,
      value: newOption
    });
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
export { createOption };
