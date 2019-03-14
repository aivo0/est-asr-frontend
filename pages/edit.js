import UpdateFile from "../components/UpdateFile";

const Update = ({ query }) => (
  <div>
    <UpdateFile id={query.id} />
  </div>
);

export default Update;
