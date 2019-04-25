// This cannot be server-rendered because quill library accesses the Document object directly!
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import React from "react";
import ReactDOM from "react-dom";
import { Button, Icon, toaster } from "evergreen-ui";
import debounce from "lodash/debounce";
let BlockEmbed = Quill.import("blots/block/embed");
var Delta = Quill.import("delta");
import Speaker from "./Speaker";
import createOption from "../lib/createOption";
import { endpoint, prodEndpoint } from "../config";

function handleClick(e) {
  if (window.myWaveSurferPlayer) {
    window.myWaveSurferPlayer.startTime = parseFloat(
      e.target.getAttribute("start")
    );
    if (window.myWaveSurferPlayer.seekTo) {
      window.myWaveSurferPlayer.seekTo(window.myWaveSurferPlayer.startTime);
    }
  }
}

const downloadHandler = (delta, author, title) => {
  const res = fetch(
    (process.env.NODE_ENV === "development" ? endpoint : prodEndpoint) +
      `/download`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(delta)
    }
  )
    .then(response => {
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transkriptsioon.docx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      console.log(a);
      a.click();
      a.remove(); //afterwards we remove the element again
    })
    .catch(e => console.log(e));
};

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

class SpeakerBlot extends BlockEmbed {
  static create(id, start, end) {
    let node = super.create();
    node.dataset.id = id;
    ReactDOM.render(<Speaker initial={id} node={node} />, node);
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
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
    this.observer = null;
    window.mySpeakerDropdowns = [];
    window.mySpeakerArray = this.props.speakers.map(createOption);
  }

  componentDidMount() {
    // Override Speaker insert
    const speakerButton = document.querySelector(".ql-speaker");
    const newSpeakerButton = speakerButton.cloneNode(true);
    speakerButton.parentNode.replaceChild(newSpeakerButton, speakerButton);
    newSpeakerButton.addEventListener("click", e => {
      e.preventDefault();
      const index = window.myEditorRef.getSelection();
      if (index) {
        window.myEditorRef.insertEmbed(index.index - 1, "speaker", "", "user");
      }
    });

    // Chrome scroll bug workarounds
    document.querySelectorAll(".ql-color-picker").forEach(function(node) {
      node.addEventListener("click", e =>
        overrideYReset(".ql-color-picker .ql-picker-item")
      );
    });
    document.querySelectorAll(".ql-header").forEach(function(node) {
      node.addEventListener("click", e =>
        overrideYReset(".ql-header .ql-picker-item")
      );
    });
    document.querySelectorAll(".ql-link").forEach(function(node) {
      node.addEventListener("click", e => overrideYReset(".ql-action"));
    });
    document.querySelectorAll(".ql-align").forEach(function(node) {
      node.addEventListener("click", e =>
        overrideYReset(".ql-align .ql-picker-item")
      );
    });
    const scroll = { pos: 0 };
    const handler = e => {
      e.preventDefault();
      window.scrollTo({
        top: scroll.pos,
        left: 0
        /* behavior: "smooth" */
      });
    };
    const overrideYReset = selector => {
      scroll.pos = window.scrollY;
      document.querySelectorAll(selector).forEach(function(node) {
        node.removeEventListener("click", handler);
        node.addEventListener("click", handler);
      });
    };

    this.attachQuillRefs();
    window.myEditorRef = this.quillRef;
    window.myDeltaRef = Delta;
    const words = new Map();
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
        onClick={() =>
          downloadHandler(window.myEditorRef.editor.getDelta(), "", "")
        }
        //appearance="primary"
        //intent="success"
      >
        Lae alla
      </Button>,
      exportButton
    );
    //.addEventListener("click", e => insertStar, false);
    /* Array.from( */
    document.querySelectorAll("span[start]").forEach(el => {
      const start = Math.round(parseFloat(el.getAttribute("start")) * 100);
      const end = Math.round(parseFloat(el.getAttribute("end")) * 100);
      for (let i = start; i <= end; i++) {
        words.set(i, el);
      }
      el.addEventListener("click", handleClick);
    });
    window.myEditorRef.words = words;

