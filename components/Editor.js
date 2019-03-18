// This cannot be server-rendered because quill library accesses the Document object directly!
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import React from "react";
import ReactDOM from "react-dom";
let BlockEmbed = Quill.import("blots/block/embed");
let Inline = Quill.import("blots/inline");
import Speaker from "./Speaker";

function PlayButton(props) {
  const { className, id } = props;

  const clickHandler = () => {
    if (
      window.myWaveSurferPlayer &&
      window.myWaveSurferPlayer.seekTo &&
      window.myWaveSurferPlayer.startTime
    ) {
      window.myWaveSurferPlayer.seekTo(window.myWaveSurferPlayer.startTime);
    }
  };
  return (
    <button id={id} type="button" className={className} onClick={clickHandler}>
      Mängi
    </button>
  );
}

const StyledPlayButton = styled(PlayButton)`
  color: red;
  position: absolute;
  z-index: 100;
  display: none;
`;
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}
function handleMouseEnter(e) {
  //console.log(getOffset(e.target).left, getOffset(e.target).top);
  const button = document.querySelector("#play-pop-over");
  if (button) {
    if (window.myWaveSurferPlayer) {
      window.myWaveSurferPlayer.startTime = parseFloat(
        e.target.getAttribute("href")
      );
      console.log(window.myWaveSurferPlayer.startTime);
    }
    const offsets = getOffset(e.target);
    button.style.top = offsets.top + 15 + "px";
    button.style.left = offsets.left + 5 + "px";
    button.style.display = "block";
  }
}
function handleMouseLeave(e) {
  const button = document.querySelector("#play-pop-over");
  button.style.display = "none";
  button.addEventListener(
    "mouseenter",
    e => (e.target.style.display = "block"),
    false
  );
  button.addEventListener(
    "mouseleave",
    e => (e.target.style.display = "none"),
    false
  );
}

class WordBlot extends Inline {
  static create(id, start, end) {
    let node = super.create();
    node.setAttribute("href", id);
    node.setAttribute("data-start", start);
    node.setAttribute("data-end", end);
    node.setAttribute("data-mode", "link");
    node.addEventListener("mouseenter", handleMouseEnter, false);
    node.addEventListener("mouseleave", handleMouseLeave, false);
    node.setAttribute("target", "_blank");
    return node;
  }

  static formats(node) {
    return node.getAttribute("href");
  }
}
WordBlot.blotName = "word";
WordBlot.tagName = "span";
Quill.register(WordBlot);

class SpeakerBlot extends BlockEmbed {
  static create(id) {
    let node = super.create();
    node.dataset.id = id;
    ReactDOM.render(<Speaker id={id} />, node);
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
      text:
        /* "<speaker id='1234'>Kõneleja</speaker><p>test</p>"  */
        this.props.html
    }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
  }
  componentDidMount() {
    this.attachQuillRefs();
    document
      .querySelector(".ql-speaker")
      .addEventListener("click", e => this.insertText, false);
  }

  componentDidUpdate() {
    this.attachQuillRefs();
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
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      ["image", "link"],
      ["speaker"]
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
    "word",
    "image",
    "speaker",
    "link"
  ];

  handleChange(content, delta, source, editor) {
    this.setState({ text: content });
    //console.log(editor.getContents().ops.length);
  }

  render() {
    return (
      <>
        <ReactQuill
          className={this.props.className}
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.modules}
          formats={this.formats}
          ref={el => {
            this.reactQuillRef = el;
          }}
          placeholder="Kui kõne on töödeldud, siis ilmub siia kõne transkriptsioon."
        />
        <StyledPlayButton id="play-pop-over" />
      </>
    );
  }
}

const StyledEditor = styled(Editor)`
  .ql-toolbar {
    position: -webkit-sticky; // required for Safari ??
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  p {
    margin-bottom: 12px !important;
    margin-left: 10px !important;
  }
  a {
    color: grey !important;
  }
  ::selection {
    background: #f2594b;
  }
`;

export default StyledEditor;
