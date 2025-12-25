import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import '../styles/LanguageSwitcher.css';
import huFlag from '../assets/flag-for-flag-hungary-svgrepo-com.svg';
import ukFlag from '../assets/flag-for-flag-united-kingdom-svgrepo-com.svg';

type Language = 'hu' | 'en';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const changeLang = (lang: Language) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  const currentFlag = i18n.language === 'hu' ? huFlag : ukFlag;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="switcher" ref={switcherRef}>
      <button
        className="dropbtn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu">
        <img src={currentFlag} alt="Current language" />
      </button>

      {open && (
        <div className="dropdown-content">
          <button onClick={() => changeLang('hu')}>
            <img src={huFlag} alt="Hungarian" /> HU
          </button>
          <button onClick={() => changeLang('en')}>
            <img src={ukFlag} alt="English" /> UK
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
