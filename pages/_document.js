import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { extractStyles } from "evergreen-ui";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    const { css, hydrationScript } = extractStyles();
    return { ...page, styleTags, css, hydrationScript };
  }

  render() {
    const { css, hydrationScript } = this.props;
    return (
      <html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </html>
    );
  }
}
