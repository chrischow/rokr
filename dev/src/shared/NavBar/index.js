import { Link, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { NavBarBrand } from '../NavBarBrand';

import './styles.css';

export default function NavBar(props) {
  // Create link elements
  const linkElements = props.teams.map(item => {
    return (
      <li key={'nav-' + item.slug} className="nav-item">
        <NavLink className="nav-link" to={"/" + item.slug}>
          {item.teamName}
        </NavLink>
      </li>
    );
  });

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Link className="navbar-brand" to="/">
          <NavBarBrand />
        </Link>
        <Navbar.Toggle aria-controls="navbar-main" />
        <Navbar.Collapse className="justify-content-end" id="navbar-main">
          <Nav>
            {linkElements}
            <li className="nav-item">
              <NavLink className="nav-link" to="/directory">Directory</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/timeline">Timeline</NavLink>
            </li>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}