import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(320px, 1fr);
  grid-template-rows: 472px minmax(472px, auto);
  line-height: 1.5;
  @media (max-width: 700px) {
    grid-template-columns: minmax(320px, 1fr);
  }
`;

const Hero = styled.div`
  /* justify-self: center; */
  grid-column-start: 1;
  grid-column-end: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  background-color: #4357ad;
  @media (max-width: 700px) {
    grid-column-end: 2;
  }

  div {
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url("/static/hero.svg");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 90%;
    height: 100%;
    background-blend-mode: multiply;
    background-color: #4357ad;
    h1 {
      font-size: 48px;
      font-weight: bold;
      color: #ffffff;
      padding-bottom: 5px;
    }
    button {
      width: 210px;
      height: 50px;
      border-radius: 30px;
      background-color: #d2f1e4;
      font-family: OpenSans;
      font-size: 18px;
      font-weight: 600;
      color: #4357ad;
      cursor: pointer;
    }
    button:hover {
      background-color: #ade4cc;
    }
  }
`;
const Message = styled.div`
  background-color: #d2f1e4;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  div {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url("/static/background.svg");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: #d2f1e4;
    background-blend-mode: multiply;
  }
  h3 {
    font-family: PlayfairDisplay;
    font-size: 36px;
    font-weight: bold;
    color: #4357ad;
  }
`;

const Features = styled.div`
  margin: 70px 20px 50px 80px;
  @media (max-width: 700px) {
    margin: 35px 20px 35px 35px;
  }
  p {
    font-family: PlayfairDisplay;
    font-size: 24px;
    font-weight: bold;
    color: #4357ad;
  }
  ul {
    margin-block-start: 0;
    padding-inline-start: 0;
  }
  li {
    color: #313638;
    display: flex;
    img {
      margin-right: 22px;
    }
    p {
      font-family: OpenSans;
      font-size: 20px;
      font-weight: normal;
      color: #313638;
    }
  }
`;

const Home = props => (
  <Container>
    <Hero>
      <div>
        <h1>Transkriptsioon oma helisalvestisest</h1>
        <Link href="/signup">
          <button>Logi sisse</button>
        </Link>
      </div>
    </Hero>
    <Message>
      <div>
        <h3>Heli töödeldakse TalTechis loodud tehnoloogiaga.</h3>
      </div>
    </Message>
    <Features>
      <p>Teksti täiendamisel on siin abiks:</p>
      <ul>
        <li>
          <img src="/static/headphones.svg" alt="helimängija" />
          <p>Integreeritud helimängija</p>
        </li>
        <li>
          <img src="/static/pencil.svg" alt="tekstiredaktor" />
          <p>Lihtne tekstiredaktor</p>
        </li>
        <li>
          <img src="/static/chatbubble.svg" alt="kõneleja-tuvastamine" />
          <p>Kõnelejate vahetumise automaatne tuvastamine</p>
        </li>
        <li>
          <img src="/static/download.svg" alt="alla-laadimine" />
          <p> Valmis teksti saab ka failina eksportida</p>
        </li>
      </ul>
    </Features>
  </Container>
);

export default Home;
