import UploadFile from "../components/UploadFile";
import styled from "styled-components";

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const Upload = props => (
  <Inner>
    <UploadFile />
  </Inner>
);

export default Upload;
