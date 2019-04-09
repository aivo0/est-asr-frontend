import styled from "styled-components";
import { Icon } from "evergreen-ui";
import { Button } from "evergreen-ui/commonjs/buttons";
import Link from "next/link";

const Inner = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(10px, 1fr) 5fr 5fr minmax(10px, 1fr);
  grid-template-rows: auto auto auto auto auto;
  grid-column-gap: 50px;
  grid-row-gap: 20px;
  line-height: 1.5;
  justify-items: center;
  h1 {
    font-size: 48px;
  }
  p {
    font-size: 24px;
  }
  ul > div {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  span {
    font-size: 18px;
  }
  div > img {
    width: 300px;
    box-shadow: ${props => props.theme.bs};
  }
`;

const AlignLeft = styled.div`
  justify-self: center;
  grid-column-start: 2;
  grid-column-end: 3;
  min-width: 350px;
  @media (max-width: 930px) {
    grid-column-end: 4;
    min-width: 300px;
  }
`;

const AlignRight = styled.div`
  justify-self: center;
  grid-column-start: 3;
  grid-column-end: 4;
  min-width: 350px;
  @media (max-width: 930px) {
    grid-column-start: 2;
    min-width: 300px;
  }
`;

const Middle = styled.div`
  grid-column-start: 2;
  grid-column-end: 4;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin-left: 25px;
    margin-right: 25px;
  }
`;

const EditorImg = styled.img`
  box-shadow: ${props => props.theme.bs};
  align-self: center;
  grid-column-start: 3;
  grid-column-end: 4;
  @media (max-width: 930px) {
    grid-column-start: 2;
    width: 100%;
  }
  width: 450px;
`;

const Home = props => (
  <Inner>
    <AlignLeft>
      <h1>Transkriptsioon oma helisalvestisest</h1>
      <p>Heli töödeldakse algoritmi abil. Teksti täiendamisel on siin abiks:</p>
      <ul>
        <div>
          <Icon icon="headset" color="disabled" marginRight={15} size={30} />
          <span>Integreeritud helimängija</span>
        </div>
        <div>
          <Icon icon="edit" marginRight={15} size={30} />
          <span>Lihtne tekstiredaktor</span>
        </div>
        <div>
          <Icon icon="people" color="success" marginRight={15} size={30} />
          <span>
            Kõnelejatega tekstiplokid. Kõnelejate vahetumise tuvastab algoritm
            automaatselt
          </span>
        </div>
        <div>
          <Icon
            icon="cloud-download"
            color="selected"
            marginRight={15}
            size={30}
          />
          <span>Valmis teksti saab ka failina eksportida</span>
        </div>
      </ul>
    </AlignLeft>

    <EditorImg src="/static/editor50.png" alt="Tekstiredaktori kvuatõmmis" />

    <AlignLeft>
      <p>Info algoritmi ebakindlusest, et vigu oleks lihtsam leida</p>
      <img src="/static/confidence.png" />
    </AlignLeft>
    <AlignRight>
      <p>Kõnelejate valimine ja ümber nimetamine</p>
      <img src="/static/speaker_selection.png" />
    </AlignRight>
    <Middle>
      <Link href="/signup">
        <Button height={48} appearance="primary" intent="success">
          Loo konto
        </Button>
      </Link>
      <Link href="/demo">
        <Button height={48}>Vaata demo</Button>
      </Link>
    </Middle>
  </Inner>
);

export default Home;
