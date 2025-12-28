import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/LanguageSwitcher.css';
import { useLanguage } from '../hooks/useLanguage';

function LanguageSwitcher() {
  const { options, currentOption, changeLanguage } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      switcherRef.current &&
      !switcherRef.current.contains(event.target as Node)
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
    <div className="switcher" ref={switcherRef}>
      <button
        className="dropbtn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu">
        <img src={currentOption.flagSource} alt="Current language" />
      </button>

      {open && (
        <div className="dropdown-content">
          {options.map((option) => {
            const isActive = option.code === currentOption.code;

            return (
              <button
                key={option.code}
                onClick={() => changeLanguage(option.code)}
                disabled={isActive}
                className={`lang-option ${isActive ? 'active' : ''}`}>
                <img src={option.flagSource} alt={option.label} />
                <span>{option.short}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
