import Parchment from "parchment";
import { EmbedBlot } from "parchment";
console.log(EmbedBlot);

class SpeakerBlot extends Parchment.EmbedBlot {
  static create(url) {
    let node = super.create();
    node.setAttribute("href", url + "HAHA");
    node.setAttribute("target", "_blank");
    node.setAttribute("title", node.textContent + "HAHA");
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute("href") || true;
  }

  format(name, value) {
    if (name === "link2" && value) {
      this.domNode.setAttribute("href", value);
    } else {
      super.format(name, value);
    }
  }

  formats() {
    let formats = super.formats();
    formats["link2"] = SpeakerBlot.formats(this.domNode);
    return formats;
  }
}
SpeakerBlot.blotName = "link2";
SpeakerBlot.tagName = "A";

Parchment.register(SpeakerBlot);
export default SpeakerBlot;