    const observedNode = document.querySelector(".ql-editor");
    // Options for the observer (which mutations to observe)
    var config = {
      childList: true,
      subtree: true
    };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (
          mutation.type == "childList" &&
          mutation.addedNodes.length > 0 &&
          mutation.target.nodeName === "P"
        ) {
          mutation.addedNodes.forEach(node => {
            if (
              node.nodeName === "SPAN" &&
              node.attributes.start &&
              node.attributes.end
            ) {
              const start = Math.round(
                parseFloat(node.getAttribute("start")) * 100
              );
              const end = Math.round(
                parseFloat(node.getAttribute("end")) * 100
              );
              for (let i = start; i <= end; i++) {
                window.myEditorRef.words.set(i, node);
              }
              node.addEventListener("click", handleClick, false);
            }
          });
        }
      }
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    this.observer.observe(observedNode, config);

    this.setState({ loaded: true });
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }
  componentWillUnmount() {
    window.myEditorRef = undefined;
    this.observer.disconnect();
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
      ["bold", "italic", "underline", "strike" /* , "blockquote" */],
      [
        { list: "ordered" },
        { list: "bullet" }
        /* { indent: "-1" },
        { indent: "+1" } */
      ],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      /* [{ font: [] }], */
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

  saveChanges = async text => {
    const res = await fetch(
      (process.env.NODE_ENV === "development" ? endpoint : prodEndpoint) +
        `/transcript?id=${this.props.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(text)
      }
    )
      .then(res => {
        toaster.success("Salvestatud!", {
          duration: 2,
          id: "saved-toast"
        });
      })
      .catch(e => {
        toaster.danger(
          "Viga automaatsel salvestamisel! Kontrolli internetiühendust.",
          {
            duration: 120,
            id: "saved-toast"
          }
        );
      });
  };
  debouncedSave = debounce(this.saveChanges, 15000, {
    leading: false,
    trailing: true
  });

  handleChange = (content, delta, source, editor) => {
    if (this.state.loaded && !this.props.demo) {
      this.debouncedSave(editor.getContents());
    }
  };

  render() {
    const defaultVal = this.props.delta
      ? this.props.delta
      : new Delta(this.props.html);
    return (
      <StyledEditor>
        <ReactQuill
          className={this.props.className}
          defaultValue={defaultVal}
          onChange={(content, delta, source, editor) =>
            this.handleChange(content, delta, source, editor)
          }
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
  .ql-container {
    min-height: 400px;
  }
  .ql-toolbar {
    position: -webkit-sticky;
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
    background: rgb(249, 204, 249) !important;
  }
  .css-d8oujb,
  .css-1ep9fjw {
    visibility: hidden;
  }
  .highlighted {
    background-color: rgb(249, 204, 249);
  }

  span[confidence] {
    position: relative;
  }
  span[confidence]:after {
    position: absolute;
    padding: 8px;
    border: 3px solid #fff;
    border-radius: 8px;
    background-color: ${props => props.theme.black};
    font-size: 0.9em;
    font-weight: bold;
    color: #fff;
    content: attr(confidence);
    min-width: 100px;
    /* width: -moz-max-content; */
    /* width: -webkit-max-content; */
    opacity: 0;
    transition: all 0.2s ease-in-out 0.25s;
    visibility: hidden;
    z-index: 2;
    bottom: 150%;
    left: -20px;
  }
  span[confidence]:hover:after {
    opacity: 1;
    visibility: visible;
    bottom: 120%;
  }

  .ql-header,
  .ql-list,
  .ql-color-picker,
  .ql-image,
  .ql-link {
    @media (max-width: 450px) {
      display: none !important;
    }
  }
  .ql-formats {
    @media (max-width: 450px) {
      margin: 0 !important;
    }
  }
`;

export default Editor;
