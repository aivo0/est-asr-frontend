import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Badge, Spinner } from "evergreen-ui";
import styled from "styled-components";
import Title from "./styles/Title";
import FileStyles from "./styles/FileStyles";
import DeleteFile from "./DeleteFile";

const parseToMinSec = function(n) {
  const seconds = n % 60;
  const minutes = (n - seconds) / 60;
  return `${minutes} min ${Math.round(seconds)} s`;
};
const SpinnerContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  p {
    flex-grow: 0;
    padding: 0;
  }
`;

export default class Item extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired
  };
  render() {
    const { file } = this.props;
    const date = new Date(file.uploadedAt);
    let text;
    switch (file.state) {
      case "READY":
        text = (
          <Badge color="green" isSolid>
            Valmis
          </Badge>
        );
        break;
      case "PROCESSING_ERROR":
        text = (
          <Badge color="red" isSolid>
            Kõne transkribeerimine ebaõnnestus!
          </Badge>
        );
        break;
      case "PROCESSING":
        text = (
          <Badge color="yellow" isSolid>
            Faili töödeldakse
          </Badge>
        );
        break;
      case "UPLOADED":
        text = (
          <>
            <Badge color="yellow" isSolid>
              Faili töödeldakse
            </Badge>
          </>
        );
        break;
      default:
        text = "";
    }
    return (
      <FileStyles>
        <Title>
          <Link
            href={{
              pathname: "/text",
              query: { id: file.id }
            }}
          >
            <a>{file.filename}</a>
          </Link>
        </Title>
        <>
          {file.state === "UPLOADED" || file.state === "PROCESSING" ? (
            <SpinnerContainer>
              <p>Staatus:</p> {text}
              <Spinner size={15} marginLeft={2} />
            </SpinnerContainer>
          ) : (
            <p>Staatus: {text}</p>
          )}
          {file.textTitle ? <p>Text: {file.textTitle}</p> : null}
          {file.duration ? (
            <p>Kestvus: {parseToMinSec(file.duration)}</p>
          ) : null}
          {file.uploadedAt ? (
            <p>
              Laetud: {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </p>
          ) : null}
        </>

        <div className="buttonList">
          {/* <Link
            href={{
              pathname: "edit",
              query: { id: file.id }
            }}
          >
            <a>Muuda ️️✏️</a>
          </Link> */}
          <DeleteFile id={file.id}>Kustuta ❌</DeleteFile>
        </div>
      </FileStyles>
    );
  }
}
