import React from 'react';
import { MdLocationOn, MdFlag, MdDelete, MdAddLocation } from 'react-icons/md';
import '../styles/RoutPageStyles.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  // ez egy segéd komponens a gombokhoz
  const Button = ({ onClick, isActive, icon, label, color }: ButtonProps) => (
    <button
      className={`nav-btn ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
      title={label}
      style={{ borderColor: isActive ? color : undefined }}>
      <div className="nav-btn-icon" style={{ color: color }}>
        {icon}
      </div>
    </button>
  );

  return (
    // itt van a panel jobb oldalt
    <div className="map-nav-controls">
      <div className="nav-controls-container">
        {/* start gomb zöld ikonnal */}
        <Button
          onClick={onSelectStartMode}
          isActive={selectionMode === 'start'}
          icon={<MdLocationOn />}
          color="#5cb85c"
          label={t('routePage.navFrom')}
        />
        {/* cél gomb piros zászlóval */}
        <Button
          onClick={onSelectEndMode}
          isActive={selectionMode === 'end'}
          icon={<MdFlag />}
          color="#d9534f"
          label={t('routePage.navTo')}
        />
        {/* köztes pont narancs ikonnal */}
        <Button
          onClick={onSelectWaypointMode}
          isActive={selectionMode === 'waypoint'}
          icon={<MdAddLocation />}
          color="#FF9800"
          label={t('routePage.addWaypoint')}
        />
        <div className="nav-divider" />
        {/* törlés gomb szürke kukával */}
        <Button
          onClick={onClear}
          isActive={false}
          icon={<MdDelete />}
          color="#777"
          label={t('routePage.clearNav')}
        />
      </div>
    </div>
  );
}
