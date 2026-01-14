import React from 'react';
import { MdLocationOn, MdFlag, MdDelete, MdAddLocation } from 'react-icons/md';

// itt vannak a propsok amiket kapunk
interface MapNavigationControlsProps {
  onSelectStartMode: () => void; // ez fut le ha a start gombot nyomjuk
  onSelectEndMode: () => void; // ez fut le ha a cél gombot nyomjuk
  onSelectWaypointMode: () => void; // ez fut le ha köztes pontot akarunk
  onClear: () => void; // ez törli az egészet
  selectionMode: 'start' | 'end' | 'waypoint' | null; // ez mondja meg épp mit rakunk le
}

interface ButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  color: string;
}

// ez a jobb oldali panel a gombokkal
export default function MapNavigationControls({
  onSelectStartMode,
  onSelectEndMode,
  onSelectWaypointMode,
  onClear,
  selectionMode,
}: MapNavigationControlsProps) {
  // ez egy segéd komponens a gombokhoz
  const Button = ({ onClick, isActive, icon, label, color }: ButtonProps) => (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: isActive ? '#e6f7ff' : 'white',
        border: isActive ? `2px solid ${color}` : '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '5px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'all 0.2s',
      }}>
      <div style={{ color: color, fontSize: '24px', display: 'flex' }}>
        {icon}
      </div>
    </button>
  );

  return (
    // itt van a panel jobb oldalt
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {/* start gomb zöld ikonnal */}
        <Button
          onClick={onSelectStartMode}
          isActive={selectionMode === 'start'}
          icon={<MdLocationOn />}
          color="#5cb85c"
          label="Navigáció innen (Kezdőpont)"
        />
        {/* cél gomb piros zászlóval */}
        <Button
          onClick={onSelectEndMode}
          isActive={selectionMode === 'end'}
          icon={<MdFlag />}
          color="#d9534f"
          label="Navigáció ide (Végpont)"
        />
        {/* köztes pont narancs ikonnal */}
        <Button
          onClick={onSelectWaypointMode}
          isActive={selectionMode === 'waypoint'}
          icon={<MdAddLocation />}
          color="#FF9800"
          label="Köztes pont hozzáadása"
        />
        <div style={{ height: '1px', background: '#eee', margin: '5px 0' }} />
        {/* törlés gomb szürke kukával */}
        <Button
          onClick={onClear}
          isActive={false}
          icon={<MdDelete />}
          color="#777"
          label="Navigáció törlése"
        />
      </div>
    </div>
  );
}
