// This cannot be server-rendered because quill library accesses the Document object directly!
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import React from "react";
import ReactDOM from "react-dom";
import { Button, Icon } from "evergreen-ui";
let BlockEmbed = Quill.import("blots/block/embed");
let Inline = Quill.import("blots/inline");
var Delta = Quill.import("delta");
import Speaker from "./Speaker";
import createOption from "../lib/createOption";

function handleClick(e) {
  //console.log(getOffset(e.target).left, getOffset(e.target).top);
  if (window.myWaveSurferPlayer) {
    window.myWaveSurferPlayer.startTime = parseFloat(
      e.target.getAttribute("start")
    );
    if (window.myWaveSurferPlayer.seekTo) {
      window.myWaveSurferPlayer.seekTo(window.myWaveSurferPlayer.startTime);
    }
  }
}

/* class WordBlot extends Inline {
  static create(value) {
    let node = super.create();
    node.addEventListener("click", handleClick, false);
    return node;
  }
}
WordBlot.blotName = "word";
WordBlot.tagName = "span";
Quill.register(WordBlot); */

const Parchment = Quill.import("parchment");
const Start = new Parchment.Attributor.Attribute("start", "start", {
  scope: Parchment.Scope.INLINE
});
Quill.register(Start, true);
const End = new Parchment.Attributor.Attribute("end", "end", {
  scope: Parchment.Scope.INLINE
});
Quill.register(End, true);
const Confidence = new Parchment.Attributor.Attribute(
  "confidence",
  "confidence",
  {
    scope: Parchment.Scope.INLINE
  }
);
Quill.register(Confidence, true);

/* const Parchment = Quill.import("parchment");
var boxAttributor = new Parchment.Attributor.Class("box", "line", {
  scope: Parchment.Scope.INLINE,
  whitelist: ["solid", "double", "dotted"]
});
Quill.register(boxAttributor); */

class SpeakerBlot extends BlockEmbed {
  static create(id) {
    let node = super.create();
    node.dataset.id = id;
    ReactDOM.render(<Speaker initial={id} />, node);
    return node;
  }
  static value(domNode) {
    return domNode.dataset.id;
  }
}
SpeakerBlot.blotName = "speaker";
SpeakerBlot.tagName = "speaker";
Quill.register(SpeakerBlot);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //text: new Delta(text)
      /* "<speaker id='1234'>Kõneleja</speaker><p>test</p>"  */
      /* this.props.html */
    }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
    window.mySpeakerDropdowns = [];
    window.mySpeakerArray = this.props.speakers.map(createOption);
  }
  componentDidMount() {
    this.attachQuillRefs();
    window.myEditorRef = this.quillRef;
    const words = new Map();
    //document.querySelector(".ql-speaker").textContent = "Kõneleja";
    ReactDOM.render(
      <Icon
        marginLeft={5}
        height={25}
        icon="new-person"
        //appearance="primary"
        //intent="success"
      />,
      document.querySelector(".ql-speaker")
    );
    const exportButton = document.createElement("div");
    exportButton.setAttribute("id", "export-button");
    document.querySelector(".ql-toolbar").appendChild(exportButton);
    ReactDOM.render(
      <Button
        marginLeft={5}
        height={25}
        iconBefore="download"
        //appearance="primary"
        //intent="success"
      >
        Lae alla
      </Button>,
      exportButton
    );
    //.addEventListener("click", e => insertStar, false);
    Array.from(document.querySelectorAll("span[start]")).forEach(el => {
      const start = Math.round(parseFloat(el.getAttribute("start")) * 100);
      const end = Math.round(parseFloat(el.getAttribute("end")) * 100);
      for (let i = start; i <= end; i++) {
        words.set(i, el);
      }
      return el.addEventListener("click", handleClick, false);
    });
    window.myEditorRef.words = words;
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }
  componentWillUnmount() {
    window.myEditorRef = undefined;
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== "function") return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  insertText = () => {
    let range = this.quillRef.getSelection(true);
    let id = "464454167226904576";
    this.quillRef.insertText(range.index, "\n", Quill.sources.USER);
    this.quillRef.insertEmbed(
      range.index + 1,
      "speaker",
      id,
      Quill.sources.USER
    );
    this.quillRef.setSelection(range.index + 2, Quill.sources.SILENT);
  };

  modules = {
    toolbar: [
      ["speaker"],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["image", "link"]
    ]
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    //"word",
    "image",
    "speaker",
    "link",
    "color",
    "font",
    "background",
    "align",
    "start",
    "end",
    "confidence"
  ];

  /* modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertStar: insertStar
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }; */

  handleChange(content, delta, source, editor) {
    //this.setState({ text: content });
    console.log(editor.getContents());
  }

  render() {
    return (
      <StyledEditor>
        <ReactQuill
          className={this.props.className}
          defaultValue={new Delta(this.props.html)}
          onChange={this.handleChange}
          modules={this.modules}
          formats={this.formats}
          ref={el => {
            this.reactQuillRef = el;
          }}
          placeholder="Kui kõne on töödeldud, siis ilmub siia kõne transkriptsioon."
        />
      </StyledEditor>
    );
  }
}

const StyledEditor = styled.div`
  .ql-toolbar {
    position: -webkit-sticky; // required for Safari ??
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
  }
  #export-button > button {
    height: 25px;
    width: auto;
    padding: 0 16px 0 16px;
  }
  .ql-speaker > button {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: normal;
    font-size: 14px;
    width: auto !important;
    height: 25px !important;
    padding: 0 0 0 10px !important;
    align-self: flex-start;
  }
  p {
    margin-bottom: 12px !important;
    color: #6f747b;
    font-size: 1.4rem;
  }
  /* a {
    color: hsl(0, 0%, 80%) !important;
  } */
  p::selection,
  span::selection,
  div::selection {
    background: rgb(235, 214, 255) !important;
  }
  .css-d8oujb,
  .css-1ep9fjw {
    display: none;
  }
  .highlighted {
    background-color: rgb(235, 214, 255);
  }
  span[confidence] {
    display: inline-block; /*bug fix*/
    position: relative;
    text-decoration: none;
  }
  span[confidence]:after {
    content: attr(confidence);
    position: absolute;
    bottom: 130%;
    left: 20%;
    background: #ff3019;
    padding: 5px 15px;
    color: white;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;
    border-radius: 10px;
    white-space: nowrap;
    opacity: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }
  span[confidence]:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 20px solid #ff3019;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    opacity: 0;
    left: 30%;
    bottom: 90%;
  }
  span[confidence]:hover:after {
    bottom: 100%;
  }
  span[confidence]:hover:before {
    bottom: 70%;
  }
  span[confidence]:hover:after,
  span[confidence]:hover:before {
    opacity: 1;
  }
`;

export default Editor;
