import Files from "../components/Files";
import styled from "styled-components";

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const FilesPage = props => (
  <Inner>
    <Files />
  </Inner>
);

export default FilesPage;
