import styled from "styled-components";

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const Home = props => <Inner />;

export default Home;
