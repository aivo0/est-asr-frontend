import Link from "next/link";
import NavStyles from "./styles/NavStyles";
const Nav = () => (
  <NavStyles>
    <Link href="/upload">
      <a>Lae fail</a>
    </Link>
    <Link href="/files">
      <a>Failid</a>
    </Link>
    <Link href="/signup">
      <a>Loo konto</a>
    </Link>
    <Link href="/account">
      <a>Konto</a>
    </Link>
  </NavStyles>
);

export default Nav;
