import React from 'react';
import { MdLocationOn, MdFlag, MdDelete, MdAddLocation } from 'react-icons/md';

// itt vannak a propsok amiket kapunk
interface MapContextMenuProps {
  x: number; // hol van vízszintesen
  y: number; // hol van függőlegesen
  onNavFrom: () => void; // ez fut le ha innen indulunk
  onNavTo: () => void; // ez fut le ha ide megyünk
  onAddWaypoint: () => void; // ha megállót akarunk
  onClearNav: () => void; // ha törölni akarunk mindent
}

// ez a menü ami felugrik
export default function MapContextMenu({
  x,
  y,
  onNavFrom,
  onNavTo,
  onAddWaypoint,
  onClearNav,
}: MapContextMenuProps) {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    }
  };

  return (
    <div
      style={{
        position: 'fixed', // hogy ne mozduljon el
        top: y, // függőleges pozíció
        left: x, // vízszintes pozíció
        zIndex: 10000, // hogy minden felett legyen
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        padding: '5px 0',
        minWidth: '150px',
      }}>
      {/* start gomb zöld ikonnal */}
      <div
        className="context-menu-item"
        onClick={onNavFrom}
        onKeyDown={(e) => handleKeyDown(e, onNavFrom)}
        role="menuitem"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'center' }}>
        <MdLocationOn style={{ marginRight: '8px', color: '#5cb85c' }} />{' '}
        Navigáció innen
      </div>
      {/* cél gomb piros zászlóval */}
      <div
        className="context-menu-item"
        onClick={onNavTo}
        onKeyDown={(e) => handleKeyDown(e, onNavTo)}
        role="menuitem"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'center' }}>
        <MdFlag style={{ marginRight: '8px', color: '#d9534f' }} /> Navigáció
        ide
      </div>
      {/* köztes pont narancs ikonnal */}
      <div
        className="context-menu-item"
        onClick={onAddWaypoint}
        onKeyDown={(e) => handleKeyDown(e, onAddWaypoint)}
        role="menuitem"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'center' }}>
        <MdAddLocation style={{ marginRight: '8px', color: '#FF9800' }} />{' '}
        Útvonal pont hozzáadása
      </div>
      {/* törlés gomb szürke kukával */}
      <div
        className="context-menu-item"
        onClick={onClearNav}
        onKeyDown={(e) => handleKeyDown(e, onClearNav)}
        role="menuitem"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'center' }}>
        <MdDelete style={{ marginRight: '8px', color: '#777' }} /> Navigáció
        törlése
      </div>
    </div>
  );
}
