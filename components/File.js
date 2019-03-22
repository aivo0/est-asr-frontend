import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Title from "./styles/Title";
import FileStyles from "./styles/FileStyles";
import DeleteFile from "./DeleteFile";

export default class Item extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired
  };

  render() {
    const { file } = this.props;
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
          <p>Staatus: {file.state}</p>
          {file.textTitle ? <p>Text: {file.textTitle}</p> : null}
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
