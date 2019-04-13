import React, { Component } from "react";
//import { speakerArray } from "../lib/loadTranscription";
import CreatableSelect from "react-select/lib/Creatable";
import createOption from "../lib/createOption";

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: "230px",
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
    //const color = "#f75d5d";
    const fontWeight = "bold";
    const fontFamily = "open_sans";
    return { ...provided, opacity, transition, /* color, */ fontWeight };
  }
};

class Dropdown extends Component {
  value = this.props.initial === "" ? "" : createOption(this.props.initial);
  state = {
    isLoading: false,
    options: window.mySpeakerArray,
    value: this.value
  };
  componentDidMount() {
    if (
      this.value !== "" &&
      window.mySpeakerArray.findIndex(el => el.label === this.value.label) ===
        -1
    ) {
      window.mySpeakerArray = window.mySpeakerArray.concat(this.value);
      window.mySpeakerDropdowns.forEach(function(ref) {
        if (ref.current) {
          ref.current.setState({ options: window.mySpeakerArray });
        }
      });
    }
  }
  handleChange = (newValue, actionMeta) => {
    /* this.setState({ value: newValue }); */
    const label = newValue ? newValue.label : "";
    const index = window.myEditorRef.getSelection().index;
    window.myEditorRef.updateContents(
      new window.myDeltaRef().retain(index).delete(1) // Speaker is deleted
    );
    window.myEditorRef.insertEmbed(index, "speaker", label, "user");
  };
  handleCreate = inputValue => {
    this.setState({ isLoading: true });
    const { options } = this.state;
    const newOption = createOption(inputValue);
    const newOptions = [...options, newOption];
    window.mySpeakerArray = options;
    window.mySpeakerDropdowns.forEach(function(ref) {
      if (ref.current) {
        ref.current.setState({ options: newOptions });
      }
    });
    this.setState({
      isLoading: false,
      value: newOption
    });
    const index = window.myEditorRef.getSelection().index;
    window.myEditorRef.updateContents(
      new window.myDeltaRef().retain(index).delete(1) // Speaker is deleted
    );
    window.myEditorRef.insertEmbed(index, "speaker", inputValue, "user");
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
        isSearchable={true}
      />
    );
  }
}

export default Dropdown;
