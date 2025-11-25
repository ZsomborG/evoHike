import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Navbar.css';
import '../styles/Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar-container">
      <div className="nav-inner">
        <div className="navbar-logo">
          <Link to="/">
            evo<span className="hike">Hike</span>
          </Link>
          <Link to="/">
            evo<span className="hike">Hike</span>
          </Link>
        </div>
        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          <li>
            <NavLink to="/routeplan">Tervezés</NavLink>
          </li>
          <li>
            <NavLink to="/weather">Időjárás</NavLink>
          </li>
          <li>
            <NavLink to="/journal">Túranapló</NavLink>
          </li>
          <li>
            <NavLink to="/social">Közösség</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Kapcsolat</NavLink>
          </li>
        </ul>
        <div className="navbar-login">
          <NavLink to="/login" id="login">
            Bejelentkezés
          </NavLink>
          <NavLink to="/login" id="login">
            Bejelentkezés
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
