import { Link, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/Navbar.css';
import '../styles/Navbar.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleClickOutside]);

  return (
    <nav className="navbar-container">
      <div className="nav-inner" ref={navbarRef}>
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
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

export default Navbar;
