import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles data-test="nav">
          {me && (
            <>
              <Link href="/upload">
                <a>Lae fail</a>
              </Link>
              <Link href="/files">
                <a>Failid</a>
              </Link>
              <Link href="/demo">
                <a>Demo</a>
              </Link>
              <Link href="/me">
                <a>Konto</a>
              </Link>
              <Signout />
            </>
          )}
          {!me && (
            <>
              <Link href="/demo">
                <a>Demo</a>
              </Link>
              <Link href="/signup">
                <a>Logi sisse</a>
              </Link>
            </>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
