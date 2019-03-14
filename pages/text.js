import Transcriber from "../components/Transcriber";

const Text = props => (
  <div>
    <Transcriber id={props.query.id} />
  </div>
);

export default Text;
