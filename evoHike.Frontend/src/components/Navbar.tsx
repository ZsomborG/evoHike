import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Navbar.css';
import '../styles/Navbar.css';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <nav className="navbar-container">
      <div className="nav-inner">
        <div className="navbar-logo">
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
            <NavLink to="/routeplan">{t('navbarLink1')}</NavLink>
          </li>
          <li>
            <NavLink to="/weather">{t('navbarLink2')}</NavLink>
          </li>
          <li>
            <NavLink to="/journal">{t('navbarLink3')}</NavLink>
          </li>
          <li>
            <NavLink to="/social">{t('navbarLink4')}</NavLink>
          </li>
          <li>
            <NavLink to="/contact">{t('navbarLink5')}</NavLink>
          </li>
        </ul>
        <div className="navbar-login">
          <NavLink
            to="/login"
            id="login"
            className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('navbarLink6')}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
